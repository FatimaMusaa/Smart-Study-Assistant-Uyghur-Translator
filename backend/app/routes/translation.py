from typing import Literal

from fastapi import APIRouter
from pydantic import BaseModel

from app.services.translation_service import translate_to_uyghur


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
    prompt_preview: str


@router.post("/translate", response_model=TranslationResponse)
async def translate_text(payload: TranslationRequest):
    translation_result = translate_to_uyghur(
        payload.text,
        title=payload.title,
        source_language=payload.source_language,
        target_language=payload.target_language,
        source_type=payload.source_type,
        source_number=payload.source_number,
        preserve_arabic_terms=payload.preserve_arabic_terms,
        preserve_quranic_examples=payload.preserve_quranic_examples,
    )

    return TranslationResponse(
        message="Mock translation generated successfully.",
        title=payload.title,
        source_type=payload.source_type,
        source_number=payload.source_number,
        source_language=payload.source_language,
        target_language=payload.target_language,
        translated_text=translation_result["translated_text"],
        preserved_terms=translation_result["preserved_terms"],
        prompt_preview=translation_result["prompt_preview"],
    )