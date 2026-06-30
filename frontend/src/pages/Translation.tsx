import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ExtractedChapter, ExtractedPage } from '../types/document'

type TranslatedContent = {
  title: string
  originalText: string
  translatedText: string
  sourceType: 'chapter' | 'page'
  sourceNumber: number
}

function Translation() {
  const [selectedPage, setSelectedPage] = useState<ExtractedPage | null>(null)
  const [selectedChapter, setSelectedChapter] =
    useState<ExtractedChapter | null>(null)

  const [translatedText, setTranslatedText] = useState('')
  const [translationStatus, setTranslationStatus] = useState(
    'Translation has not started yet.',
  )

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

  const createMockTranslation = (text: string) => {
    const preview = text.slice(0, 1200)

    return `بۇ ھازىرچە سىناق تەرجىمە نۇسخىسى.

بۇ بۆلەكتە ئەسلى تېكىست ئۇيغۇرچىغا تەرجىمە قىلىنىدۇ. ئەرەبچە ئاتالغۇلار، مەسىلەن اسم، فعل، حرف، رفع، نصب، جر قاتارلىقلار ئۆز ھالىتىدە ساقلىنىدۇ.

--- ئەسلى مەزمۇننىڭ قىسقا كۆرۈنۈشى ---

${preview}`
  }

  const handleStartTranslation = () => {
    if (!selectedChapter && !selectedPage) {
      setTranslationStatus('Please select a chapter or page first.')
      return
    }

    setTranslationStatus('Mock translation generated successfully.')

    const mockTranslation = createMockTranslation(originalText)
    setTranslatedText(mockTranslation)

    const translatedContent: TranslatedContent = {
      title: selectedTitle,
      originalText,
      translatedText: mockTranslation,
      sourceType: selectedChapter ? 'chapter' : 'page',
      sourceNumber: selectedChapter
        ? selectedChapter.chapter_number
        : selectedPage?.page_number || 0,
    }

    localStorage.setItem('translatedContent', JSON.stringify(translatedContent))
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
          className="rounded-lg bg-blue-500 px-6 py-3 text-white hover:bg-blue-600"
        >
          Start Translation
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