from io import BytesIO

import fitz
from docx import Document


def extract_text_from_file(filename: str, file_bytes: bytes) -> str:
    if filename.lower().endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)

    if filename.lower().endswith(".docx"):
        return extract_text_from_docx(file_bytes)

    raise ValueError("Unsupported file type.")


def extract_text_from_pdf(file_bytes: bytes) -> str:
    text_parts = []

    with fitz.open(stream=file_bytes, filetype="pdf") as document:
        for page_number, page in enumerate(document, start=1):
            page_text = page.get_text()
            text_parts.append(f"\n--- Page {page_number} ---\n")
            text_parts.append(page_text)

    return "\n".join(text_parts)


def extract_text_from_docx(file_bytes: bytes) -> str:
    document = Document(BytesIO(file_bytes))
    paragraphs = [paragraph.text for paragraph in document.paragraphs if paragraph.text.strip()]
    return "\n".join(paragraphs)