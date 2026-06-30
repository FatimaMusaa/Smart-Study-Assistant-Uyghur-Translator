import { useEffect, useState } from 'react'

type TranslatedContent = {
  title: string
  originalText: string
  translatedText: string
  sourceType: 'chapter' | 'page'
  sourceNumber: number
  reviewStatus?: 'not_reviewed' | 'reviewed'
}

function Export() {
  const [translatedContent, setTranslatedContent] =
    useState<TranslatedContent | null>(null)
  const [exportStatus, setExportStatus] = useState('')

  useEffect(() => {
    const savedTranslation = localStorage.getItem('translatedContent')

    if (!savedTranslation) {
      return
    }

    setTranslatedContent(JSON.parse(savedTranslation) as TranslatedContent)
  }, [])

  const createSafeFilename = (title: string, extension: string) => {
    const safeTitle = title
      .replace(/[^a-z0-9\u0600-\u06FF]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80)

    return `${safeTitle || 'translated-document'}.${extension}`
  }

  const handleDownloadTxt = () => {
    if (!translatedContent) {
      return
    }

    const fileContent = `
${translatedContent.title}

Source Type: ${translatedContent.sourceType}
Source Number: ${translatedContent.sourceNumber}
Review Status: ${translatedContent.reviewStatus || 'not_reviewed'}

====================
UYGHUR TRANSLATION
====================

${translatedContent.translatedText}

====================
ORIGINAL TEXT
====================

${translatedContent.originalText}
`

    const blob = new Blob([fileContent], {
      type: 'text/plain;charset=utf-8',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = createSafeFilename(translatedContent.title, 'txt')

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  const handleDownloadDocx = async () => {
    if (!translatedContent) {
      return
    }

    try {
      setExportStatus('Generating DOCX file...')

      const response = await fetch('http://localhost:8000/api/export/docx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: translatedContent.title,
          original_text: translatedContent.originalText,
          translated_text: translatedContent.translatedText,
          source_type: translatedContent.sourceType,
          source_number: translatedContent.sourceNumber,
          review_status: translatedContent.reviewStatus || 'not_reviewed',
        }),
      })

      if (!response.ok) {
        throw new Error('DOCX export failed.')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = createSafeFilename(translatedContent.title, 'docx')

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
      setExportStatus('DOCX downloaded successfully.')
    } catch {
      setExportStatus(
        'DOCX export failed. Make sure the backend server is running.',
      )
    }
  }

  if (!translatedContent) {
    return (
      <section className="mx-auto max-w-3xl text-center">
        <h2 className="mb-10 text-3xl font-bold">
          Export Final Uyghur Translation
        </h2>

        <div className="rounded-xl bg-white p-10 shadow">
          <p className="text-slate-600">
            No reviewed translation found. Go to Review and Edit first.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-4xl">
      <h2 className="mb-10 text-center text-3xl font-bold">
        Export Final Uyghur Translation
      </h2>

      <div className="mb-8 rounded-xl bg-white p-8 shadow">
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
          <strong>Review Status:</strong>{' '}
          {translatedContent.reviewStatus || 'not_reviewed'}
        </p>
      </div>

      {exportStatus && (
        <div className="mb-8 rounded-lg border border-blue-200 bg-white p-4">
          <strong>Status:</strong> {exportStatus}
        </div>
      )}

      <div className="mb-8 space-y-6">
        <button
          type="button"
          onClick={handleDownloadDocx}
          className="w-full rounded-xl bg-blue-600 py-5 text-xl font-bold text-white hover:bg-blue-700"
        >
          Download DOCX
        </button>

        <button
          type="button"
          onClick={handleDownloadTxt}
          className="w-full rounded-xl bg-slate-700 py-5 text-xl font-bold text-white hover:bg-slate-800"
        >
          Download TXT
        </button>

        <button
          type="button"
          disabled
          className="w-full cursor-not-allowed rounded-xl bg-blue-300 py-5 text-xl font-bold text-white"
        >
          Download PDF Coming Soon
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="mb-3 text-center font-semibold">Original Text</h3>
          <div className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-xl bg-white p-6 shadow">
            {translatedContent.originalText}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-center font-semibold">
            Uyghur Translation
          </h3>
          <div
            className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-xl bg-white p-6 shadow"
            dir="rtl"
          >
            {translatedContent.translatedText}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Export