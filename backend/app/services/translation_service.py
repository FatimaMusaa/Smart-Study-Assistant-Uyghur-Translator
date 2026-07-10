from typing import Literal, TypedDict

from app.core.config import get_settings
from app.services.prompt_builder import (
    build_table_translation_prompt,
    build_translation_prompt,
)
from app.services.providers import (
    translate_with_gemini,
    translate_with_mock,
    translate_with_openai,
)
from app.services.prompt_builder import build_table_translation_prompt

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


def translate_table_to_uyghur(
    rows: list[list[str]],
    *,
    target_language: str,
    preserve_arabic_terms: bool,
) -> dict:
    settings = get_settings()

    prompt = build_table_translation_prompt(
        rows=rows,
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

        translated_rows = parse_translated_table_json(raw_result, rows)

    elif settings.translation_provider == "openai":
        raw_result = translate_with_openai(
            "",
            prompt,
            settings.openai_api_key,
        )

        translated_rows = parse_translated_table_json(raw_result, rows)

    else:
        translated_rows = rows

    return {
        "translated_rows": translated_rows,
        "provider": settings.translation_provider,
        "prompt_preview": prompt[:1000],
    }