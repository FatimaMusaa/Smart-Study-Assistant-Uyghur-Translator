import { useState } from 'react'

function Upload() {
  const [documentTitle, setDocumentTitle] = useState('')
  const [sourceLanguage, setSourceLanguage] = useState('Mixed English + Arabic')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    if (!allowedTypes.includes(file.type)) {
      setUploadStatus('Please select a PDF or DOCX file.')
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
    setUploadStatus('File selected successfully.')
  }

  const handleUpload = () => {
    if (!selectedFile) {
      setUploadStatus('Please choose a file before uploading.')
      return
    }

    setUploadStatus('Document uploaded successfully.')

    if (!documentTitle) {
      setDocumentTitle(selectedFile.name)
    }
  }

  const formatFileSize = (size: number) => {
    return `${(size / 1024 / 1024).toFixed(2)} MB`
  }

  return (
    <section className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Upload Document</h2>

      <div className="bg-white rounded-xl shadow p-8 space-y-6">
        <div>
          <label className="block font-medium mb-2">Document Title</label>
          <input
            type="text"
            value={documentTitle}
            onChange={(event) => setDocumentTitle(event.target.value)}
            placeholder="Quranic Arabic Grammar Textbook"
            className="w-full border border-slate-300 rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <p className="font-medium mb-2">Source Language</p>
          <div className="flex gap-4">
            {['English', 'Mixed English + Arabic', 'Arabic'].map((language) => (
              <button
                key={language}
                type="button"
                onClick={() => setSourceLanguage(language)}
                className={`px-4 py-2 rounded-lg ${
                  sourceLanguage === language
                    ? 'bg-blue-700 text-white'
                    : 'bg-blue-500 text-white'
                }`}
              >
                {language}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-medium mb-2">Target Language</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Uyghur
          </button>
        </div>

        <div>
          <p className="font-medium mb-2">Preservation Options</p>
          <div className="flex gap-4">
            <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg">
              Preserve Arabic Terms
            </button>
            <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg">
              Preserve Quranic Examples
            </button>
          </div>
        </div>

        <label className="block border-2 border-dashed border-blue-300 rounded-xl p-12 text-center bg-blue-50 cursor-pointer hover:bg-blue-100">
          <span className="font-medium">Choose PDF or DOCX File</span>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {selectedFile && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p>
              <strong>Selected File:</strong> {selectedFile.name}
            </p>
            <p>
              <strong>File Size:</strong> {formatFileSize(selectedFile.size)}
            </p>
            <p>
              <strong>Source Language:</strong> {sourceLanguage}
            </p>
            <p>
              <strong>Target Language:</strong> Uyghur
            </p>
          </div>
        )}

        {uploadStatus && (
          <div className="bg-slate-100 border border-slate-300 rounded-lg p-4">
            {uploadStatus}
          </div>
        )}

        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
        >
          Upload Document
        </button>
      </div>
    </section>
  )
}

export default Upload