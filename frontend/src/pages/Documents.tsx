import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type {
  ExtractedChapter,
  ExtractedPage,
  UploadedDocument,
} from '../types/document'

type TranslatedTable = {
  tableNumber: number
  pageNumber: number
  translatedRows: string[][]
  provider: string
  message: string
}

type TableTranslationApiResponse = {
  message: string
  table_number: number
  translated_rows: string[][]
  provider: string
  prompt_preview: string
}




function Documents() {
  const [uploadedDocument, setUploadedDocument] =
    useState<UploadedDocument | null>(null)

  const [translatedTables, setTranslatedTables] = useState<
    Record<string, TranslatedTable>
  >({})

  const [translatingTableKey, setTranslatingTableKey] = useState('')
  const [tableTranslationStatus, setTableTranslationStatus] = useState('')



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

  const getTableKey = (pageNumber: number, tableNumber: number) => {
  return `page-${pageNumber}-table-${tableNumber}`
  }

  const handleTranslateTable = async (
    pageNumber: number,
    tableNumber: number,
    rows: string[][],
  ) => {
  const tableKey = getTableKey(pageNumber, tableNumber)

  try {
    setTranslatingTableKey(tableKey)
    setTableTranslationStatus('Translating table...')

    const response = await fetch('http://localhost:8000/api/translate/table', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        table_number: tableNumber,
        rows,
        target_language: 'Uyghur',
        preserve_arabic_terms: true,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)

      throw new Error(errorData?.detail || 'Table translation failed.')
    }

    const data: TableTranslationApiResponse = await response.json()

    setTranslatedTables((currentTables) => ({
      ...currentTables,
      [tableKey]: {
        tableNumber,
        pageNumber,
        translatedRows: data.translated_rows,
        provider: data.provider,
        message: data.message,
      },
    }))

    setTableTranslationStatus(data.message)
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Table translation failed. Make sure the backend server is running.'

    setTableTranslationStatus(message)
  } finally {
    setTranslatingTableKey('')
  }
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

          {tableTranslationStatus && (
            <div className="mb-6 rounded-lg border border-blue-200 bg-white p-4">
              <strong>Table Translation Status:</strong> {tableTranslationStatus}
            </div>
          )}
          
          <div>
            <h3 className="mb-3 mt-8 text-xl font-bold">
              Extracted Pages Preview
            </h3>

            <div className="max-h-96 space-y-3 overflow-y-auto">
              {uploadedDocument.pages.slice(0, 15).map((page) => (
                <div
                  key={page.page_number}
                  className="overflow-hidden rounded-lg border bg-slate-50 p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <p className="font-semibold">Page {page.page_number}</p>

                    <p className="mt-2 text-sm text-slate-500">
                       Tables detected: {page.table_count || 0}
                    </p>

                    {page.tables && page.tables.length > 0 && (
                      <div className="mt-4 space-y-4">
                        {page.tables.map((table) => {
                          const tableKey = getTableKey(page.page_number, table.table_number)
                          const translatedTable = translatedTables[tableKey]
                          const isThisTableTranslating = translatingTableKey === tableKey

                          return (
                            <div
                              key={table.table_number}
                              className="rounded-lg border bg-white p-3"
                            >
                              <div className="mb-3 flex items-center justify-between gap-4">
                                <p className="text-sm font-semibold">
                                  Table {table.table_number} — {table.row_count} rows ×{' '}
                                  {table.column_count} columns
                                </p>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleTranslateTable(
                                      page.page_number,
                                      table.table_number,
                                      table.rows,
                                    )
                                  }
                                  disabled={isThisTableTranslating}
                                  className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                                    isThisTableTranslating
                                      ? 'cursor-not-allowed bg-blue-300'
                                      : 'bg-blue-600 hover:bg-blue-700'
                                  }`}
                                >
                                  {isThisTableTranslating ? 'Translating...' : 'Translate Table'}
                                </button>
                              </div>

                              <div className="max-h-80 max-w-full overflow-auto rounded border">
                                <table className="min-w-max border-collapse text-sm">
                                  <tbody>
                                    {table.rows.map((row, rowIndex) => (
                                      <tr key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                          <td
                                            key={cellIndex}
                                            className="min-w-32 border px-3 py-2 align-top"
                                            dir="auto"
                                          >
                                            {cell || ''}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              {translatedTable && (
                                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3">
                                  <div className="mb-3 flex items-center justify-between gap-4">
                                    <p className="text-sm font-semibold text-green-800">
                                      Translated Table — Provider: {translatedTable.provider}
                                    </p>
                                  </div>

                                  <div className="max-h-80 max-w-full overflow-auto rounded border bg-white">
                                    <table className="min-w-max border-collapse text-sm">
                                      <tbody>
                                        {translatedTable.translatedRows.map((row, rowIndex) => (
                                          <tr key={rowIndex}>
                                            {row.map((cell, cellIndex) => (
                                              <td
                                                key={cellIndex}
                                                className="min-w-32 border px-3 py-2 align-top"
                                                dir="auto"
                                              >
                                                {cell || ''}
                                              </td>
                                            ))}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
  

                    
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