import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type {
  ExtractedChapter,
  ExtractedPage,
  UploadedDocument,
} from '../types/document'

function Documents() {
  const navigate = useNavigate()
  const [uploadedDocument, setUploadedDocument] =
    useState<UploadedDocument | null>(null)

  useEffect(() => {
    const storedDocument = localStorage.getItem('uploadedDocument')

    if (storedDocument) {
      setUploadedDocument(JSON.parse(storedDocument))
    }
  }, [])

  const handleTranslateChapter = (chapter: ExtractedChapter) => {
    localStorage.setItem('selectedChapter', JSON.stringify(chapter))
    localStorage.removeItem('selectedPage')
    localStorage.removeItem('translatedContent')

    navigate('/translation')
  }

  const handleTranslatePage = (page: ExtractedPage) => {
    localStorage.setItem('selectedPage', JSON.stringify(page))
    localStorage.removeItem('selectedChapter')
    localStorage.removeItem('translatedContent')

    navigate('/translation')
  }

  if (!uploadedDocument) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4">
        <h1 className="mb-6 text-3xl font-bold">Documents</h1>

        <div className="rounded-xl bg-white p-6 shadow">
          <p>No document uploaded yet.</p>

          <button
            type="button"
            onClick={() => navigate('/upload')}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Go to Upload
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4">
      <h1 className="mb-6 text-3xl font-bold">Documents</h1>

      <div className="mb-6 rounded-xl bg-white p-5 shadow">
        <h2 className="mb-4 text-xl font-bold">
          {uploadedDocument.document_title}
        </h2>

        <div className="grid grid-cols-1 gap-x-8 gap-y-2 text-sm md:grid-cols-2">
          <p>
            <strong>Filename:</strong> {uploadedDocument.filename}
          </p>

          <p>
            <strong>Total Pages:</strong> {uploadedDocument.page_count}
          </p>

          <p>
            <strong>Detected Chapters:</strong>{' '}
            {uploadedDocument.chapter_count}
          </p>

          <p>
            <strong>Character Count:</strong>{' '}
            {uploadedDocument.character_count}
          </p>

          <p>
            <strong>Source:</strong> {uploadedDocument.source_language}
          </p>

          <p>
            <strong>Target:</strong> {uploadedDocument.target_language}
          </p>

          <p>
            <strong>Arabic Terms:</strong>{' '}
            {uploadedDocument.preserve_arabic_terms ? 'Enabled' : 'Disabled'}
          </p>

          <p>
            <strong>Quranic Examples:</strong>{' '}
            {uploadedDocument.preserve_quranic_examples
              ? 'Enabled'
              : 'Disabled'}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">Detected Chapters</h2>

        {uploadedDocument.chapters.length === 0 ? (
          <div className="rounded-lg border bg-yellow-50 p-4">
            No chapters were detected automatically. You can still translate
            individual pages below.
          </div>
        ) : (
          <div className="max-h-[420px] overflow-y-auto pr-2">
            {uploadedDocument.chapters.map((chapter) => (
              <div
                key={`${chapter.chapter_number}-${chapter.start_page}`}
                className="mb-3 flex items-center justify-between gap-4 rounded-lg border bg-slate-50 p-4"
              >
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-bold">
                    {chapter.title}
                  </h3>

                  <p className="text-sm text-slate-600">
                    Pages {chapter.start_page}–{chapter.end_page}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleTranslateChapter(chapter)}
                  className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Translate
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-bold">Extracted Pages Preview</h2>

        <div className="max-h-[520px] overflow-y-auto pr-2">
          {uploadedDocument.pages.slice(0, 10).map((page) => (
            <div
              key={page.page_number}
              className="mb-4 rounded-lg border bg-slate-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-4">
                <h3 className="font-bold">Page {page.page_number}</h3>

                <button
                  type="button"
                  onClick={() => handleTranslatePage(page)}
                  className="shrink-0 rounded-lg bg-slate-700 px-4 py-2 text-white hover:bg-slate-800"
                >
                  Translate
                </button>
              </div>

              <p className="max-h-40 overflow-y-auto whitespace-pre-wrap text-sm">
                {page.text || 'No extractable text found on this page.'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Documents