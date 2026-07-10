import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type {
  ExtractedChapter,
  ExtractedPage,
  ExtractedTable,
} from '../types/document'

type TranslatedTable = {
  tableNumber: number
  pageNumber: number
  originalRows: string[][]
  translatedRows: string[][]
  provider: string
  message: string
}

type TranslatedContent = {
  title: string
  originalText: string
  translatedText: string
  sourceType: 'chapter' | 'page'
  sourceNumber: number
  reviewStatus?: 'not_reviewed' | 'reviewed'
  originalTables?: ExtractedTable[]
  translatedTables?: TranslatedTable[]
}

type TranslationApiResponse = {
  message: string
  title: string
  source_type: 'chapter' | 'page'
  source_number: number
  source_language: string
  target_language: string
  translated_text: string
  preserved_terms: string[]
  prompt_preview: string
  provider: string
}

type TableTranslationApiResponse = {
  message: string
  table_number: number
  translated_rows: string[][]
  provider: string
  prompt_preview: string
}

function Translation() {
  const [selectedPage, setSelectedPage] = useState<ExtractedPage | null>(null)
  const [selectedChapter, setSelectedChapter] =
    useState<ExtractedChapter | null>(null)

  const [translatedText, setTranslatedText] = useState('')
  const [translationStatus, setTranslationStatus] = useState(
    'Translation has not started yet.',
  )
  const [translationProvider, setTranslationProvider] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)

  const [translatedTables, setTranslatedTables] = useState<
    Record<string, TranslatedTable>
  >({})
  const [translatingTableKey, setTranslatingTableKey] = useState('')
  const [tableTranslationStatus, setTableTranslationStatus] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const savedChapter = localStorage.getItem('selectedChapter')
    const savedPage = localStorage.getItem('selectedPage')

    if (savedChapter) {
      const parsedChapter = JSON.parse(savedChapter) as ExtractedChapter
      setSelectedChapter(parsedChapter)
      setSelectedPage(null)
      return
    }

    if (savedPage) {
      const parsedPage = JSON.parse(savedPage) as ExtractedPage
      setSelectedPage(parsedPage)
      setSelectedChapter(null)
    }
  }, [])

  const selectedTitle = selectedChapter
    ? selectedChapter.title
    : selectedPage
      ? `Selected Page: ${selectedPage.page_number}`
      : 'No page or chapter selected'

  const originalText =
    selectedChapter?.text ||
    selectedPage?.text ||
    'No content selected yet. Go to Documents and click Translate Chapter or Translate Page.'

  const sourceType: 'chapter' | 'page' = selectedChapter ? 'chapter' : 'page'

  const sourceNumber = selectedChapter
    ? selectedChapter.chapter_number
    : selectedPage?.page_number || 0

  const getTableKey = (pageNumber: number, tableNumber: number) => {
    return `page-${pageNumber}-table-${tableNumber}`
  }

  const getTranslatedTablesArray = () => {
    return Object.values(translatedTables)
  }

  const saveTranslatedContent = (
    nextTranslatedText: string,
    nextTranslatedTables: Record<string, TranslatedTable>,
  ) => {
    const translatedContent: TranslatedContent = {
      title: selectedTitle,
      originalText,
      translatedText: nextTranslatedText,
      sourceType,
      sourceNumber,
      reviewStatus: 'not_reviewed',
      originalTables: selectedPage?.tables || [],
      translatedTables: Object.values(nextTranslatedTables),
    }

    localStorage.setItem('translatedContent', JSON.stringify(translatedContent))
  }

  const handleStartTranslation = async () => {
    if (!selectedChapter && !selectedPage) {
      setTranslationStatus('Please select a chapter or page first.')
      return
    }

    try {
      setIsTranslating(true)
      setTranslationProvider('')
      setTranslationStatus('Sending text to backend translation endpoint...')

      const response = await fetch('http://localhost:8000/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: selectedTitle,
          text: originalText,
          source_language: 'Mixed English + Arabic',
          target_language: 'Uyghur',
          source_type: sourceType,
          source_number: sourceNumber,
          preserve_arabic_terms: true,
          preserve_quranic_examples: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)

        throw new Error(errorData?.detail || 'Translation request failed.')
      }

      const data: TranslationApiResponse = await response.json()

      setTranslatedText(data.translated_text)
      setTranslationStatus(data.message)
      setTranslationProvider(data.provider)

      saveTranslatedContent(data.translated_text, translatedTables)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Translation failed. Make sure the backend server is running.'

      setTranslationStatus(message)
      setTranslationProvider('')
    } finally {
      setIsTranslating(false)
    }
  }

  const handleTranslateTable = async (table: ExtractedTable) => {
    if (!selectedPage) {
      setTableTranslationStatus('Table translation is only available for pages.')
      return
    }

    const tableKey = getTableKey(selectedPage.page_number, table.table_number)

    try {
      setTranslatingTableKey(tableKey)
      setTableTranslationStatus('Translating table...')

      const response = await fetch('http://localhost:8000/api/translate/table', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_number: table.table_number,
          rows: table.rows,
          target_language: 'Uyghur',
          preserve_arabic_terms: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)

        throw new Error(errorData?.detail || 'Table translation failed.')
      }

      const data: TableTranslationApiResponse = await response.json()

      const nextTranslatedTable: TranslatedTable = {
        tableNumber: table.table_number,
        pageNumber: selectedPage.page_number,
        originalRows: table.rows,
        translatedRows: data.translated_rows,
        provider: data.provider,
        message: data.message,
      }

      const nextTranslatedTables = {
        ...translatedTables,
        [tableKey]: nextTranslatedTable,
      }

      setTranslatedTables(nextTranslatedTables)
      setTableTranslationStatus(data.message)

      saveTranslatedContent(translatedText, nextTranslatedTables)
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

  const handleTranslateAllTables = async () => {
    if (!selectedPage || !selectedPage.tables || selectedPage.tables.length === 0) {
      setTableTranslationStatus('No tables found on this page.')
      return
    }

    for (const table of selectedPage.tables) {
      await handleTranslateTable(table)
    }
  }

  const handleContinueToReview = () => {
    if (!translatedText) {
      setTranslationStatus('Please start translation before continuing.')
      return
    }

    saveTranslatedContent(translatedText, translatedTables)
    navigate('/review-edit')
  }

  return (
    <section>
      <h2 className="mb-8 text-center text-3xl font-bold">Translation</h2>

      <div className="mb-8 flex gap-4">
        <button
          type="button"
          onClick={handleStartTranslation}
          disabled={isTranslating}
          className={`rounded-lg px-6 py-3 text-white ${
            isTranslating
              ? 'cursor-not-allowed bg-blue-300'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isTranslating ? 'Translating...' : 'Start Translation'}
        </button>

        <div className="flex-1 rounded-lg bg-white px-6 py-3">
          {selectedTitle}
        </div>

        <button
          type="button"
          onClick={handleContinueToReview}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Continue to Review
        </button>
      </div>

      <div className="mb-6 rounded-lg border border-blue-200 bg-white p-4">
        <p>
          <strong>Status:</strong> {translationStatus}
        </p>

        {translationProvider && (
          <p className="mt-1 text-sm text-slate-600">
            <strong>Provider:</strong> {translationProvider}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="mb-3 text-center font-semibold">Original Text</h3>

          <div className="max-h-[520px] min-h-[420px] overflow-y-auto whitespace-pre-wrap rounded-xl bg-white p-6 shadow">
            {originalText}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-center font-semibold">
            Uyghur Translation
          </h3>

          <div
            className="max-h-[520px] min-h-[420px] overflow-y-auto whitespace-pre-wrap rounded-xl bg-white p-6 shadow"
            dir="rtl"
          >
            {translatedText ||
              'Translation will appear here after clicking Start Translation.'}
          </div>
        </div>
      </div>

      {selectedPage?.tables && selectedPage.tables.length > 0 && (
        <div className="mt-10 rounded-xl bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Page Tables</h3>
              <p className="text-sm text-slate-500">
                Tables detected on this page: {selectedPage.tables.length}
              </p>
            </div>

            <button
              type="button"
              onClick={handleTranslateAllTables}
              disabled={!!translatingTableKey}
              className={`rounded-lg px-5 py-3 text-white ${
                translatingTableKey
                  ? 'cursor-not-allowed bg-blue-300'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {translatingTableKey ? 'Translating...' : 'Translate All Tables'}
            </button>
          </div>

          {tableTranslationStatus && (
            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <strong>Table Status:</strong> {tableTranslationStatus}
            </div>
          )}

          <div className="space-y-8">
            {selectedPage.tables.map((table) => {
              const tableKey = getTableKey(
                selectedPage.page_number,
                table.table_number,
              )
              const translatedTable = translatedTables[tableKey]
              const isThisTableTranslating = translatingTableKey === tableKey

              return (
                <div
                  key={table.table_number}
                  className="rounded-xl border bg-slate-50 p-4"
                >
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <p className="font-semibold">
                      Table {table.table_number} — {table.row_count} rows ×{' '}
                      {table.column_count} columns
                    </p>

                    <button
                      type="button"
                      onClick={() => handleTranslateTable(table)}
                      disabled={isThisTableTranslating}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                        isThisTableTranslating
                          ? 'cursor-not-allowed bg-blue-300'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isThisTableTranslating
                        ? 'Translating...'
                        : 'Translate Table'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div>
                      <h4 className="mb-2 font-semibold">Original Table</h4>

                      <div className="max-h-80 max-w-full overflow-auto rounded border bg-white">
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
                    </div>

                    <div>
                      <h4 className="mb-2 font-semibold">Translated Table</h4>

                      {translatedTable ? (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                          <p className="mb-2 text-sm font-semibold text-green-800">
                            Provider: {translatedTable.provider}
                          </p>

                          <div className="max-h-80 max-w-full overflow-auto rounded border bg-white">
                            <table className="min-w-max border-collapse text-sm">
                              <tbody>
                                {translatedTable.translatedRows.map(
                                  (row, rowIndex) => (
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
                                  ),
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className="flex min-h-32 items-center justify-center rounded border bg-white p-4 text-sm text-slate-500">
                          Click Translate Table to generate a structured table
                          translation.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-6 rounded-xl bg-white p-4 shadow">
        <strong>Preserved Arabic Terms:</strong> اسم | فعل | حرف | رفع | نصب | جر
      </div>
    </section>
  )
}

export default Translation