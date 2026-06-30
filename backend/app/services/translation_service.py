from typing import TypedDict


class TranslationResult(TypedDict):
    translated_text: str
    preserved_terms: list[str]


def get_preserved_terms() -> list[str]:
    return ["اسم", "فعل", "حرف", "رفع", "نصب", "جر"]


def create_mock_uyghur_translation(text: str) -> str:
    preview = text[:1200]

    return f"""بۇ ھازىرچە ئارقا سۇپىدىن كەلگەن سىناق تەرجىمە نۇسخىسى.

بۇ بۆلەكتە ئەسلى تېكىست ئۇيغۇرچىغا تەرجىمە قىلىنىدۇ. ئەرەبچە ئاتالغۇلار، مەسىلەن اسم، فعل، حرف، رفع، نصب، جر قاتارلىقلار ئۆز ھالىتىدە ساقلىنىدۇ.

بۇ باسقۇچتا ھەقىقىي AI تەرجىمە مودېلى تېخى ئۇلانمىدى. بۇ نەتىجە پەقەت frontend بىلەن backend ئارىسىدىكى تەرجىمە يولىنى سىناش ئۈچۈن ئىشلىتىلىدۇ.

--- ئەسلى مەزمۇننىڭ قىسقا كۆرۈنۈشى ---

{preview}
"""


def translate_to_uyghur(
    text: str,
    *,
    source_language: str,
    preserve_arabic_terms: bool,
    preserve_quranic_examples: bool,
) -> TranslationResult:
    # For now, this is a mock translation.
    # Later, this function will call the real AI translation model/API.
    preserved_terms = get_preserved_terms() if preserve_arabic_terms else []

    translated_text = create_mock_uyghur_translation(text)

    return {
        "translated_text": translated_text,
        "preserved_terms": preserved_terms,
    }