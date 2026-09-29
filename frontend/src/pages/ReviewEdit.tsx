import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type TranslatedContent = {
  title: string
  originalText: string
  translatedText: string
  sourceType: 'chapter' | 'page'
  sourceNumber: number
  reviewStatus?: 'not_reviewed' | 'reviewed'
}

function ReviewEdit() {
  const navigate = useNavigate()
  const [translatedContent, setTranslatedContent] =
    useState<TranslatedContent | null>(null)
  const [editedTranslation, setEditedTranslation] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    const storedTranslatedContent = localStorage.getItem('translatedContent')

    if (storedTranslatedContent) {
      const parsedContent: TranslatedContent = JSON.parse(storedTranslatedContent)

      setTranslatedContent(parsedContent)
      setEditedTranslation(parsedContent.translatedText)
    }
  }, [])

  const saveUpdatedContent = (
    reviewStatus?: 'not_reviewed' | 'reviewed',
  ) => {
    if (!translatedContent) {
      setStatusMessage('No translated content found.')
      return null
    }

    const updatedContent: TranslatedContent = {
      ...translatedContent,
      translatedText: editedTranslation,
      reviewStatus: reviewStatus || translatedContent.reviewStatus || 'not_reviewed',
    }

    localStorage.setItem('translatedContent', JSON.stringify(updatedContent))
    setTranslatedContent(updatedContent)

    return updatedContent
  }

  const handleSave = () => {
    const savedContent = saveUpdatedContent()

    if (savedContent) {
      setStatusMessage('Draft saved successfully.')
    }
  }

  const handleMarkAsReviewed = () => {
    const savedContent = saveUpdatedContent('reviewed')

    if (savedContent) {
      setStatusMessage('Translation marked as reviewed.')
    }
  }

  const handleGoToExport = () => {
    const savedContent = saveUpdatedContent()

    if (savedContent) {
      navigate('/export')
    }
  }

  if (!translatedContent) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4">
        <h1 className="mb-6 text-3xl font-bold">Review and Edit</h1>

        <div className="rounded-xl bg-white p-6 shadow">
          <p>No translated content found.</p>

          <button
            type="button"
            onClick={() => navigate('/translation')}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Go to Translation
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4">
      <h1 className="mb-6 text-3xl font-bold">Review and Edit</h1>

      <div className="mb-6 rounded-xl bg-white p-5 shadow">
        <h2 className="mb-4 text-xl font-bold">{translatedContent.title}</h2>

        <div className="grid grid-cols-1 gap-x-8 gap-y-2 text-sm md:grid-cols-2">
          <p>
            <strong>Source Type:</strong> {translatedContent.sourceType}
          </p>

          <p>
            <strong>Source Number:</strong> {translatedContent.sourceNumber}
          </p>

          <p>
            <strong>Review Status:</strong>{' '}
            {translatedContent.reviewStatus || 'not_reviewed'}
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <strong>Status:</strong> {statusMessage}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-center text-lg font-bold">Original Text</h2>

          <div className="h-[560px] overflow-y-auto whitespace-pre-wrap rounded-xl bg-white p-5 text-sm leading-7 shadow">
            {translatedContent.originalText}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-center text-lg font-bold">
            Editable Uyghur Translation
          </h2>

          <textarea
            value={editedTranslation}
            onChange={(event) => setEditedTranslation(event.target.value)}
            dir="rtl"
            className="h-[560px] w-full resize-y rounded-xl border bg-white p-5 text-right text-lg leading-9 shadow focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-slate-700 px-6 py-3 text-white hover:bg-slate-800"
        >
          Save Draft
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
          onClick={() => navigate('/translation')}
          className="rounded-lg bg-slate-500 px-6 py-3 text-white hover:bg-slate-600"
        >
          Back to Translation
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