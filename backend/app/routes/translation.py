from typing import Literal

from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter()


class TranslationRequest(BaseModel):
    title: str
    text: str
    source_language: str = "Mixed English + Arabic"
    target_language: str = "Uyghur"
    source_type: Literal["chapter", "page"]
    source_number: int
    preserve_arabic_terms: bool = True
    preserve_quranic_examples: bool = True


class TranslationResponse(BaseModel):
    message: str
    title: str
    source_type: Literal["chapter", "page"]
    source_number: int
    source_language: str
    target_language: str
    translated_text: str
    preserved_terms: list[str]


def create_mock_uyghur_translation(text: str) -> str:
    preview = text[:1200]

    return f"""بۇ ھازىرچە ئارقا سۇپىدىن كەلگەن سىناق تەرجىمە نۇسخىسى.

بۇ بۆلەكتە ئەسلى تېكىست ئۇيغۇرچىغا تەرجىمە قىلىنىدۇ. ئەرەبچە ئاتالغۇلار، مەسىلەن اسم، فعل، حرف، رفع، نصب، جر قاتارلىقلار ئۆز ھالىتىدە ساقلىنىدۇ.

بۇ باسقۇچتا ھەقىقىي AI تەرجىمە مودېلى تېخى ئۇلانمىدى. بۇ نەتىجە پەقەت frontend بىلەن backend ئارىسىدىكى تەرجىمە يولىنى سىناش ئۈچۈن ئىشلىتىلىدۇ.

--- ئەسلى مەزمۇننىڭ قىسقا كۆرۈنۈشى ---

{preview}
"""


@router.post("/translate", response_model=TranslationResponse)
async def translate_text(payload: TranslationRequest):
    preserved_terms = ["اسم", "فعل", "حرف", "رفع", "نصب", "جر"]

    translated_text = create_mock_uyghur_translation(payload.text)

    return TranslationResponse(
        message="Mock translation generated successfully.",
        title=payload.title,
        source_type=payload.source_type,
        source_number=payload.source_number,
        source_language=payload.source_language,
        target_language=payload.target_language,
        translated_text=translated_text,
        preserved_terms=preserved_terms,
    )