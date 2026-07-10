from typing import Literal


def build_translation_prompt(
    *,
    title: str,
    text: str,
    source_language: str,
    target_language: str,
    source_type: Literal["chapter", "page"],
    source_number: int,
    preserve_arabic_terms: bool = True,
    preserve_quranic_examples: bool = True,
) -> str:
    arabic_preservation_rule = (
        "Preserve Arabic grammar terms exactly as Arabic script, such as اسم, فعل, حرف, رفع, نصب, جر. "
        "Do not transliterate or replace these Arabic terms unless an Uyghur explanation is needed beside them."
        if preserve_arabic_terms
        else "Arabic terms may be translated when needed."
    )

    quranic_preservation_rule = (
        "Preserve Quranic examples and Arabic example sentences in their original Arabic script. "
        "Translate only the explanation around them into Uyghur."
        if preserve_quranic_examples
        else "Quranic examples may be translated if needed."
    )

    return f"""
You are translating a Quranic Arabic study textbook into Uyghur.

TASK:
Translate the provided {source_type} content from {source_language} into {target_language}.

DOCUMENT SECTION:
Title: {title}
Source Type: {source_type}
Source Number: {source_number}

TRANSLATION RULES:
1. Translate English explanations into clear, natural Uyghur.
2. Keep the tone suitable for students learning Quranic Arabic.
3. Use textbook-style Uyghur, not casual speech.
4. Preserve the teaching structure, headings, examples, numbering, and paragraph breaks.
5. {arabic_preservation_rule}
6. {quranic_preservation_rule}
7. Do not remove Arabic examples.
8. Do not summarize unless the original text is repetitive or unusable.
9. Keep grammar explanations accurate and beginner-friendly.
10. If the source contains tables or lists, preserve the list/table-like structure as much as possible.
11. If the source contains a section called "--- DETECTED TABLES ---", treat it as structured table data.
12. Preserve table rows and columns as a readable table.
13. Translate English table headers into Uyghur.
14. Do not translate Arabic table cells.
15. Preserve Arabic cells exactly.
16. Do not merge table rows into paragraphs.
17. Do not remove empty answer spaces in drills or exercises.
18. Do not use Markdown bold symbols like **.
19. Do not add commentary about the translation process.
20. Return clean textbook content only.
21. Return only the Uyghur translation content. Do not include extra commentary.

TABLE HANDLING:
If structured table data appears, preserve it as a table-like block using rows and columns.
Keep Arabic grammar examples unchanged.
Translate only English labels, headings, and explanations.
Do not flatten tables into normal paragraphs.

SOURCE TEXT:
{text}
""".strip()




def build_table_batch_translation_prompt(
    *,
    cells: list[dict],
    target_language: str,
    preserve_arabic_terms: bool = True,
) -> str:
    arabic_rule = (
        "Preserve every Arabic-script character exactly as it appears. "
        "Do not rewrite, normalize, vocalize, remove diacritics from, or correct Arabic-script text. "
        "If a cell contains both English and Arabic, translate only the English part and keep Arabic unchanged."
        if preserve_arabic_terms
        else "Translate the cell naturally when appropriate."
    )

    return f"""
You are translating selected table cells from a Quranic Arabic study textbook into {target_language}.

TASK:
Translate only the English words or English phrases in each cell into {target_language}.

STRICT RULES:
1. {arabic_rule}
2. Keep the row_index and cell_index exactly unchanged.
3. Do not add new cells.
4. Do not remove cells.
5. Do not reorder cells.
6. Keep punctuation, slashes, dashes, and spacing as close to the original as possible.
7. Keep proper names unchanged unless there is a standard Uyghur form.
8. Do not use Markdown.
9. Do not add explanations.
10. Return only valid JSON.
11. The JSON must have this exact shape:
{{
  "translated_cells": [
    {{
      "row_index": 0,
      "cell_index": 0,
      "translated_text": "translated cell text"
    }}
  ]
}}

CELLS TO TRANSLATE:
{cells}
""".strip()