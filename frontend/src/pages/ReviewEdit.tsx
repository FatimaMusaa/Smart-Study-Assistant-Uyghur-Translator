import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ExtractedTable } from '../types/document'

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

function ReviewEdit() {
  const [translatedContent, setTranslatedContent] =
    useState<TranslatedContent | null>(null)

  const [editedTranslation, setEditedTranslation] = useState('')
  const [reviewStatus, setReviewStatus] = useState<
    'not_reviewed' | 'reviewed'
  >('not_reviewed')
  const [statusMessage, setStatusMessage] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const savedContent = localStorage.getItem('translatedContent')

    if (!savedContent) {
      setStatusMessage(
        'No translated content found. Please complete a translation first.',
      )
      return
    }

    const parsedContent = JSON.parse(savedContent) as TranslatedContent

    setTranslatedContent(parsedContent)
    setEditedTranslation(parsedContent.translatedText)
    setReviewStatus(parsedContent.reviewStatus || 'not_reviewed')
  }, [])

  const saveReviewedContent = (
    nextTranslation: string,
    nextReviewStatus: 'not_reviewed' | 'reviewed',
  ) => {
    if (!translatedContent) {
      return
    }

    const updatedContent: TranslatedContent = {
      ...translatedContent,
      translatedText: nextTranslation,
      reviewStatus: nextReviewStatus,
    }

    setTranslatedContent(updatedContent)
    setEditedTranslation(nextTranslation)
    setReviewStatus(nextReviewStatus)

    localStorage.setItem('translatedContent', JSON.stringify(updatedContent))
  }

  const handleSave = () => {
    saveReviewedContent(editedTranslation, reviewStatus)
    setStatusMessage('Translation saved successfully.')
  }

  const handleMarkAsReviewed = () => {
    saveReviewedContent(editedTranslation, 'reviewed')
    setStatusMessage('Translation marked as reviewed.')
  }

  const handleGoToExport = () => {
    saveReviewedContent(editedTranslation, reviewStatus)
    navigate('/export')
  }

  if (!translatedContent) {
    return (
      <section>
        <h2 className="mb-6 text-center text-3xl font-bold">
          Review and Edit
        </h2>

        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          {statusMessage ||
            'No translated content found. Please complete a translation first.'}
        </div>
      </section>
    )
  }

  return (
    <section>
      <h2 className="mb-8 text-center text-3xl font-bold">Review and Edit</h2>

      <div className="mb-6 rounded-xl bg-white p-6 shadow">
        <p>
          <strong>Selected:</strong> {translatedContent.title}
        </p>

        <p>
          <strong>Source Type:</strong> {translatedContent.sourceType}
        </p>

        <p>
          <strong>Source Number:</strong> {translatedContent.sourceNumber}
        </p>

        <p>
          <strong>Review Status:</strong> {reviewStatus}
        </p>
      </div>

      {statusMessage && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-white p-4">
          <strong>Status:</strong> {statusMessage}
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="mb-3 text-center font-semibold">Original Text</h3>

          <div className="max-h-[520px] min-h-[420px] overflow-y-auto whitespace-pre-wrap rounded-xl bg-white p-6 shadow">
            {translatedContent.originalText}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-center font-semibold">
            Editable Uyghur Translation
          </h3>

          <textarea
            value={editedTranslation}
            onChange={(event) => setEditedTranslation(event.target.value)}
            className="min-h-[420px] w-full rounded-xl border bg-white p-6 text-right shadow"
            dir="rtl"
          />
        </div>
      </div>

      {translatedContent.translatedTables &&
        translatedContent.translatedTables.length > 0 && (
          <div className="mt-10 rounded-xl bg-white p-6 shadow">
            <h3 className="mb-2 text-xl font-bold">Translated Tables</h3>

            <p className="mb-6 text-sm text-slate-500">
              Tables are shown for review. Editing table cells will be added in a
              later step.
            </p>

            <div className="space-y-8">
              {translatedContent.translatedTables.map((table) => (
                <div
                  key={`${table.pageNumber}-${table.tableNumber}`}
                  className="rounded-xl border bg-slate-50 p-4"
                >
                  <div className="mb-4">
                    <p className="font-semibold">
                      Page {table.pageNumber} — Table {table.tableNumber}
                    </p>

                    <p className="text-sm text-slate-500">
                      Provider: {table.provider}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div>
                      <h4 className="mb-2 font-semibold">Original Table</h4>

                      <div className="max-h-80 max-w-full overflow-auto rounded border bg-white">
                        <table className="min-w-max border-collapse text-sm">
                          <tbody>
                            {table.originalRows.map((row, rowIndex) => (
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

                      <div className="max-h-80 max-w-full overflow-auto rounded border bg-white">
                        <table className="min-w-max border-collapse text-sm">
                          <tbody>
                            {table.translatedRows.map((row, rowIndex) => (
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-slate-700 px-6 py-3 text-white hover:bg-slate-800"
        >
          Save
        </button>

        <button
          type="button"
          onClick={handleMarkAsReviewed}
          className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700"
        >
          Mark as Reviewed
        </button>

        <button
          type="button"
          onClick={handleGoToExport}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Go to Export
        </button>
      </div>
    </section>
  )
}

export default ReviewEdit