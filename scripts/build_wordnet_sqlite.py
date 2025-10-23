#!/usr/bin/env python3
"""Build an SQLite database for the dictionary app using NLTK's WordNet corpus."""
from __future__ import annotations

import argparse
import json
import sqlite3
from collections import defaultdict
from pathlib import Path
from typing import Dict, Iterable, List, Tuple

import nltk
from nltk.corpus import wordnet as wn


def ensure_wordnet() -> None:
    """Ensure that the WordNet corpus is available."""
    try:
        wn.ensure_loaded()
    except LookupError:
        nltk.download("wordnet")
        wn.ensure_loaded()


def load_extra_examples(path: Path) -> Dict[Tuple[str, str], List[str]]:
    """Load additional examples from a JSONL file.

    Each line must contain the keys ``lemma``, ``pos`` and ``sentence``.
    """
    if not path.exists():
        return {}

    extras: Dict[Tuple[str, str], List[str]] = defaultdict(list)
    with path.open("r", encoding="utf-8") as handle:
        for line_number, line in enumerate(handle, start=1):
            if not line.strip():
                continue
            try:
                payload = json.loads(line)
            except json.JSONDecodeError as exc:  # pragma: no cover - defensive
                raise ValueError(f"Invalid JSON on line {line_number} of {path}") from exc

            lemma = (payload.get("lemma") or "").strip()
            pos = (payload.get("pos") or "").strip()
            sentence = (payload.get("sentence") or "").strip()

            if not lemma or not sentence:
                continue

            key = (lemma.lower(), pos)
            extras[key].append(sentence)

    return extras


def iter_entries(extra_examples: Dict[Tuple[str, str], List[str]]) -> Iterable[Tuple[str, str, int, str, List[str]]]:
    """Yield entries extracted from WordNet enriched with extra examples."""

    sense_counts: defaultdict[Tuple[str, str], int] = defaultdict(int)
    headword_examples: Dict[Tuple[str, str], List[str]] = defaultdict(list)
    headword_seen: Dict[Tuple[str, str], set[str]] = defaultdict(set)
    extras_consumed: set[Tuple[str, str]] = set()

    for synset in wn.all_synsets():
        definition = synset.definition()
        wordnet_examples = synset.examples()
        pos = synset.pos() or ""

        for lemma in synset.lemmas():
            word = lemma.name().replace("_", " ")
            key = (word.lower(), pos)
            sense_counts[key] += 1
            sense_number = sense_counts[key]

            examples_for_headword = headword_examples[key]
            seen_examples = headword_seen[key]

            for example in wordnet_examples:
                example_text = example.strip()
                if example_text and example_text not in seen_examples and len(examples_for_headword) < 12:
                    examples_for_headword.append(example_text)
                    seen_examples.add(example_text)

            if key not in extras_consumed:
                for extra_example in extra_examples.get(key, []):
                    if len(examples_for_headword) >= 12:
                        break
                    example_text = extra_example.strip()
                    if example_text and example_text not in seen_examples:
                        examples_for_headword.append(example_text)
                        seen_examples.add(example_text)
                extras_consumed.add(key)

            yield (
                word,
                pos,
                sense_number,
                definition,
                list(examples_for_headword),
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
        extra_examples_path = Path("extras/examples_en.jsonl")
        extra_examples = load_extra_examples(extra_examples_path)
        populate(conn, iter_entries(extra_examples))


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
