function Upload() {
  return (
    <section className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Upload Document</h2>

      <div className="bg-white rounded-xl shadow p-8 space-y-6">
        <div>
          <label className="block font-medium mb-2">Document Title</label>
          <input
            type="text"
            placeholder="Quranic Arabic Grammar Textbook"
            className="w-full border border-slate-300 rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <p className="font-medium mb-2">Source Language</p>
          <div className="flex gap-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">English</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              Mixed English + Arabic
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Arabic</button>
          </div>
        </div>

        <div>
          <p className="font-medium mb-2">Target Language</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Uyghur</button>
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

        <div className="border-2 border-dashed border-blue-300 rounded-xl p-12 text-center bg-blue-50">
          Choose PDF or DOCX File
        </div>

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">
          Upload Document
        </button>
      </div>
    </section>
  )
}

export default Upload