from io import BytesIO
import re
from typing import Any

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def clean_xml_text(value: Any) -> str:
    text = "" if value is None else str(value)

    # Remove XML-incompatible control characters.
    text = re.sub(
        r"[\x00-\x08\x0B\x0C\x0E-\x1F]",
        "",
        text,
    )

    return text


def set_paragraph_bidi(paragraph) -> None:
    paragraph_format = paragraph._p.get_or_add_pPr()

    bidi = paragraph_format.find(qn("w:bidi"))

    if bidi is None:
        bidi = OxmlElement("w:bidi")
        paragraph_format.append(bidi)

    bidi.set(qn("w:val"), "1")


def set_run_rtl(run) -> None:
    run_properties = run._r.get_or_add_rPr()

    rtl = run_properties.find(qn("w:rtl"))

    if rtl is None:
        rtl = OxmlElement("w:rtl")
        run_properties.append(rtl)

    rtl.set(qn("w:val"), "1")

def set_table_rtl(table) -> None:
    table_properties = table._tbl.tblPr

    bidi_visual = table_properties.find(qn("w:bidiVisual"))

    if bidi_visual is None:
        bidi_visual = OxmlElement("w:bidiVisual")
        table_properties.append(bidi_visual)

    bidi_visual.set(qn("w:val"), "1")




def set_cell_text_direction_rtl(cell) -> None:
    cell_properties = cell._tc.get_or_add_tcPr()

    text_direction = cell_properties.find(qn("w:textDirection"))

    if text_direction is None:
        text_direction = OxmlElement("w:textDirection")
        cell_properties.append(text_direction)

    text_direction.set(qn("w:val"), "rtl")


def safe_filename(value: str) -> str:
    cleaned = re.sub(r'[\\/*?:"<>|]', "", value)
    cleaned = cleaned.strip().replace(" ", "-")

    return cleaned[:80] or "translated-document"


def set_paragraph_rtl(paragraph) -> None:
    paragraph.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    set_paragraph_bidi(paragraph)

    for run in paragraph.runs:
        run.font.name = "Arial"
        run.font.size = Pt(12)
        set_run_rtl(run)


def add_text_section(document: Document, heading: str, text: str, rtl: bool = False) -> None:
    document.add_heading(heading, level=2)

    paragraphs = text.split("\n")

    for paragraph_text in paragraphs:
        paragraph = document.add_paragraph(clean_xml_text(paragraph_text))

        if rtl:
            set_paragraph_rtl(paragraph)



def build_docx(
    *,
    title: str,
    original_text: str,
    translated_text: str,
    source_type: str,
    source_number: int,
    review_status: str,
    
) -> BytesIO:
    document = Document()

    document.add_heading(clean_xml_text(title), level=1)

    document.add_paragraph(clean_xml_text(f"Source Type: {source_type}"))
    document.add_paragraph(clean_xml_text(f"Source Number: {source_number}"))
    document.add_paragraph(clean_xml_text(f"Review Status: {review_status}"))

    document.add_paragraph("")

    add_text_section(
        document,
        "Uyghur Translation",
        translated_text,
        rtl=True,
    )

    output = BytesIO()
    document.save(output)
    output.seek(0)

    return output