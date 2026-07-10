from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.translation_service import translate_table_to_uyghur, translate_to_uyghur


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
    provider: str


class TableTranslationRequest(BaseModel):
    table_number: int
    rows: list[list[str]]
    target_language: str = "Uyghur"
    preserve_arabic_terms: bool = True


class TableTranslationResponse(BaseModel):
    message: str
    table_number: int
    translated_rows: list[list[str]]
    provider: str
    prompt_preview: str


@router.post("/translate", response_model=TranslationResponse)
async def translate_text(payload: TranslationRequest):
    try:
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
            message=f"{translation_result['provider'].capitalize()} translation generated successfully.",
            title=payload.title,
            source_type=payload.source_type,
            source_number=payload.source_number,
            source_language=payload.source_language,
            target_language=payload.target_language,
            translated_text=translation_result["translated_text"],
            preserved_terms=translation_result["preserved_terms"],
            prompt_preview=translation_result["prompt_preview"],
            provider=translation_result["provider"],
        )

    except RuntimeError as error:
        raise HTTPException(
            status_code=503,
            detail=str(error),
        ) from error

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Translation failed because of an unexpected backend error.",
        ) from error


@router.post("/translate/table", response_model=TableTranslationResponse)
async def translate_table(payload: TableTranslationRequest):
    try:
        result = translate_table_to_uyghur(
            payload.rows,
            target_language=payload.target_language,
            preserve_arabic_terms=payload.preserve_arabic_terms,
        )

        return TableTranslationResponse(
            message=f"{result['provider'].capitalize()} table translation generated successfully.",
            table_number=payload.table_number,
            translated_rows=result["translated_rows"],
            provider=result["provider"],
            prompt_preview=result["prompt_preview"],
        )

    except RuntimeError as error:
        raise HTTPException(
            status_code=503,
            detail=str(error),
        ) from error

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Table translation failed because of an unexpected backend error.",
        ) from error