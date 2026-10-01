from typing import Any

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.services.docx_exporter import build_docx, safe_filename

router = APIRouter()




class ExportDocxRequest(BaseModel):
    title: str
    original_text: str
    translated_text: str
    source_type: str
    source_number: int
    review_status: str = "not_reviewed"
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
        glossary_terms=payload.glossary_terms
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