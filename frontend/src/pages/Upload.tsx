import { useState } from 'react'


import type { UploadedDocument } from '../types/document'

function Upload() {
  const [documentTitle, setDocumentTitle] = useState('')
  const [sourceLanguage, setSourceLanguage] = useState('Mixed English + Arabic')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadedDocument | null>(null)

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
      setUploadResult(null)
      return
    }

    setSelectedFile(file)
    setUploadStatus('File selected successfully.')
    setUploadResult(null)

    if (!documentTitle) {
      setDocumentTitle(file.name.replace(/\.[^/.]+$/, ''))
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please choose a file before uploading.')
      return
    }

    try {
      setIsUploading(true)
      setUploadStatus('Uploading and processing document...')

      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('document_title', documentTitle || selectedFile.name)
      formData.append('source_language', sourceLanguage)
      formData.append('target_language', 'Uyghur')
      formData.append('preserve_arabic_terms', 'true')
      formData.append('preserve_quranic_examples', 'true')

      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed.')
      }

      const data: UploadedDocument = await response.json()
      localStorage.setItem('uploadedDocument', JSON.stringify(data))
      
      setUploadResult(data)
      setUploadStatus('Document uploaded and processed successfully.')
    } catch (error) {
      setUploadStatus('Upload failed. Please make sure the backend server is running.')
      setUploadResult(null)
    } finally {
      setIsUploading(false)
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
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Uyghur
          </button>
        </div>

        <div>
          <p className="font-medium mb-2">Preservation Options</p>
          <div className="flex gap-4">
            <button
              type="button"
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg"
            >
              Preserve Arabic Terms
            </button>
            <button
              type="button"
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg"
            >
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
          disabled={isUploading}
          className={`w-full py-3 rounded-lg font-semibold text-white ${
            isUploading
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isUploading ? 'Processing...' : 'Upload Document'}
        </button>

        {uploadResult && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-3">
            <h3 className="text-xl font-bold">Backend Processing Result</h3>

            <p>
              <strong>Message:</strong> {uploadResult.message}
            </p>
            <p>
              <strong>Document Title:</strong> {uploadResult.document_title}
            </p>
            <p>
              <strong>Filename:</strong> {uploadResult.filename}
            </p>
            <p>
              <strong>Page Count:</strong> {uploadResult.page_count}
            </p>
            <p>
              <strong>Character Count:</strong> {uploadResult.character_count}
            </p>

            <div>
              <h4 className="font-semibold mb-2 mt-4">Extracted Pages Preview</h4>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {uploadResult.pages.slice(0, 10).map((page) => (
                  <div key={page.page_number} className="bg-white border rounded-lg p-4">
                    <p className="font-semibold mb-2">Page {page.page_number}</p>
                    <p className="whitespace-pre-wrap text-sm">
                      {page.text || 'No extractable text found on this page.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Upload