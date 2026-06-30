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
  const [translatedContent, setTranslatedContent] =
    useState<TranslatedContent | null>(null)
  const [editableTranslation, setEditableTranslation] = useState('')
  const [status, setStatus] = useState('Not reviewed yet.')

  const navigate = useNavigate()

  useEffect(() => {
    const savedTranslation = localStorage.getItem('translatedContent')

    if (!savedTranslation) {
      return
    }

    const parsedTranslation = JSON.parse(savedTranslation) as TranslatedContent
    setTranslatedContent(parsedTranslation)
    setEditableTranslation(parsedTranslation.translatedText)

    if (parsedTranslation.reviewStatus === 'reviewed') {
      setStatus('Reviewed.')
    }
  }, [])

  const handleSave = () => {
    if (!translatedContent) {
      setStatus('No translated content found.')
      return
    }

    const updatedContent: TranslatedContent = {
      ...translatedContent,
      translatedText: editableTranslation,
    }

    localStorage.setItem('translatedContent', JSON.stringify(updatedContent))
    setTranslatedContent(updatedContent)
    setStatus('Changes saved successfully.')
  }

  const handleMarkAsReviewed = () => {
    if (!translatedContent) {
      setStatus('No translated content found.')
      return
    }

    const reviewedContent: TranslatedContent = {
      ...translatedContent,
      translatedText: editableTranslation,
      reviewStatus: 'reviewed',
    }

    localStorage.setItem('translatedContent', JSON.stringify(reviewedContent))
    setTranslatedContent(reviewedContent)
    setStatus('Marked as reviewed.')
  }

  const handleGoToExport = () => {
    if (!translatedContent) {
      setStatus('No translated content found.')
      return
    }

    const contentToExport: TranslatedContent = {
      ...translatedContent,
      translatedText: editableTranslation,
    }

    localStorage.setItem('translatedContent', JSON.stringify(contentToExport))
    navigate('/export')
  }

  if (!translatedContent) {
    return (
      <section>
        <h2 className="mb-8 text-center text-3xl font-bold">
          Review and Edit
        </h2>

        <div className="rounded-xl bg-white p-10 text-center shadow">
          <p className="text-slate-600">
            No translated content found. Go to Translation and click Start
            Translation first.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <h2 className="mb-8 text-center text-3xl font-bold">Review and Edit</h2>

      <div className="mb-6 rounded-lg bg-white p-4 shadow">
        <p>
          <strong>Selected:</strong> {translatedContent.title}
        </p>
        <p>
          <strong>Source Type:</strong> {translatedContent.sourceType}
        </p>
        <p>
          <strong>Status:</strong> {status}
        </p>
      </div>

      <div className="mb-8 flex gap-4">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-blue-500 px-6 py-3 text-white hover:bg-blue-600"
        >
          Save
        </button>

        <button
          type="button"
          onClick={handleMarkAsReviewed}
          className="rounded-lg bg-blue-500 px-6 py-3 text-white hover:bg-blue-600"
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

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="mb-3 text-center font-semibold">Original Text</h3>

          <div className="max-h-[520px] min-h-[420px] overflow-y-auto whitespace-pre-wrap rounded-xl bg-white p-6 shadow">
            {translatedContent.originalText}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-center font-semibold">
            Uyghur Translation
          </h3>

          <textarea
            value={editableTranslation}
            onChange={(event) => setEditableTranslation(event.target.value)}
            className="min-h-[420px] max-h-[520px] w-full resize-none overflow-y-auto whitespace-pre-wrap rounded-xl bg-white p-6 shadow"
            dir="rtl"
          />
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-white p-4 shadow">
        <strong>Preserved Arabic Terms:</strong> اسم | فعل | حرف | رفع | نصب | جر
      </div>
    </section>
  )
}

export default ReviewEdit