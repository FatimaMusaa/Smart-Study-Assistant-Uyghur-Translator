export type ExtractedPage = {
  page_number: number
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
  text_preview: string
  character_count: number
}