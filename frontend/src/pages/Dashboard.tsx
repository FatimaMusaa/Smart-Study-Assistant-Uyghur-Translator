import { useEffect, useState } from 'react'

type ApiStatus = 'checking' | 'connected' | 'disconnected'

function Dashboard() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking')
  const [apiMessage, setApiMessage] = useState('Checking backend connection...')

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/health')

        if (!response.ok) {
          throw new Error('Backend health check failed.')
        }

        const data = await response.json()

        setApiStatus('connected')
        setApiMessage(data.message || 'Backend API is connected.')
      } catch {
        setApiStatus('disconnected')
        setApiMessage('Backend API is disconnected. Make sure FastAPI is running.')
      }
    }

    checkApiStatus()
  }, [])

  const statusStyles = {
    checking: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    connected: 'bg-green-50 border-green-200 text-green-700',
    disconnected: 'bg-red-50 border-red-200 text-red-700',
  }

  const cards = [
    {
      title: 'Dashboard',
      description: 'View project progress and backend connection status.',
    },
    {
      title: 'Upload Documents',
      description: 'Upload PDF or DOCX textbooks for translation.',
    },
    {
      title: 'Document Details',
      description: 'View chapters, pages, and preservation settings.',
    },
    {
      title: 'Translation',
      description: 'Translate English or Arabic content into Uyghur.',
    },
    {
      title: 'Review and Edit',
      description: 'Review translation and correct Uyghur text.',
    },
    {
      title: 'Export',
      description: 'Export reviewed translation as DOCX or PDF.',
    },
  ]

  return (
    <section className="mx-auto max-w-5xl">
      <h2 className="mb-4 text-center text-4xl font-bold text-slate-800">
        Smart Study Assistant
      </h2>

      <p className="mb-8 text-center text-slate-600">
        Translate Quranic Arabic learning materials into Uyghur while preserving
        Arabic terms and Quranic examples.
      </p>

      <div
        className={`mb-10 rounded-xl border p-4 text-center font-medium ${statusStyles[apiStatus]}`}
      >
        <p>
          <strong>API Status:</strong>{' '}
          {apiStatus === 'checking'
            ? 'Checking...'
            : apiStatus === 'connected'
              ? 'Connected'
              : 'Disconnected'}
        </p>
        <p className="mt-1 text-sm">{apiMessage}</p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl bg-white p-8 text-center shadow"
          >
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="mt-2 text-sm text-slate-500">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Dashboard