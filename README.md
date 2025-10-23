# Dictionary (English → English)

An offline English dictionary built with Expo, React Native, and TypeScript. The application loads a curated SQLite
snapshot generated from the WordNet corpus and supports instant prefix and full-text lookup for definitions and usage
examples.

## Features

- 📚 **WordNet-backed content** – only English definitions and usage examples are bundled.
- 🔍 **Hybrid search** – prefix matching for fast word lookup plus FTS-powered definition search.
- 📱 **Expo/React Native UI** – clean search experience with reusable components.
- 🗃️ **Sandboxed database** – automatic copy of the bundled SQLite file to the device sandbox.

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer
- Python 3.9+

## Install JavaScript dependencies

```bash
npm install
```

## Generate the SQLite database

Binary assets cannot be committed to this repository, so the SQLite dictionary must be generated locally before running
the app. The helper script `npm run build:db` orchestrates the build:

1. Install Python dependencies:
   ```bash
   python3 -m pip install -r requirements.txt
   ```
2. Build the database (skipped automatically when the file already exists):
   ```bash
   npm run build:db
   ```

`npm run build:db` calls `scripts/ensure-database.cjs`, which invokes `scripts/build_wordnet_sqlite.py` to download the
WordNet corpus via NLTK (first run only), extract every lemma/definition/example, and write
`assets/databases/base.sqlite` with an FTS5 virtual table for search. Re-run the command whenever you need to refresh the
database. You can pass `--force` to rebuild unconditionally:

```bash
npm run build:db -- --force
```

If you prefer to call Python directly, run:

```bash
python3 scripts/build_wordnet_sqlite.py
```

Set `SKIP_DICTIONARY_BUILD=1` to bypass the helper in CI environments where the database is provided through another
channel.

> **Note:** Only English→English content (definitions and usage examples) is included in the generated database.

## Run the Expo development server

The package scripts automatically ensure the SQLite database exists before the packager boots.

```bash
npm start
```

`npm start` triggers the `prestart` hook, which runs `npm run build:db` before launching `expo start`. The Metro config
also invokes the same helper so `npx expo start` works in a pinch, but using the npm scripts keeps the workflow
consistent.

Use the terminal prompts to open the project in Expo Go, an emulator, or a development build.

## Database module

The React Native client uses `lib/database.ts` to copy `base.sqlite` from the app bundle into the sandbox (`documentDirectory/SQLite`)
and exposes helpers for prefix and full-text searches. Results are parsed into strongly typed `DictionaryEntry` objects
for the UI components.

## Licensing and attribution

- WordNet 3.1 © 2010 by the Princeton University. WordNet is provided under its own [license](https://wordnet.princeton.edu/license) and is only used to supply English definitions and examples.
- The generated SQLite database is a direct transformation of the WordNet corpus for English-only usage and must be
  produced locally before bundling or distributing the app.
- This project otherwise follows the Expo and React Native licenses for the respective frameworks and packages.
