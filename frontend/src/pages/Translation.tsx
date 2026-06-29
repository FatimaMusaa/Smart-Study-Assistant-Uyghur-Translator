import { useEffect, useState } from 'react'
import type { ExtractedPage } from '../types/document'

function Translation() {
  const [selectedPage, setSelectedPage] = useState<ExtractedPage | null>(null)

  useEffect(() => {
    const savedPage = localStorage.getItem('selectedPage')

    if (savedPage) {
      setSelectedPage(JSON.parse(savedPage))
    }
  }, [])

  const originalText =
    selectedPage?.text ||
    'No page selected yet. Go to Documents and click Translate Page.'

  return (
    <section>
      <h2 className="text-3xl font-bold text-center mb-8">Translation</h2>

      <div className="flex gap-4 mb-8">
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg">
          Start Translation
        </button>

        <div className="flex-1 bg-white rounded-lg px-6 py-3">
          {selectedPage
            ? `Selected Page: ${selectedPage.page_number}`
            : 'No page selected'}
        </div>

        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
          Continue to Review
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-3 text-center">Original Text</h3>
          <div className="bg-white rounded-xl shadow min-h-[420px] max-h-[520px] overflow-y-auto p-6 whitespace-pre-wrap">
            {originalText}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-center">Uyghur Translation</h3>
          <div
            className="bg-white rounded-xl shadow min-h-[420px] max-h-[520px] overflow-y-auto p-6 whitespace-pre-wrap"
            dir="rtl"
          >
            Translation will appear here after AI translation is connected.
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mt-6">
        <strong>Preserved Arabic Terms:</strong> اسم | فعل | حرف | رفع | نصب | جر
      </div>
    </section>
  )
}

export default Translation