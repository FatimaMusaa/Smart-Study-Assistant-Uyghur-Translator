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

function Export() {
  const navigate = useNavigate()
  const [translatedContent, setTranslatedContent] =
    useState<TranslatedContent | null>(null)
  const [exportStatus, setExportStatus] = useState('')
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false)

  useEffect(() => {
    const storedTranslatedContent = localStorage.getItem('translatedContent')

    if (storedTranslatedContent) {
      setTranslatedContent(JSON.parse(storedTranslatedContent))
    }
  }, [])

  const createSafeFilename = (title: string, extension: string) => {
    const safeTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80)

    return `${safeTitle || 'translated-document'}.${extension}`
  }

  const handleDownloadTxt = () => {
    if (!translatedContent) {
      setExportStatus('No translated content found.')
      return
    }

    const fileContent = `
Title: ${translatedContent.title}
Source Type: ${translatedContent.sourceType}
Source Number: ${translatedContent.sourceNumber}
Review Status: ${translatedContent.reviewStatus || 'not_reviewed'}

Uyghur Translation:
${translatedContent.translatedText}

Original Text:
${translatedContent.originalText}
`.trim()

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

    setExportStatus('TXT downloaded successfully.')
  }

  const handleDownloadDocx = async () => {
    if (!translatedContent) {
      setExportStatus('No translated content found.')
      return
    }

    try {
      setIsDownloadingDocx(true)
      setExportStatus('Preparing DOCX export...')

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
        const errorText = await response.text().catch(() => '')

        throw new Error(errorText || 'DOCX export failed.')
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
    } catch (error) {
      if (error instanceof Error) {
        setExportStatus(error.message)
      } else {
        setExportStatus('DOCX export failed.')
      }
    } finally {
      setIsDownloadingDocx(false)
    }
  }

  if (!translatedContent) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4">
        <h1 className="mb-6 text-3xl font-bold">Export</h1>

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
    <section className="mx-auto w-full max-w-6xl px-4">
      <h1 className="mb-6 text-3xl font-bold">Export</h1>

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

      {exportStatus && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <strong>Status:</strong> {exportStatus}
        </div>
      )}

      <div className="mb-8 space-y-4">
        <button
          type="button"
          onClick={handleDownloadDocx}
          disabled={isDownloadingDocx}
          className="w-full rounded-lg bg-blue-600 px-4 py-4 text-lg font-bold text-white hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isDownloadingDocx ? 'Preparing DOCX...' : 'Download DOCX'}
        </button>

        <button
          type="button"
          onClick={handleDownloadTxt}
          className="w-full rounded-lg bg-slate-700 px-4 py-4 text-lg font-bold text-white hover:bg-slate-800"
        >
          Download TXT
        </button>

        <button
          type="button"
          disabled
          className="w-full rounded-lg bg-blue-300 px-4 py-4 text-lg font-bold text-white"
        >
          Download PDF Coming Soon
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-center text-lg font-bold">Original Text</h2>

          <div className="h-[420px] overflow-y-auto whitespace-pre-wrap rounded-xl bg-white p-5 shadow">
            {translatedContent.originalText}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-center text-lg font-bold">
            Uyghur Translation
          </h2>

          <div
            dir="rtl"
            className="h-[420px] overflow-y-auto whitespace-pre-wrap rounded-xl bg-white p-5 text-right shadow"
          >
            {translatedContent.translatedText}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Export