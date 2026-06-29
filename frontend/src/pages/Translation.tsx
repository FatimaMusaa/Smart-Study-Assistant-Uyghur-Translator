import { useEffect, useState } from 'react'
import type { ExtractedChapter, ExtractedPage } from '../types/document'

function Translation() {
  const [selectedPage, setSelectedPage] = useState<ExtractedPage | null>(null)
  const [selectedChapter, setSelectedChapter] =
    useState<ExtractedChapter | null>(null)

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

  return (
    <section>
      <h2 className="mb-8 text-center text-3xl font-bold">Translation</h2>

      <div className="mb-8 flex gap-4">
        <button className="rounded-lg bg-blue-500 px-6 py-3 text-white hover:bg-blue-600">
          Start Translation
        </button>

        <div className="flex-1 rounded-lg bg-white px-6 py-3">
          {selectedTitle}
        </div>

        <button className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
          Continue to Review
        </button>
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
            Translation will appear here after AI translation is connected.
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