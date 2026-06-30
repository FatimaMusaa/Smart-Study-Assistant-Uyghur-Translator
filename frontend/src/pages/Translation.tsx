import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ExtractedChapter, ExtractedPage } from '../types/document'

type TranslatedContent = {
  title: string
  originalText: string
  translatedText: string
  sourceType: 'chapter' | 'page'
  sourceNumber: number
  reviewStatus?: 'not_reviewed' | 'reviewed'
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

function Translation() {
  const [selectedPage, setSelectedPage] = useState<ExtractedPage | null>(null)
  const [selectedChapter, setSelectedChapter] =
    useState<ExtractedChapter | null>(null)

  const [translatedText, setTranslatedText] = useState('')
  const [translationStatus, setTranslationStatus] = useState(
    'Translation has not started yet.',
  )
  const [isTranslating, setIsTranslating] = useState(false)

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

  const handleStartTranslation = async () => {
    if (!selectedChapter && !selectedPage) {
      setTranslationStatus('Please select a chapter or page first.')
      return
    }

    try {
      setIsTranslating(true)
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
        throw new Error('Translation request failed.')
      }

      const data: TranslationApiResponse = await response.json()

      setTranslatedText(data.translated_text)
      setTranslationStatus(data.message)

      const translatedContent: TranslatedContent = {
        title: selectedTitle,
        originalText,
        translatedText: data.translated_text,
        sourceType,
        sourceNumber,
        reviewStatus: 'not_reviewed',
      }

      localStorage.setItem('translatedContent', JSON.stringify(translatedContent))
    } catch {
      setTranslationStatus(
        'Translation failed. Make sure the backend server is running.',
      )
    } finally {
      setIsTranslating(false)
    }
  }

  const handleContinueToReview = () => {
    if (!translatedText) {
      setTranslationStatus('Please start translation before continuing.')
      return
    }

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
        <strong>Status:</strong> {translationStatus}
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

      <div className="mt-6 rounded-xl bg-white p-4 shadow">
        <strong>Preserved Arabic Terms:</strong> اسم | فعل | حرف | رفع | نصب | جر
      </div>
    </section>
  )
}

export default Translation