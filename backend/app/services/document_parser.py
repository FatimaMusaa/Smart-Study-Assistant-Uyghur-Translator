from io import BytesIO
import re
from typing import TypedDict

import fitz
from docx import Document


class ExtractedPage(TypedDict):
    page_number: int
    text: str


class ExtractedChapter(TypedDict):
    chapter_number: int
    title: str
    start_page: int
    end_page: int
    text: str


class ExtractedDocument(TypedDict):
    full_text: str
    pages: list[ExtractedPage]
    page_count: int
    chapters: list[ExtractedChapter]
    chapter_count: int


def extract_text_from_file(filename: str, file_bytes: bytes) -> ExtractedDocument:
    if filename.lower().endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)

    if filename.lower().endswith(".docx"):
        return extract_text_from_docx(file_bytes)

    raise ValueError("Unsupported file type.")


def extract_text_from_pdf(file_bytes: bytes) -> ExtractedDocument:
    pages: list[ExtractedPage] = []
    full_text_parts: list[str] = []

    with fitz.open(stream=file_bytes, filetype="pdf") as document:
        for page_number, page in enumerate(document, start=1):
            page_text = page.get_text().strip()

            pages.append(
                {
                    "page_number": page_number,
                    "text": page_text,
                }
            )

            full_text_parts.append(f"\n--- Page {page_number} ---\n")
            full_text_parts.append(page_text)

    full_text = "\n".join(full_text_parts)
    chapters = detect_chapters_from_pages(pages)

    return {
        "full_text": full_text,
        "pages": pages,
        "page_count": len(pages),
        "chapters": chapters,
        "chapter_count": len(chapters),
    }


def extract_text_from_docx(file_bytes: bytes) -> ExtractedDocument:
    document = Document(BytesIO(file_bytes))

    paragraphs = [
        paragraph.text.strip()
        for paragraph in document.paragraphs
        if paragraph.text.strip()
    ]

    full_text = "\n".join(paragraphs)

    pages: list[ExtractedPage] = [
        {
            "page_number": 1,
            "text": full_text,
        }
    ]

    chapters = detect_chapters_from_pages(pages)

    return {
        "full_text": full_text,
        "pages": pages,
        "page_count": 1,
        "chapters": chapters,
        "chapter_count": len(chapters),
    }


def detect_chapters_from_pages(pages: list[ExtractedPage]) -> list[ExtractedChapter]:
    chapter_starts: list[dict[str, int | str]] = []

    chapter_pattern = re.compile(
        r"\bCHAPTER\s+(\d+)\b|\bChapter\s+(\d+)\b",
        re.IGNORECASE,
    )

    for page in pages:
        page_number = page["page_number"]
        text = page["text"]

        if not text:
            continue

        lines = [line.strip() for line in text.splitlines() if line.strip()]

        for index, line in enumerate(lines[:15]):
            match = chapter_pattern.search(line)

            if match:
                chapter_number_text = match.group(1) or match.group(2)

                if not chapter_number_text:
                    continue

                chapter_number = int(chapter_number_text)

                title_lines = [line]

                if index + 1 < len(lines):
                    next_line = lines[index + 1]

                    if len(next_line) < 120:
                        title_lines.append(next_line)

                title = " - ".join(title_lines)

                already_detected = any(
                    chapter["chapter_number"] == chapter_number
                    for chapter in chapter_starts
                )

                if not already_detected:
                    chapter_starts.append(
                        {
                            "chapter_number": chapter_number,
                            "title": title,
                            "start_page": page_number,
                        }
                    )

                break

    chapters: list[ExtractedChapter] = []

    for index, chapter in enumerate(chapter_starts):
        start_page = int(chapter["start_page"])

        if index + 1 < len(chapter_starts):
            end_page = int(chapter_starts[index + 1]["start_page"]) - 1
        else:
            end_page = pages[-1]["page_number"] if pages else start_page

        chapter_pages = [
            page
            for page in pages
            if start_page <= page["page_number"] <= end_page
        ]

        chapter_text_parts: list[str] = []

        for page in chapter_pages:
            chapter_text_parts.append(f"\n--- Page {page['page_number']} ---\n")
            chapter_text_parts.append(page["text"])

        chapters.append(
            {
                "chapter_number": int(chapter["chapter_number"]),
                "title": str(chapter["title"]),
                "start_page": start_page,
                "end_page": end_page,
                "text": "\n".join(chapter_text_parts).strip(),
            }
        )

    return chapters