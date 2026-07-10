from typing import Literal, TypedDict

from app.core.config import get_settings
from app.services.prompt_builder import (
    build_table_batch_translation_prompt,
    build_translation_prompt,
)

from app.services.providers import (
    translate_with_gemini,
    translate_with_mock,
    translate_with_openai,
)


import json
import re




class TranslationResult(TypedDict):
    translated_text: str
    preserved_terms: list[str]
    prompt_preview: str
    provider: str


def get_preserved_terms() -> list[str]:
    return ["اسم", "فعل", "حرف", "رفع", "نصب", "جر"]


def translate_to_uyghur(
    text: str,
    *,
    title: str,
    source_language: str,
    target_language: str,
    source_type: Literal["chapter", "page"],
    source_number: int,
    preserve_arabic_terms: bool,
    preserve_quranic_examples: bool,
) -> TranslationResult:
    settings = get_settings()

    preserved_terms = get_preserved_terms() if preserve_arabic_terms else []

    prompt = build_translation_prompt(
        title=title,
        text=text,
        source_language=source_language,
        target_language=target_language,
        source_type=source_type,
        source_number=source_number,
        preserve_arabic_terms=preserve_arabic_terms,
        preserve_quranic_examples=preserve_quranic_examples,
    )

    if settings.translation_provider == "mock":
        translated_text = translate_with_mock(text, prompt)

    elif settings.translation_provider == "openai":
        translated_text = translate_with_openai(
            text,
            prompt,
            settings.openai_api_key,
        )

    elif settings.translation_provider == "gemini":
        translated_text = translate_with_gemini(
            text,
            prompt,
            settings.gemini_api_key,
        )

    else:
        translated_text = translate_with_mock(text, prompt)

    return {
        "translated_text": translated_text,
        "preserved_terms": preserved_terms,
        "prompt_preview": prompt[:1000],
        "provider": settings.translation_provider,
    }



def parse_translated_table_json(raw_result: str, fallback_rows: list[list[str]]) -> list[list[str]]:
    try:
        cleaned = raw_result.strip()

        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```(?:json)?", "", cleaned)
            cleaned = re.sub(r"```$", "", cleaned).strip()

        parsed = json.loads(cleaned)
        translated_rows = parsed.get("translated_rows")

        if not isinstance(translated_rows, list):
            return fallback_rows

        return translated_rows

    except Exception:
        return fallback_rows


def contains_latin_text(text: str) -> bool:
    return bool(re.search(r"[A-Za-z]", text))


def should_translate_table_cell(cell_text: str) -> bool:
    cleaned = cell_text.strip()

    if not cleaned:
        return False

    return contains_latin_text(cleaned)





def contains_latin_text(text: str) -> bool:
    return bool(re.search(r"[A-Za-z]", text))


def should_translate_table_cell(cell_text: str) -> bool:
    cleaned = cell_text.strip()

    if not cleaned:
        return False

    return contains_latin_text(cleaned)


def collect_translatable_table_cells(rows: list[list[str]]) -> list[dict]:
    cells: list[dict] = []

    for row_index, row in enumerate(rows):
        for cell_index, cell in enumerate(row):
            cell_text = str(cell)

            if should_translate_table_cell(cell_text):
                cells.append(
                    {
                        "row_index": row_index,
                        "cell_index": cell_index,
                        "text": cell_text,
                    }
                )

    return cells


def parse_translated_cells_json(raw_result: str) -> list[dict]:
    try:
        cleaned = raw_result.strip()

        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```(?:json)?", "", cleaned)
            cleaned = re.sub(r"```$", "", cleaned).strip()

        parsed = json.loads(cleaned)
        translated_cells = parsed.get("translated_cells", [])

        if not isinstance(translated_cells, list):
            return []

        valid_cells: list[dict] = []

        for item in translated_cells:
            if not isinstance(item, dict):
                continue

            if (
                "row_index" not in item
                or "cell_index" not in item
                or "translated_text" not in item
            ):
                continue

            valid_cells.append(item)

        return valid_cells

    except Exception as error:
        print("TABLE JSON PARSE ERROR:", repr(error))
        print("RAW TABLE TRANSLATION RESULT:", raw_result)

        return []


def apply_translated_cells_to_rows(
    original_rows: list[list[str]],
    translated_cells: list[dict],
) -> list[list[str]]:
    translated_rows = [
        [str(cell) for cell in row]
        for row in original_rows
    ]

    for item in translated_cells:
        try:
            row_index = int(item["row_index"])
            cell_index = int(item["cell_index"])
            translated_text = str(item["translated_text"])

            if row_index < 0 or cell_index < 0:
                continue

            if row_index >= len(translated_rows):
                continue

            if cell_index >= len(translated_rows[row_index]):
                continue

            translated_rows[row_index][cell_index] = translated_text

        except Exception:
            continue

    return translated_rows



def translate_table_to_uyghur(
    rows: list[list[str]],
    *,
    target_language: str,
    preserve_arabic_terms: bool,
) -> dict:
    settings = get_settings()

    cells_to_translate = collect_translatable_table_cells(rows)

    if not cells_to_translate:
        return {
            "translated_rows": rows,
            "provider": settings.translation_provider,
            "prompt_preview": "No English table cells found for translation.",
        }

    prompt = build_table_batch_translation_prompt(
        cells=cells_to_translate,
        target_language=target_language,
        preserve_arabic_terms=preserve_arabic_terms,
    )

    if settings.translation_provider == "mock":
        translated_rows = rows

    elif settings.translation_provider == "gemini":
        raw_result = translate_with_gemini(
            "",
            prompt,
            settings.gemini_api_key,
        )

        translated_cells = parse_translated_cells_json(raw_result)

        if not translated_cells:
            translated_rows = rows
        else:
            translated_rows = apply_translated_cells_to_rows(rows, translated_cells)

    elif settings.translation_provider == "openai":
        raw_result = translate_with_openai(
            "",
            prompt,
            settings.openai_api_key,
        )

        translated_cells = parse_translated_cells_json(raw_result)
        if not translated_cells:
            translated_rows = rows
        else:
            translated_rows = apply_translated_cells_to_rows(rows, translated_cells)

    else:
        translated_rows = rows

    return {
        "translated_rows": translated_rows,
        "provider": settings.translation_provider,
        "prompt_preview": prompt[:1000],
    }