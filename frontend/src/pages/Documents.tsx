import { useEffect, useState } from 'react'
import type { UploadedDocument } from '../types/document'

function Documents() {
  const [document, setDocument] = useState<UploadedDocument | null>(null)

  useEffect(() => {
    const savedDocument = localStorage.getItem('uploadedDocument')

    if (savedDocument) {
      setDocument(JSON.parse(savedDocument))
    }
  }, [])

  if (!document) {
    return (
      <section>
        <h2 className="text-3xl font-bold mb-8">Documents</h2>

        <div className="bg-white rounded-xl shadow p-10 text-center">
          <p className="text-slate-600 mb-4">
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
      <h2 className="text-3xl font-bold mb-8">Documents</h2>

      <div className="grid grid-cols-[260px_1fr] bg-white rounded-xl shadow overflow-hidden">
        <aside className="bg-blue-600 text-white min-h-[500px]">
          <div className="p-5 border-b border-blue-500 font-semibold">
            {document.document_title}
          </div>
          <div className="p-5 border-b border-blue-500 text-sm">
            {document.filename}
          </div>
        </aside>

        <main className="p-10 space-y-5">
          <p>
            <strong>Document Name:</strong> {document.document_title}
          </p>
          <p>
            <strong>Filename:</strong> {document.filename}
          </p>
          <p>
            <strong>Total Pages:</strong> {document.page_count}
          </p>
          <p>
            <strong>Character Count:</strong> {document.character_count}
          </p>
          <p>
            <strong>Source Language:</strong> {document.source_language}
          </p>
          <p>
            <strong>Target Language:</strong> {document.target_language}
          </p>
          <p>
            <strong>Preserved Arabic Terms:</strong>{' '}
            {document.preserve_arabic_terms ? 'Enabled' : 'Disabled'}
          </p>
          <p>
            <strong>Preserved Quranic Examples:</strong>{' '}
            {document.preserve_quranic_examples ? 'Enabled' : 'Disabled'}
          </p>

          <div>
            <h3 className="font-bold mt-8 mb-3">Extracted Pages Preview</h3>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {document.pages.slice(0, 10).map((page) => (
                <div
                  key={page.page_number}
                  className="border rounded-lg p-4 bg-slate-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">Page {page.page_number}</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                      Translate Page
                    </button>
                  </div>

                  <p className="whitespace-pre-wrap text-sm">
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