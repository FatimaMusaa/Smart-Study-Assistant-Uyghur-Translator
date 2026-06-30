from typing import Literal, TypedDict

from app.services.prompt_builder import build_translation_prompt


class TranslationResult(TypedDict):
    translated_text: str
    preserved_terms: list[str]
    prompt_preview: str


def get_preserved_terms() -> list[str]:
    return ["اسم", "فعل", "حرف", "رفع", "نصب", "جر"]


def create_mock_uyghur_translation(text: str, prompt: str) -> str:
    preview = text[:1200]

    return f"""بۇ ھازىرچە ئارقا سۇپىدىن كەلگەن سىناق تەرجىمە نۇسخىسى.

بۇ بۆلەكتە ئەسلى تېكىست ئۇيغۇرچىغا تەرجىمە قىلىنىدۇ. ئەرەبچە ئاتالغۇلار، مەسىلەن اسم، فعل، حرف، رفع، نصب، جر قاتارلىقلار ئۆز ھالىتىدە ساقلىنىدۇ.

بۇ باسقۇچتا ھەقىقىي AI تەرجىمە مودېلى تېخى ئۇلانمىدى. ئەمما backend ھازىر تەرجىمە prompt نى قۇرۇپ، كېيىنكى AI ئۇلىنىشىغا تەييار ھالەتتە.

--- Prompt Preview ---

{prompt[:700]}

--- ئەسلى مەزمۇننىڭ قىسقا كۆرۈنۈشى ---

{preview}
"""


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

    translated_text = create_mock_uyghur_translation(text, prompt)

    return {
        "translated_text": translated_text,
        "preserved_terms": preserved_terms,
        "prompt_preview": prompt[:1000],
    }