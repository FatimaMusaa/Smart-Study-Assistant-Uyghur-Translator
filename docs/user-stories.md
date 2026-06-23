# User Stories

## Project: Smart Study Assistant & Uyghur Translator

## Project Goal

Smart Study Assistant & Uyghur Translator is an AI-assisted educational platform designed to help teachers and students translate Quranic Arabic learning materials into Uyghur while preserving Arabic grammar terms, Quranic examples, and textbook structure.

The final goal is to support the creation of reviewed Uyghur learning materials that can be exported as editable DOCX files and final PDF textbook resources.

---

## Target Users

### 1. Teacher

A teacher wants to prepare Quranic Arabic learning materials in Uyghur for students.

### 2. Student

A student wants to study Quranic Arabic using Uyghur explanations while still seeing the original Arabic terms.

### 3. Translator / Reviewer

A reviewer wants to check, edit, and correct AI-generated Uyghur translations before final export.

---

## MVP User Stories

### 1. Upload a Textbook

**As a teacher,** I want to upload a PDF or DOCX textbook so that I can translate the content into Uyghur.

**Acceptance Criteria**

* User can upload a PDF or DOCX file.
* User can enter a document title.
* User can select the source language.
* User can select Uyghur as the target language.
* User can enable Arabic term preservation.
* System confirms when upload is successful.

---

### 2. Select Source Language

**As a teacher,** I want to choose the document source language so that the system knows how to process the material.

**Acceptance Criteria**

* User can select English.
* User can select Arabic.
* User can select Mixed English + Arabic.
* Target language is Uyghur.
* System uses the selected mode during translation.

---

### 3. Preserve Arabic Terms

**As a teacher,** I want Arabic grammar terms and Quranic examples to remain unchanged so that students learn the original Arabic terminology.

**Acceptance Criteria**

* Arabic grammar terms remain in Arabic.
* Quranic Arabic examples remain unchanged.
* Arabic diacritics are preserved where possible.
* Arabic text is not accidentally translated when preservation is enabled.
* Preserved terms are visible during review.

Examples of preserved Arabic terms:

* اسم
* فعل
* حرف
* رفع
* نصب
* جر
* الإعراب
* الجنس
* العدد
* القسم

---

### 4. View Uploaded Documents

**As a teacher,** I want to see uploaded documents so that I can continue working on previous translations.

**Acceptance Criteria**

* User can view a list of uploaded documents.
* Each document shows its name, size, page count, and status.
* User can open a document details page.
* User can continue translation from a previous document.

---

### 5. View Document Details

**As a teacher,** I want to view document details so that I can understand the document before translating it.

**Acceptance Criteria**

* User can see document name.
* User can see document size.
* User can see total pages.
* User can see detected or selected source language.
* User can see whether Arabic preservation is enabled.
* User can view chapters or sections if detected.

---

### 6. Translate a Chapter or Section

**As a teacher,** I want to translate one chapter or section at a time so that large textbooks are easier to manage.

**Acceptance Criteria**

* User can select a chapter or section.
* System translates selected content only.
* English explanation text is translated into Uyghur.
* Arabic terms are preserved when enabled.
* Translation progress is shown.

---

### 7. Review Side-by-Side Translation

**As a reviewer,** I want to compare the original text and Uyghur translation side by side so that I can check the translation accuracy.

**Acceptance Criteria**

* Original text appears in one panel.
* Uyghur translation appears in another panel.
* User can clearly see preserved Arabic terms.
* User can navigate through translated sections.
* User can identify untranslated or problematic sections.

---

### 8. Edit Translation

**As a reviewer,** I want to edit the Uyghur translation so that the final document is accurate and natural for students.

**Acceptance Criteria**

* User can edit translated Uyghur text.
* User can save changes.
* Saved changes remain available after leaving the page.
* User can mark a section as reviewed.
* Arabic terms remain visible and protected where possible.

---

### 9. Track Translation Progress

**As a teacher,** I want to see translation progress so that I know how much of the document is completed.

**Acceptance Criteria**

* System shows translation progress as a percentage.
* System shows review status.
* Sections can have statuses such as Not Started, Translated, Reviewed, and Exported.
* User can continue from unfinished sections.

---

### 10. Export as DOCX

**As a teacher,** I want to export the reviewed translation as a DOCX file so that I can manually edit formatting before final PDF creation.

**Acceptance Criteria**

* User can export translated content as DOCX.
* Uyghur text is included.
* Arabic terms remain unchanged.
* Tables are preserved where possible.
* User can open and edit the DOCX file.

---

### 11. Export as PDF

**As a teacher,** I want to export the final reviewed translation as a PDF so that I can provide it as a textbook resource for students.

**Acceptance Criteria**

* User can export reviewed content as PDF.
* PDF includes Uyghur translation.
* PDF preserves Arabic grammar terms and Quranic examples.
* PDF has readable formatting.
* PDF is suitable for student use after human review.

---

### 12. Use Glossary

**As a reviewer,** I want to use a glossary of Arabic grammar terms so that repeated terms are translated consistently.

**Acceptance Criteria**

* User can view glossary terms.
* Glossary includes Arabic term, English meaning, and Uyghur explanation.
* User can add new glossary terms.
* User can edit glossary entries.
* Glossary supports consistent translation.

---

## Future User Stories

### 13. Arabic to Uyghur Translation

**As a teacher,** I want to translate Arabic study materials into Uyghur so that the system can support Arabic textbooks as well as English textbooks.

**Acceptance Criteria**

* User can select Arabic as the source language.
* System translates Arabic explanation text into Uyghur.
* Important Quranic examples can remain unchanged.
* Arabic grammar terms can be preserved or explained using the glossary.

---

### 14. Generate Chapter Summary

**As a student,** I want to generate a Uyghur summary so that I can review the chapter faster.

**Acceptance Criteria**

* User can generate a summary from translated content.
* Summary is written in Uyghur.
* Arabic terms remain preserved.
* Summary is saved under the selected chapter.

---

### 15. Generate Flashcards

**As a student,** I want to generate flashcards so that I can memorize Arabic grammar terms.

**Acceptance Criteria**

* System generates question-and-answer flashcards.
* Flashcards include Arabic terms and Uyghur explanations.
* User can review flashcards in the browser.

---

### 16. Generate Quiz Questions

**As a teacher,** I want to generate quiz questions so that students can test their understanding.

**Acceptance Criteria**

* System generates multiple-choice questions.
* System generates short-answer questions.
* Questions are based on translated textbook content.
* Arabic grammar terms are preserved.

---

### 17. Textbook Chat Assistant

**As a student,** I want to ask questions about the uploaded textbook so that I can understand difficult lessons.

**Acceptance Criteria**

* User can ask a question about the textbook.
* System searches the uploaded textbook content.
* System answers in Uyghur.
* Arabic terms are preserved in the answer.
* Answers are based on the textbook content.

---

## MVP Priority

The first version should focus on:

1. Upload PDF or DOCX.
2. Select source language.
3. Translate English explanation text into Uyghur.
4. Preserve Arabic terms and Quranic examples.
5. Review translation side by side.
6. Edit translated Uyghur text.
7. Export reviewed content as DOCX.
8. Export final content as PDF.

---

## MVP Workflow

```txt
Upload Document
↓
View Document Details
↓
Translate Chapter or Section
↓
Review and Edit
↓
Export DOCX
↓
Export PDF
```

