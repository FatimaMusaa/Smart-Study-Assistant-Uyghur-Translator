# UI Wireframes

## Project: Smart Study Assistant & Uyghur Translator

## Wireframe Goal

The goal of the wireframes is to define the main user interface flow for the MVP version of the Smart Study Assistant & Uyghur Translator.

The interface should help users upload Quranic Arabic study materials, translate English or Arabic content into Uyghur, preserve Arabic terms, review translations, and export the final result as DOCX or PDF.

---

## Main Screens

The MVP includes six main screens:

1. Home / Dashboard
2. Upload Document
3. Documents / Document Details
4. Translation
5. Review and Edit
6. Export

A future screen will include:

7. Glossary

---

## Shared Navigation

Each page should include a consistent navigation system.

### Top Navigation

```txt
Home | Upload | Documents | Translation | Review and Edit | Export as DOCX | Export as PDF | Glossary
```

### Sidebar Navigation

```txt
Dashboard
Upload
Translate
Edit and Review
Exports
Download
```

The navigation should help users understand the workflow from uploading a document to exporting the final translation.

---

# Page 1: Home / Dashboard

## Purpose

The Home page introduces the platform and provides quick access to the main workflow.

## Main Elements

* Project title
* Dashboard cards
* Upload Documents card
* Document Details card
* Translation card
* Edit and Review card
* Exports card

## Suggested Layout

```txt
-----------------------------------------------------
| Home | Upload | Documents | Translation | Review  |
-----------------------------------------------------
| Sidebar       | Smart Study Assistant & Uyghur     |
| Dashboard     | Translator                         |
| Upload        |                                    |
| Translate     | [Dashboard] [Upload Documents]     |
| Edit/Review   | [Document Details]                 |
| Exports       | [Translation] [Edit and Review]    |
| Download      | [Exports]                          |
-----------------------------------------------------
```

## Notes

This page should act as a simple starting dashboard. Later, it can show recent documents, progress, and active translations.

---

# Page 2: Upload Document

## Purpose

The Upload page allows users to upload PDF or DOCX textbooks and select translation settings.

## Main Elements

* Upload textbook/document box
* Upload success message
* Document Details button
* Source language selector
* Target language selector
* Arabic preservation option

## Suggested Layout

```txt
-----------------------------------------------------
| Upload Document                                   |
-----------------------------------------------------
| Upload Textbook or Document                       |
| [ Drag and drop PDF/DOCX file here ]              |
|                                                   |
| Source Language:                                  |
| [ English ] [ Arabic ] [ Mixed English + Arabic ] |
|                                                   |
| Target Language:                                  |
| [ Uyghur ]                                        |
|                                                   |
| [x] Preserve Arabic Terms                         |
| [x] Preserve Quranic Arabic Examples              |
|                                                   |
| [Upload Document]                                 |
|                                                   |
| Document Uploaded Successfully                    |
| [Document Details]                                |
-----------------------------------------------------
```

## Notes

This page should make the project scalable by supporting English to Uyghur, Arabic to Uyghur, and Mixed English/Arabic to Uyghur modes.

---

# Page 3: Documents / Document Details

## Purpose

The Documents page shows uploaded documents and details about each document.

## Main Elements

* Document list
* Document name
* Document size
* Total pages
* Chapters
* Preserved Arabic terms status
* Translation button

## Suggested Layout

```txt
-----------------------------------------------------
| Documents                                         |
-----------------------------------------------------
| Document List        | Document Details            |
|----------------------|-----------------------------|
| Document 1           | Document Name:              |
| Document 2           | Document Size:              |
|                      | Total Pages:                |
|                      | Source Language:            |
|                      | Target Language: Uyghur     |
|                      | Preserved Arabic Terms: Yes |
|                      |                             |
|                      | Chapters:                   |
|                      | Chapter 1 [Translate]       |
|                      | Chapter 2 [Translate]       |
-----------------------------------------------------
```

## Notes

This page should help users choose which document or chapter to work on.

---

# Page 4: Translation

## Purpose

The Translation page shows the AI translation process and translation progress.

## Main Elements

* Translation title
* Edit button
* Translation progress bar
* Export button
* Original text panel
* Uyghur translation panel
* Progress percentage

## Suggested Layout

```txt
-----------------------------------------------------
| Translation Review                                |
-----------------------------------------------------
| [Edit] [Translation Progress: 100%] [Export]      |
|                                                   |
| Original Text              | Uyghur Translation   |
|----------------------------|----------------------|
| English/Arabic content     | Uyghur translation   |
| Arabic terms preserved     | Arabic terms kept    |
|                                                   |
| Preserved Arabic Terms:                           |
| اسم | فعل | حرف | رفع | نصب | جر                 |
-----------------------------------------------------
```

## Notes

This page focuses on translation generation and progress. The user can review the translated result before moving to the edit page.

---

# Page 5: Review and Edit

## Purpose

The Review and Edit page allows the user to manually correct the Uyghur translation before export.

## Main Elements

* Save button
* Mark as Reviewed button
* Export as DOCX button
* Export as PDF button
* Original text panel
* Editable Uyghur translation panel
* Preserved Arabic terms section

## Suggested Layout

```txt
-----------------------------------------------------
| Review and Edit                                   |
-----------------------------------------------------
| [Save] [Mark as Reviewed] [Export DOCX] [PDF]     |
|                                                   |
| Original Text              | Uyghur Translation   |
|----------------------------|----------------------|
| Original textbook content  | Editable translation |
|                            |                      |
|                            |                      |
|                                                   |
| Preserved Arabic Terms:                           |
| اسم | فعل | حرف | رفع | نصب | جر                 |
-----------------------------------------------------
```

## Notes

This is one of the most important screens because the final translation should be reviewed by a human before being used as a textbook.

---

# Page 6: Export

## Purpose

The Export page allows users to download the final translated material as DOCX or PDF.

## Main Elements

* Export final Uyghur translation title
* Download DOCX button
* Download PDF button
* Export status
* Review warning if document is not reviewed

## Suggested Layout

```txt
-----------------------------------------------------
| Export Final Uyghur Translation                   |
-----------------------------------------------------
| Document: Selected Document                       |
| Review Status: Reviewed                           |
|                                                   |
| [Download DOCX]                                   |
|                                                   |
| [Download PDF]                                    |
-----------------------------------------------------
```

## Notes

DOCX export should be prioritized because teachers may need to edit formatting, tables, Arabic terms, and layout before creating the final PDF.

---

# Future Page: Glossary

## Purpose

The Glossary page stores Arabic grammar terms and their Uyghur explanations.

## Main Elements

* Arabic term
* English meaning
* Uyghur explanation
* Add term button
* Edit term button

## Suggested Layout

```txt
-----------------------------------------------------
| Glossary                                          |
-----------------------------------------------------
| Arabic Term | English Meaning | Uyghur Explanation |
|---------------------------------------------------|
| اسم         | noun/name word  | ئىسىم              |
| فعل         | verb/action     | پېئىل              |
| حرف         | particle        | ھەرپ               |
| رفع         | doer status     | رەفئ               |
| نصب         | detail status   | نەصب               |
| جر          | after-of status | جەر                |
-----------------------------------------------------
```

---

## Design Style

The design should be simple, clean, and academic.

### Recommended Style

* Light blue background
* Blue navigation bars
* White or pale content cards
* Clear black text
* Large readable buttons
* Two-column review layout

### Typography

Use fonts that support English, Arabic, and Uyghur text.

Recommended fonts:

* Inter for English interface text
* Noto Sans Arabic for Arabic and Uyghur script
* Noto Naskh Arabic for Arabic textbook content

---

## MVP User Flow

```txt
Home
↓
Upload Document
↓
Document Details
↓
Translation
↓
Review and Edit
↓
Export DOCX
↓
Export PDF
```

---

## Wireframe Status

* Home page completed
* Upload page completed
* Documents page completed
* Translation page completed
* Review and Edit page completed
* Export page completed
* Screenshots saved in GitHub assets folder

---

## Next Development Step

After wireframes are completed, the next step is to set up the React frontend and create the page routes based on these screens.

