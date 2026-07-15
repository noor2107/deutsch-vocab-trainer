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

Create `vocabulary/session_XXX.json` with this format:

```json
[
    {
        "id": 1,
        "word": "Haus",
        "type": "noun",
        "article": "das",
        "plural": "Häuser",
        "meaning": "house",
        "example": "Das Haus ist groß."
    }
]
```

### Word types

**Nouns** (include article and plural):
```json
{
    "id": 1,
    "word": "Hund",
    "type": "noun",
    "article": "der",
    "plural": "Hunde",
    "meaning": "dog",
    "example": "Der Hund spielt."
}
```

**Verbs** (include Partizip II):
```json
{
    "id": 11,
    "word": "gehen",
    "type": "verb",
    "meaning": "to go",
    "partizip2": "gegangen",
    "example": "Ich bin gegangen."
}
```

**Adjectives**:
```json
{
    "id": 17,
    "word": "gut",
    "type": "adjective",
    "meaning": "good",
    "example": "Das ist gut."
}
```

### 2. Register the session

Add entry to `data/sessions.json`:

```json
{
    "session": 3,
    "file": "session_003.json",
    "word_count": 20,
    "completed": false
}
```

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
- `article_options`: Number of article choices (always der/die/das)

## Progress Tracking

Progress is saved in browser localStorage. To reset progress, clear localStorage for this site.

**Disclaimer:** This project is built with ChatGPT and OpenCode (Big Pickle OpenCode Zen)
