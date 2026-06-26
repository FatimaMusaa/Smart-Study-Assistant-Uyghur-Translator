function App() {
  return (
    <div className="min-h-screen bg-blue-50 text-slate-900">
      {/* Top Navigation */}
      <header className="h-12 bg-blue-600 text-white flex items-center px-6">
        <h1 className="font-semibold text-lg">
          Smart Study Assistant & Uyghur Translator
        </h1>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 min-h-[calc(100vh-3rem)] bg-blue-400 text-slate-900">
          <nav className="flex flex-col">
            <a className="px-6 py-4 border-b border-blue-300 font-medium" href="#">
              Dashboard
            </a>
            <a className="px-6 py-4 border-b border-blue-300 font-medium" href="#">
              Upload
            </a>
            <a className="px-6 py-4 border-b border-blue-300 font-medium" href="#">
              Documents
            </a>
            <a className="px-6 py-4 border-b border-blue-300 font-medium" href="#">
              Translation
            </a>
            <a className="px-6 py-4 border-b border-blue-300 font-medium" href="#">
              Review and Edit
            </a>
            <a className="px-6 py-4 border-b border-blue-300 font-medium" href="#">
              Export
            </a>
            <a className="px-6 py-4 border-b border-blue-300 font-medium" href="#">
              Glossary
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10">
          <section className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-slate-800 mb-4">
              Smart Study Assistant
            </h2>
            <p className="text-center text-slate-600 mb-12">
              Translate Quranic Arabic learning materials into Uyghur while
              preserving Arabic terms and Quranic examples.
            </p>

            <div className="grid grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow p-8 text-center">
                <h3 className="font-semibold text-lg">Dashboard</h3>
                <p className="text-sm text-slate-500 mt-2">
                  View project progress and recent documents.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow p-8 text-center">
                <h3 className="font-semibold text-lg">Upload Documents</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Upload PDF or DOCX textbooks for translation.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow p-8 text-center">
                <h3 className="font-semibold text-lg">Document Details</h3>
                <p className="text-sm text-slate-500 mt-2">
                  View chapters, pages, and preservation settings.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow p-8 text-center">
                <h3 className="font-semibold text-lg">Translation</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Translate English or Arabic content into Uyghur.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow p-8 text-center">
                <h3 className="font-semibold text-lg">Review and Edit</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Review translation and correct Uyghur text.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow p-8 text-center">
                <h3 className="font-semibold text-lg">Export</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Export reviewed translation as DOCX or PDF.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App