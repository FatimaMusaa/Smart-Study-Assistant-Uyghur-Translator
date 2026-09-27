import re
from typing import Any

import fitz
from docx import Document
import unicodedata


RTL_RANGE = r"\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF"


def contains_latin_text(text: str) -> bool:
    return bool(re.search(r"[A-Za-z]", text))


def contains_rtl_text(text: str) -> bool:
    return bool(re.search(rf"[{RTL_RANGE}]", text))


def reverse_rtl_graphemes(text: str) -> str:
    clusters: list[str] = []
    current = ""

    for character in text:
        if unicodedata.combining(character) and current:
            current += character
        else:
            if current:
                clusters.append(current)
            current = character

    if current:
        clusters.append(current)

    return "".join(reversed(clusters))




def extract_text_from_pdf(file_bytes: bytes) -> dict[str, Any]:
    doc = fitz.open(stream=file_bytes, filetype="pdf")

    pages = []
    full_text_parts = []

    for page_index, page in enumerate(doc, start=1):
        page_text = page.get_text("text").strip()
        
        pages.append(
            {
                "page_number": page_index,
                "text": page_text,
                
            }
        )

        if page_text:
            full_text_parts.append(f"--- Page {page_index} ---\n{page_text}")

    full_text = "\n\n".join(full_text_parts)
    print_chapter_debug_lines(pages)
    chapters = detect_chapters_from_pages(pages)

    return {
        "text": full_text,
        "pages": pages,
        "page_count": len(pages),
        "chapters": chapters,
        "chapter_count": len(chapters),
    }


def extract_text_from_docx(file_bytes: bytes) -> dict[str, Any]:
    from io import BytesIO

    document = Document(BytesIO(file_bytes))

    paragraphs = [
        paragraph.text.strip()
        for paragraph in document.paragraphs
        if paragraph.text.strip()
    ]

    full_text = "\n\n".join(paragraphs)

    pages = [
        {
            "page_number": 1,
            "text": full_text,
            "tables": [],
            "table_count": 0,
        }
    ]

    chapters = detect_chapters_from_pages(pages)

    return {
        "text": full_text,
        "pages": pages,
        "page_count": 1,
        "chapters": chapters,
        "chapter_count": len(chapters),
    }


def extract_text_from_file(filename: str, file_bytes: bytes) -> dict[str, Any]:
    lower_filename = filename.lower()

    if lower_filename.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)

    if lower_filename.endswith(".docx"):
        return extract_text_from_docx(file_bytes)

    raise ValueError("Unsupported file type. Please upload a PDF or DOCX file.")


def is_toc_like_line(line: str) -> bool:
    stripped = line.strip()

    if not stripped:
        return False

    if re.search(r"\.{3,}", stripped):
        return True

    if re.search(r"\s+\d+$", stripped) and len(stripped) > 12:
        return True

    return False


def page_looks_like_toc(page_text: str) -> bool:
    upper_text = page_text.upper()

    toc_keywords = [
        "TABLE OF CONTENTS",
        "CONTENTS",
        "الفهرس",
    ]

    return any(keyword in upper_text for keyword in toc_keywords)


def detect_chapters_from_pages(pages: list[dict[str, Any]]) -> list[dict[str, Any]]:
    manual_chapters = [
        {
            "chapter_number": 1,
            "title": "CHAPTER 1 - TYPES OF WORDS IN ARABIC - INTRODUCTION",
            "start_page": 8,
            "end_page": 10,
        },
        {
            "chapter_number": 2,
            "title": "CHAPTER 2 - الإعراب - INTRODUCTION",
            "start_page": 11,
            "end_page": 39,
        },
        {
            "chapter_number": 3,
            "title": "CHAPTER 3 & 4 MEMORIZATION",
            "start_page": 40,
            "end_page": 53,
        },
        {
            "chapter_number": 4,
            "title": "CHAPTER 4 - اسم IN ACTION - INTRODUCTION",
            "start_page": 54,
            "end_page": 63,
        },
        {
            "chapter_number": 5,
            "title": "CHAPTER 5",
            "start_page": 64,
            "end_page": 80,
        },
        {
            "chapter_number": 6,
            "title": "CHAPTER 6",
            "start_page": 81,
            "end_page": 92,
        },
        {
            "chapter_number": 7,
            "title": "CHAPTER 7",
            "start_page": 93,
            "end_page": 109,
        },
        {
            "chapter_number": 8,
            "title": "CHAPTER 8",
            "start_page": 110,
            "end_page": 125,
        },        
        {
            "chapter_number": 9,
            "title": "CHAPTER 9",
            "start_page": 126,
            "end_page": 139,
        },
        {
            "chapter_number": 10,
            "title": "CHAPTER 10",
            "start_page": 140,
            "end_page": 150,
        },
        {
            "chapter_number": 11,
            "title": "CHAPTER 11",
            "start_page": 151,
            "end_page": 160,
        },
                     
        
    ]

    chapters = []

    for chapter in manual_chapters:
        start_page = chapter["start_page"]
        end_page = chapter["end_page"]

        chapter_pages = [
            page
            for page in pages
            if start_page <= page["page_number"] <= end_page
        ]

        chapter_text_parts = []

        for page in chapter_pages:
            page_text = page.get("text", "")

            if page_text:
                chapter_text_parts.append(
                    f"--- Page {page['page_number']} ---\n{page_text}"
                )

        chapters.append(
            {
                "chapter_number": chapter["chapter_number"],
                "title": chapter["title"],
                "start_page": start_page,
                "end_page": end_page,
                "text": "\n\n".join(chapter_text_parts),
            }
        )

    return chapters



def print_chapter_debug_lines(pages: list[dict[str, Any]]) -> None:
    print("\n===== CHAPTER DEBUG LINES =====")

    for page in pages:
        page_number = page["page_number"]
        page_text = page.get("text", "")

        if page_number > 120:
            break

        lines = [
            line.strip()
            for line in page_text.splitlines()
            if line.strip()
        ]

        for line in lines[:50]:
            if "chapter" in line.lower() or "types of words" in line.lower() or "الإعراب" in line:
                print(f"PAGE {page_number}: {line}")

    print("===== END CHAPTER DEBUG LINES =====\n")