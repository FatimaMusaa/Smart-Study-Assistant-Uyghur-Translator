from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.services.docx_exporter import (
    build_combined_pages_docx,
    build_docx,
    safe_filename,
)

router = APIRouter()


class ExportDocxRequest(BaseModel):
    title: str
    original_text: str
    translated_text: str
    source_type: str
    source_number: int
    review_status: str = "not_reviewed"
    glossary_terms: str = ""


class CombinedPageExportItem(BaseModel):
    page_number: int
    title: str
    translated_text: str


class ExportCombinedPagesDocxRequest(BaseModel):
    title: str
    pages: list[CombinedPageExportItem]
    review_status: str = "translated"
    glossary_terms: str = ""


@router.post("/export/docx")
async def export_docx(payload: ExportDocxRequest):
    docx_stream = build_docx(
        title=payload.title,
        original_text=payload.original_text,
        translated_text=payload.translated_text,
        source_type=payload.source_type,
        source_number=payload.source_number,
        review_status=payload.review_status,
        glossary_terms=payload.glossary_terms,
    )

    filename = f"translated-{payload.source_type}-{payload.source_number}.docx"

    headers = {
        "Content-Disposition": f'attachment; filename="{filename}"'
    }

    return StreamingResponse(
        docx_stream,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers=headers,
    )


@router.post("/export/docx/combined-pages")
async def export_combined_pages_docx(payload: ExportCombinedPagesDocxRequest):
    pages = [
        {
            "page_number": page.page_number,
            "title": page.title,
            "translated_text": page.translated_text,
        }
        for page in payload.pages
    ]

    docx_stream = build_combined_pages_docx(
        title=payload.title,
        pages=pages,
        review_status=payload.review_status,
        glossary_terms=payload.glossary_terms,
    )

    filename = f"{safe_filename(payload.title)}-translated-pages.docx"

    headers = {
        "Content-Disposition": f'attachment; filename="{filename}"'
    }

    return StreamingResponse(
        docx_stream,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers=headers,
    )