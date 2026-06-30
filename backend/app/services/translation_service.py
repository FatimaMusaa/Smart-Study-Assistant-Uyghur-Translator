from typing import Literal, TypedDict

from app.core.config import get_settings
from app.services.prompt_builder import build_translation_prompt


class TranslationResult(TypedDict):
    translated_text: str
    preserved_terms: list[str]
    prompt_preview: str
    provider: str


def get_preserved_terms() -> list[str]:
    return ["اسم", "فعل", "حرف", "رفع", "نصب", "جر"]


def create_mock_uyghur_translation(text: str, prompt: str) -> str:
    preview = text[:1200]

    return f"""بۇ ھازىرچە ئارقا سۇپىدىن كەلگەن سىناق تەرجىمە نۇسخىسى.

بۇ بۆلەكتە ئەسلى تېكىست ئۇيغۇرچىغا تەرجىمە قىلىنىدۇ. ئەرەبچە ئاتالغۇلار، مەسىلەن اسم، فعل، حرف، رفع، نصب، جر قاتارلىقلار ئۆز ھالىتىدە ساقلىنىدۇ.

بۇ باسقۇچتا ھەقىقىي AI تەرجىمە مودېلى تېخى ئۇلانمىدى. ئەمما backend ھازىر تەرجىمە prompt نى قۇرۇپ، كېيىنكى AI ئۇلىنىشىغا تەييار ھالەتتە.



--- ئەسلى مەزمۇننىڭ قىسقا كۆرۈنۈشى ---

{preview}
"""


def translate_with_mock(text: str, prompt: str) -> str:
    return create_mock_uyghur_translation(text, prompt)


def translate_with_openai_placeholder(text: str, prompt: str) -> str:
    raise NotImplementedError(
        "OpenAI translation provider is not implemented yet. Use TRANSLATION_PROVIDER=mock."
    )


def translate_with_gemini_placeholder(text: str, prompt: str) -> str:
    raise NotImplementedError(
        "Gemini translation provider is not implemented yet. Use TRANSLATION_PROVIDER=mock."
    )


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
        translated_text = translate_with_openai_placeholder(text, prompt)
    elif settings.translation_provider == "gemini":
        translated_text = translate_with_gemini_placeholder(text, prompt)
    else:
        translated_text = translate_with_mock(text, prompt)

    return {
        "translated_text": translated_text,
        "preserved_terms": preserved_terms,
        "prompt_preview": prompt[:1000],
        "provider": settings.translation_provider,
    }