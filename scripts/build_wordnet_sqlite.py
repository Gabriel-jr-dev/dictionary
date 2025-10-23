#!/usr/bin/env python3
"""Build an SQLite database for the dictionary app using NLTK's WordNet corpus."""
from __future__ import annotations

import argparse
import json
import sqlite3
from collections import defaultdict
from pathlib import Path
from typing import Iterable, List, Tuple

import nltk
from nltk.corpus import wordnet as wn


def ensure_wordnet() -> None:
    """Ensure that the WordNet corpus is available."""
    try:
        wn.ensure_loaded()
    except LookupError:
        nltk.download("wordnet")
        wn.ensure_loaded()


def iter_entries() -> Iterable[Tuple[str, str, int, str, List[str]]]:
    """Yield entries extracted from WordNet.

    Returns tuples of `(word, pos, sense_number, definition, examples)`.
    """
    sense_counts: defaultdict[Tuple[str, str], int] = defaultdict(int)

    for synset in wn.all_synsets():
        definition = synset.definition()
        examples = synset.examples()
        pos = synset.pos() or ""

        for lemma in synset.lemmas():
            word = lemma.name().replace("_", " ")
            key = (word.lower(), pos)
            sense_counts[key] += 1
            sense_number = sense_counts[key]
            yield (
                word,
                pos,
                sense_number,
                definition,
                examples,
            )


def create_schema(conn: sqlite3.Connection) -> None:
    """Create the SQLite schema."""
    conn.executescript(
        """
        PRAGMA journal_mode=WAL;
        PRAGMA synchronous=OFF;

        DROP TABLE IF EXISTS entries;
        CREATE TABLE entries (
            id INTEGER PRIMARY KEY,
            word TEXT NOT NULL,
            pos TEXT,
            sense INTEGER NOT NULL,
            definition TEXT NOT NULL,
            examples TEXT
        );

        CREATE INDEX idx_entries_word ON entries(word);

        DROP TABLE IF EXISTS entries_fts;
        CREATE VIRTUAL TABLE entries_fts USING fts5(
            word, definition, examples,
            content='entries', content_rowid='id'
        );
        """
    )


def populate(conn: sqlite3.Connection, entries: Iterable[Tuple[str, str, int, str, List[str]]]) -> None:
    """Populate the database with the extracted entries."""
    with conn:
        conn.executemany(
            """
            INSERT INTO entries(word, pos, sense, definition, examples)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                (
                    word,
                    pos,
                    sense,
                    definition,
                    json.dumps(examples, ensure_ascii=False),
                )
                for word, pos, sense, definition, examples in entries
            ),
        )
        conn.execute(
            """
            INSERT INTO entries_fts(rowid, word, definition, examples)
            SELECT id, word, definition, examples FROM entries
            """
        )


def build_database(output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(output_path) as conn:
        conn.execute("PRAGMA foreign_keys = ON;")
        create_schema(conn)
        populate(conn, iter_entries())


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("assets/databases/base.sqlite"),
        help="Destination path for the generated SQLite file.",
    )
    args = parser.parse_args()

    ensure_wordnet()
    build_database(args.output.resolve())
    print(f"Database written to {args.output.resolve()}")


if __name__ == "__main__":
    main()
