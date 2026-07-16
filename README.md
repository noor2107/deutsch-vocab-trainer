# Deutsch Vocab Trainer

A web-based German vocabulary notebook and practice tool.

## Features

- **Notebook**: Browse and search all vocabulary
- **Practice**: Track session completion and start quizzes
- **Quiz**: Test knowledge with multiple-choice questions (meaning + article)

## Project Structure

```
deutsch-vocab-trainer/
├── index.html          # Vocabulary notebook
├── practice.html       # Session list and progress
├── session.html        # Session details before quiz
├── quiz.html           # Quiz interface
├── css/
│   └── style.css       # All styles
├── js/
│   ├── utils.js        # Shared fetch helpers
│   ├── notebook.js     # Notebook page logic
│   ├── practice.js     # Practice page logic
│   ├── session.js      # Session page logic
│   └── quiz.js         # Quiz logic
├── data/
│   ├── sessions.json   # Session list
│   └── settings.json   # Quiz configuration
└── vocabulary/
    ├── session_001.json # Session 1 words
    └── session_002.json # Session 2 words
```

## Adding New Vocabulary

### 1. Create vocabulary file

Create `vocabulary/session_XXX.json` with this format. Every session must contain
exactly 20 entries, with IDs 1 through 20:

```json
[
    {
        "id": 1,
        "word": "Haus",
        "type": "noun",
        "article": "das",
        "plural": "Häuser",
        "meaning": "house",
        "examples": [
            "Das Haus ist groß.",
            "Wir wohnen in einem alten Haus."
        ]
    }
]
```

### Word types

**Nouns** (include article, plural, and two examples):
```json
{
    "id": 1,
    "word": "Hund",
    "type": "noun",
    "article": "der",
    "plural": "Hunde",
    "meaning": "dog",
    "examples": [
        "Der Hund spielt.",
        "Ich gehe mit dem Hund spazieren."
    ]
}
```

**Verbs** (include Partizip II and the perfect auxiliary):
```json
{
    "id": 11,
    "word": "gehen",
    "type": "verb",
    "meaning": "to go",
    "partizip2": "gegangen",
    "auxiliary": "sein",
    "examples": [
        "Ich gehe zu Fuß zur Arbeit.",
        "Wir sind nach Hause gegangen."
    ]
}
```

**Adjectives**:
```json
{
    "id": 17,
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

### 2. Register the session

Add entry to `data/sessions.json`:

```json
{
    "session": 3,
    "file": "session_003.json",
    "word_count": 20
}
```

The `file` value is relative to `vocabulary/`. The displayed `word_count` must
match the actual number of entries. Completion is stored per user in Firestore;
do not add a `completed` property to this file.

### Optional learning information

- `note`: a short usage or grammar note
- `comparative` and `superlative`: comparison forms when useful
- `examples`: exactly two A2-level example sentences for new vocabulary

The notebook and post-answer quiz panel display all available learning
information. Older entries with a single `example` field remain supported.

## Configuration

Edit `data/settings.json`:

```json
{
    "session_size": 20,
    "meaning_options": 4,
    "article_options": 3
}
```

- `meaning_options`: Number of answer choices for meaning questions
- Article questions always use the three choices `der`, `die`, and `das`.
- `session_size` and `article_options` are retained for compatibility but are
  not currently read by the application.

## Progress Tracking

Progress and mistakes are saved to the signed-in user's Firebase Firestore
record. Each finished attempt replaces that session's previous mistake list.
A perfect attempt marks the session complete; a later failed attempt marks it
incomplete again. Mistakes can also be cleared from the Mistakes page.

**Disclaimer:** This project was vibe-coded with the help of Codex and OpenCode.
