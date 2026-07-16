# Deutsch Vocab Trainer

A static German vocabulary notebook and quiz website. It uses plain HTML, CSS,
and JavaScript, with Firebase Authentication and Firestore for user progress.
There is no build step, package manager, framework, or automated test suite.

## Current behavior

- **Notebook** (`index.html`): browse, expand, and search all vocabulary sessions.
- **Practice** (`practice.html`): view completion and latest mistake counts.
- **Session** (`session.html`): review a session before starting its quiz.
- **Quiz** (`quiz.html`): answer multiple-choice meaning questions and article
  questions for entries that have an `article` field.
- **Mistakes** (`mistakes.html`): view the latest incorrect answers, grouped into
  one card per word.
- After every submitted quiz answer, the site displays the word's supported
  grammar information, examples, and usage note whether the answer was right or
  wrong.

Notebook browsing works without signing in. Practice, Quiz, and Mistakes require
Google sign-in because they read or write Firestore data.

## Project structure

```text
deutsch-vocab-trainer/
├── index.html                  # Notebook
├── practice.html               # Progress and session list
├── session.html                # Pre-quiz session page
├── quiz.html                   # Quiz
├── mistakes.html               # Latest mistakes
├── css/style.css               # All styles
├── js/
│   ├── firebase-config.js      # Firebase client configuration
│   ├── auth.js                 # Google authentication
│   ├── utils.js                # Data loading, Firestore, learning-detail rendering
│   ├── notebook.js             # Notebook behavior
│   ├── practice.js             # Practice page behavior
│   ├── session.js              # Pre-quiz page behavior
│   ├── quiz.js                 # Questions, feedback, and outcome saving
│   └── mistakes.js             # Mistake grouping and display
├── data/
│   ├── sessions.json           # Registered vocabulary sessions
│   └── settings.json           # Quiz settings
└── vocabulary/
    └── session_XXX.json        # One 20-entry vocabulary array per session
```

Do not change `js/firebase-config.js` unless the user explicitly requests a
Firebase project change.

## How data flows

1. `data/sessions.json` defines the session number, vocabulary filename, and
   displayed word count.
2. `js/utils.js` fetches the registry and the corresponding file from
   `vocabulary/`.
3. The Notebook displays the vocabulary; Quiz builds its questions directly
   from the selected session's array.
4. `saveSessionOutcome()` atomically replaces the session's previous Firestore
   mistakes and updates its completion record.
5. Practice and Mistakes read those Firestore records. Mistake counts represent
   unique mistaken words, not the number of incorrect fields.

A perfect attempt marks a session complete and clears its mistakes. A later
failed attempt marks it incomplete and replaces its mistake list with only the
new attempt's mistakes. If both meaning and article are wrong, the Mistakes page
shows one word card with two correction rows.

## Running locally

The site must be served over HTTP because it loads JSON with `fetch()`. From the
repository root, run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. If Google login rejects the local site, add
`localhost` to Firebase Authentication's authorized domains.

## Adding vocabulary

### 1. Create the session file

Create the next sequential file, such as `vocabulary/session_008.json`. Project
convention requires exactly 20 entries with sequential IDs 1 through 20. The
application does not enforce this automatically, so validate it before
publishing.

All new entries require:

- `id`: integer from 1 through 20, unique within the session
- `word`: correctly spelled and capitalized German lemma or expression
- `type`: part of speech
- `meaning`: concise English quiz answer, distinct within the session
- `examples`: exactly two grammatically correct A2-level German sentences

The supported `type` values currently used are `noun`, `verb`, `adjective`,
`adverb`, `pronoun`, `determiner`, `particle`, and `phrase`.

Noun example:

```json
{
    "id": 1,
    "word": "Hund",
    "type": "noun",
    "article": "der",
    "plural": "Hunde",
    "meaning": "dog",
    "examples": [
        "Der Hund spielt im Garten.",
        "Ich gehe mit dem Hund spazieren."
    ]
}
```

Verb example:

```json
{
    "id": 2,
    "word": "aufstehen",
    "type": "verb",
    "meaning": "to get up",
    "partizip2": "aufgestanden",
    "auxiliary": "sein",
    "note": "Separable verb: Ich stehe früh auf.",
    "examples": [
        "Ich stehe jeden Morgen um sieben Uhr auf.",
        "Am Sonntag bin ich spät aufgestanden."
    ]
}
```

Adjective example:

```json
{
    "id": 3,
    "word": "gut",
    "type": "adjective",
    "meaning": "good",
    "comparative": "besser",
    "superlative": "am besten",
    "examples": [
        "Das Essen ist gut.",
        "Heute geht es mir besser."
    ]
}
```

### Supported learning fields

`learningDetailsHtml()` in `js/utils.js` displays only these fields:

- `type`
- `article`
- `plural`
- `partizip2`
- `auxiliary`
- `comparative`
- `superlative`
- `note`
- `examples` (or the legacy singular `example` field)

Adding an arbitrary JSON property will not make it appear in the interface;
update `learningDetailsHtml()` if another field must be supported.

For nouns, use exactly one of `der`, `die`, or `das` in `article`. The presence
of `article`—not `type: "noun"`—causes an article question. Combined values such
as `der / die` cannot be answered by the current quiz.

For verbs, provide `partizip2` and `auxiliary`. Use `note` for useful separable,
reflexive, case, or usage information. Use comparison fields for adjectives
only when they are useful and natural.

Meanings in a session must be distinct. The quiz generates distractors from
other meanings in the same session and expects the number configured by
`meaning_options`.

### 2. Register the session

Append the session to `data/sessions.json`:

```json
{
    "session": 8,
    "file": "session_008.json",
    "word_count": 20
}
```

`file` is relative to `vocabulary/`. `word_count` is display-only and must match
the actual array length. Do not add `completed`; completion is user-specific
Firestore data.

### 3. Validate

Replace `008` with the session being added:

```bash
jq empty data/sessions.json vocabulary/session_008.json
jq -e 'length == 20 and ([.[].id] == [range(1;21)])' vocabulary/session_008.json
jq -e 'all(.[]; has("word") and has("type") and has("meaning") and (.examples | length == 2))' vocabulary/session_008.json
jq -r 'group_by(.word)[] | select(length > 1) | .[0].word' vocabulary/session_008.json
jq -r 'group_by(.meaning)[] | select(length > 1) | .[0].meaning' vocabulary/session_008.json
```

The last two commands should produce no output. Also run JavaScript and diff
checks after code changes:

```bash
for file in js/*.js; do node --check "$file"; done
git diff --check
```

Finally, inspect the session in the Notebook and test at least one noun and one
verb in the Quiz, including both correct and incorrect answers.

## Configuration

`data/settings.json` currently contains:

```json
{
    "session_size": 20,
    "meaning_options": 4,
    "article_options": 3
}
```

Only `meaning_options` is currently read. Article choices are hard-coded as
`der`, `die`, and `das`. `session_size` and `article_options` are retained but
unused.

## Publishing and browser caching

Local CSS and JavaScript URLs in every HTML file include a release query value,
currently `v=20260716`. When publishing changes to CSS or JavaScript, replace
that value in all HTML files so browsers request the new assets. Vocabulary,
session, and settings fetches use `cache: "no-cache"` and revalidate their data.

After deployment, verify the GitHub Pages site in a normal browser session, not
only in an incognito window.

## AI maintainer checklist

Before changing the project, an AI assistant should:

1. Read this README and inspect the relevant current files; do not assume the
   documentation overrides the code.
2. Preserve unrelated user changes and untracked files.
3. Treat vocabulary correctness as data quality work: verify spelling,
   capitalization, gender, plural, verb forms, meaning, and example grammar.
4. Keep examples at A2 level unless the user requests another level.
5. Preserve compatibility with Sessions 1–2, which use the legacy `example`
   field.
6. Do not change Firebase configuration, authentication, or stored user data
   unless explicitly requested.
7. Validate JSON, session counts, IDs, duplicate meanings, JavaScript syntax,
   and the relevant browser behavior before reporting completion.

**Disclaimer:** This project was vibe-coded with the help of Codex and OpenCode.
