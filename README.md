# Smart-Study-Assistant-Uyghur-Translator
AI-powered study assistant and Uyghur translator for Quranic Arabic learning materials.

# Smart Study Assistant & Uyghur Translator

Smart Study Assistant & Uyghur Translator is an AI-assisted educational platform designed to help teachers and students translate Quranic Arabic learning materials into Uyghur while preserving Arabic grammar terms, Quranic examples, and textbook structure.

The project is designed to support Quranic Arabic education for Uyghur-speaking learners by making English-based learning materials more accessible, reviewable, and exportable as editable DOCX and final PDF textbook resources.

## Project Goal

The goal of this project is to create a full-stack AI-powered application that can:

- Upload Quranic Arabic learning textbooks
- Extract textbook text from PDF or DOCX files
- Translate English explanation text into Uyghur
- Preserve Arabic grammar terms and Quranic Arabic examples unchanged
- Allow human review and correction of translations
- Export translated content as editable DOCX and final PDF
- Generate study materials such as summaries, flashcards, and quizzes in future versions

## Why This Project Matters

Many Quranic Arabic learning resources are available in English or Arabic, but fewer are available in Uyghur. This project aims to help bridge that gap by creating a translation and study workflow for Uyghur-speaking students.

The system is not designed to replace human review. Instead, it supports teachers and reviewers by speeding up translation, preserving Arabic terminology, and producing editable educational materials.

## Core Features

### MVP Features

- PDF upload
- Text extraction
- Chapter-based processing
- English-to-Uyghur translation
- Arabic term preservation
- Side-by-side translation review
- Editable translation correction
- DOCX export

### Future Features

- PDF export
- Arabic-Uyghur glossary
- Chapter summaries
- Flashcard generation
- Quiz generation
- Textbook chat assistant
- Student learning dashboard

## Arabic Preservation

A key feature of this project is Arabic preservation.

The system should translate English explanation text into Uyghur while keeping Arabic grammar terms unchanged.

Examples of preserved Arabic terms:

- اسم
- فعل
- حرف
- رفع
- نصب
- جر
- الإعراب
- الجنس
- العدد
- القسم

## Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- React Router
- Axios

### Backend

- Python
- FastAPI
- REST API

### AI / NLP

- NLLB-200 for translation
- Future LLM integration for summaries, flashcards, quizzes, and textbook chat

### Database

- PostgreSQL

### Document Processing

- PyMuPDF for PDF processing
- python-docx for DOCX processing

## Project Structure

```txt
Smart-Study-Assistant-Uyghur-Translator/
│
├── docs/
│   ├── project-specification.md
│   ├── user-stories.md
│   └── ui-wireframes.md
│
├── frontend/
│
├── backend/
│
├── README.md
└── .gitignore
