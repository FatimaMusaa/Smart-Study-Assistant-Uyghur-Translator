export type ExtractedTable = {
  table_number: number
  rows: string[][]
  row_count: number
  column_count: number
}

export type ExtractedPage = {
  page_number: number
  text: string
  tables: ExtractedTable[]
  table_count: number
}

export type ExtractedChapter = {
  chapter_number: number
  title: string
  start_page: number
  end_page: number
  text: string
}

export type UploadedDocument = {
  message: string
  document_title: string
  filename: string
  source_language: string
  target_language: string
  preserve_arabic_terms: boolean
  preserve_quranic_examples: boolean
  page_count: number
  pages: ExtractedPage[]
  chapter_count: number
  chapters: ExtractedChapter[]
  text_preview: string
  character_count: number
}