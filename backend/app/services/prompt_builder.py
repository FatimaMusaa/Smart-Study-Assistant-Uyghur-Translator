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