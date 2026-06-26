import { NavLink, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Documents from './pages/Documents'
import Translation from './pages/Translation'
import ReviewEdit from './pages/ReviewEdit'
import Export from './pages/Export'
import Glossary from './pages/Glossary'

function App() {
  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Upload', path: '/upload' },
    { name: 'Documents', path: '/documents' },
    { name: 'Translation', path: '/translation' },
    { name: 'Review and Edit', path: '/review-edit' },
    { name: 'Export', path: '/export' },
    { name: 'Glossary', path: '/glossary' },
  ]

  return (
    <div className="min-h-screen bg-blue-50 text-slate-900">
      <header className="h-12 bg-blue-600 text-white flex items-center px-6">
        <h1 className="font-semibold text-lg">
          Smart Study Assistant & Uyghur Translator
        </h1>
      </header>

      <div className="flex">
        <aside className="w-56 min-h-[calc(100vh-3rem)] bg-blue-400 text-slate-900">
          <nav className="flex flex-col">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-6 py-4 border-b border-blue-300 font-medium ${
                    isActive ? 'bg-blue-600 text-white' : 'hover:bg-blue-300'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/translation" element={<Translation />} />
            <Route path="/review-edit" element={<ReviewEdit />} />
            <Route path="/export" element={<Export />} />
            <Route path="/glossary" element={<Glossary />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App