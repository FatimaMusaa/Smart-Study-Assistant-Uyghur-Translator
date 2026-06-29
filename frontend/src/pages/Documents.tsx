import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type {
  ExtractedChapter,
  ExtractedPage,
  UploadedDocument,
} from '../types/document'

function Documents() {
  const [uploadedDocument, setUploadedDocument] =
    useState<UploadedDocument | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const savedDocument = localStorage.getItem('uploadedDocument')

    if (!savedDocument) {
      return
    }

    try {
      const parsedDocument = JSON.parse(savedDocument) as UploadedDocument
      setUploadedDocument(parsedDocument)
    } catch {
      localStorage.removeItem('uploadedDocument')
      setUploadedDocument(null)
    }
  }, [])

  const handleTranslateChapter = (chapter: ExtractedChapter) => {
    localStorage.setItem('selectedChapter', JSON.stringify(chapter))
    localStorage.removeItem('selectedPage')
    navigate('/translation')
  }

  const handleTranslatePage = (page: ExtractedPage) => {
    localStorage.setItem('selectedPage', JSON.stringify(page))
    localStorage.removeItem('selectedChapter')
    navigate('/translation')
  }

  if (!uploadedDocument) {
    return (
      <section>
        <h2 className="mb-8 text-3xl font-bold">Documents</h2>

        <div className="rounded-xl bg-white p-10 text-center shadow">
          <p className="mb-4 text-slate-600">
            No uploaded document found yet.
          </p>

          <p className="text-sm text-slate-500">
            Upload a PDF or DOCX document first, then return to this page.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <h2 className="mb-8 text-3xl font-bold">Documents</h2>

      <div className="grid grid-cols-[260px_1fr] overflow-hidden rounded-xl bg-white shadow">
        <aside className="min-h-[500px] bg-blue-600 text-white">
          <div className="border-b border-blue-500 p-5 font-semibold">
            {uploadedDocument.document_title}
          </div>

          <div className="border-b border-blue-500 p-5 text-sm">
            {uploadedDocument.filename}
          </div>
        </aside>

        <main className="space-y-5 p-10">
          <p>
            <strong>Document Name:</strong>{' '}
            {uploadedDocument.document_title}
          </p>

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
            <strong>Source Language:</strong>{' '}
            {uploadedDocument.source_language}
          </p>

          <p>
            <strong>Target Language:</strong>{' '}
            {uploadedDocument.target_language}
          </p>

          <p>
            <strong>Preserved Arabic Terms:</strong>{' '}
            {uploadedDocument.preserve_arabic_terms ? 'Enabled' : 'Disabled'}
          </p>

          <p>
            <strong>Preserved Quranic Examples:</strong>{' '}
            {uploadedDocument.preserve_quranic_examples
              ? 'Enabled'
              : 'Disabled'}
          </p>

          <div>
            <h3 className="mb-3 mt-8 text-xl font-bold">Detected Chapters</h3>

            {uploadedDocument.chapters.length === 0 ? (
              <div className="rounded-lg border bg-yellow-50 p-4 text-sm">
                No chapters were detected automatically. You can still translate
                individual pages below.
              </div>
            ) : (
              <div className="space-y-3">
                {uploadedDocument.chapters.map((chapter) => (
                  <div
                    key={chapter.chapter_number}
                    className="rounded-lg border bg-blue-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">{chapter.title}</p>
                        <p className="text-sm text-slate-600">
                          Pages {chapter.start_page}–{chapter.end_page}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleTranslateChapter(chapter)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                      >
                        Translate Chapter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-3 mt-8 text-xl font-bold">
              Extracted Pages Preview
            </h3>

            <div className="max-h-96 space-y-3 overflow-y-auto">
              {uploadedDocument.pages.slice(0, 10).map((page) => (
                <div
                  key={page.page_number}
                  className="rounded-lg border bg-slate-50 p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <p className="font-semibold">Page {page.page_number}</p>

                    <button
                      type="button"
                      onClick={() => handleTranslatePage(page)}
                      className="rounded-lg bg-slate-700 px-4 py-2 text-white hover:bg-slate-800"
                    >
                      Translate Page
                    </button>
                  </div>

                  <p className="max-h-52 overflow-y-auto whitespace-pre-wrap text-sm">
                    {page.text || 'No extractable text found on this page.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </section>
  )
}

export default Documents