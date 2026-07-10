from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.services.document_parser import extract_text_from_file

router = APIRouter()


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    document_title: str = Form(...),
    source_language: str = Form(...),
    target_language: str = Form("Uyghur"),
    preserve_arabic_terms: bool = Form(True),
    preserve_quranic_examples: bool = Form(True),
):
    allowed_extensions = [".pdf", ".docx"]

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file must have a filename.",
        )

    if not any(file.filename.lower().endswith(ext) for ext in allowed_extensions):
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported.",
        )

    file_bytes = await file.read()

    extracted_document = extract_text_from_file(
        filename=file.filename,
        file_bytes=file_bytes,
    )

    full_text = extracted_document.get("text", "")

    return {
        "message": "Document uploaded and processed successfully.",
        "document_title": document_title,
        "filename": file.filename,
        "source_language": source_language,
        "target_language": target_language,
        "preserve_arabic_terms": preserve_arabic_terms,
        "preserve_quranic_examples": preserve_quranic_examples,
        "page_count": extracted_document.get("page_count", 0),
        "pages": extracted_document.get("pages", []),
        "chapter_count": extracted_document.get("chapter_count", 0),
        "chapters": extracted_document.get("chapters", []),
        "text_preview": full_text[:1000],
        "character_count": len(full_text),
    }