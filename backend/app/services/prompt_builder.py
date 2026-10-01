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
    glossary_terms: str = "",
) -> str:
    arabic_preservation_rule = (
        "Preserve Arabic grammar terms exactly as Arabic script. "
        "Do not translate, transliterate, rewrite, or alter Arabic grammar terms. "
        "If explanation is needed, keep the Arabic term first, then explain in Uyghur."
        if preserve_arabic_terms
        else "Arabic terms may be translated when needed."
    )

    quranic_preservation_rule = (
        "Preserve Quranic examples and Arabic example sentences in their original Arabic script. "
        "Translate only the explanation around them into Uyghur."
        if preserve_quranic_examples
        else "Quranic examples may be translated if needed."
    )
    approved_glossary = """
APPROVED ARABIC TERM GLOSSARY:
- إعراب — سۆزنىڭ جۈملىدىكى ھالىتى.
- الإعراب — سۆزنىڭ جۈملىدىكى ھالىتى.
- حرف جر — ئىسىمنى جر قىلىدىغان قوشۇمچىلار.
- مضاف إليه — ئىزافەت قۇرۇلمىسىدىن كېيىن كەلگەن سۆز.
- مضاف — ئىزافەت قۇرۇلمىسىدا ئالدىن كەلگەن سۆز.
- مشتق — تۈپ يىلتىزدىن تۈرلەنگەن سۆز.
- اسم — ئىسىم.
- فعل — پېئىل.
- حرف — قوشۇمچە/ھەرپ.
- رفع — رفع ھالىتى.
- نصب — نصب ھالىتى.
- جر — جر ھالىتى.
"""

    if glossary_terms:
        approved_glossary = glossary_terms

    return f"""
You are translating a Quranic Arabic study textbook into {target_language}.

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
4. Preserve the teaching structure, headings, examples, numbering, and paragraph breaks when useful.
5. {arabic_preservation_rule}
6. {quranic_preservation_rule}
7. Preserve Arabic grammar terms exactly as Arabic script.
8. Do not translate, transliterate, rewrite, or alter Arabic grammar terms.
9. Keep Arabic examples and Quranic examples exactly as Arabic script.
10. If an Arabic term needs explanation, keep the Arabic term first, then explain in Uyghur.
11. Do not mix Uyghur suffixes directly inside Arabic words.
12. Do not remove Arabic examples.
13. Do not summarize unless the original text is repetitive or unusable.
14. Keep grammar explanations accurate and beginner-friendly.
15. Do not add random symbols, broken punctuation, or OCR-like characters.
16. Do not use Markdown bold symbols like **.
17. Do not add commentary about the translation process.
18. Return clean textbook content only.
19. Return only the Uyghur translation content. Do not include extra commentary.
20. When an Arabic grammar term appears, keep the Arabic term exactly as written.
21. Do not add Uyghur suffixes directly to Arabic grammar terms.
22. Do not produce forms like إعرابنى, إعرابلىق, مضافقا, or حرف جرنى.
23. If grammar explanation is needed, use the approved glossary wording.
24. Keep Arabic terms separated from Uyghur explanation with an em dash.
25. If the source contains obvious PDF extraction noise such as random digits inside Arabic examples, remove the noise and preserve the Arabic example as clean Arabic.
26. Do not include random numbers inside Arabic Quranic examples unless they are clearly part of a verse reference.
27. If Arabic Quranic/example text appears corrupted with random Latin letters, numbers, symbols, or broken OCR characters, omit that corrupted Arabic line.
28. Do not try to reconstruct corrupted Quranic examples.
29. Translate the surrounding English explanation only when the Arabic example is corrupted.

ARABIC TERM PRESERVATION EXAMPLES:
Correct:
إعراب — سۆزنىڭ جۈملىدىكى ھالىتى.

Incorrect:
ئىعرابى، إعرابنى، إعرابلىق

Correct:
مضاف إليه — ئىزافەت قۇرۇلمىسىدا كېيىن كەلگەن سۆز.

Incorrect:
مضاف ئىگە، مۇضافقا، مضاف-ئېلىھى

Correct:
حرف جر — ئىسىمنى جر قىلىدىغان قوشۇمچىلار.

Incorrect:
جەر ھەرىپى، حرف جرنى، حرف جرلىق

{approved_glossary}

CONTENT TO TRANSLATE:
{text}
""".strip()




