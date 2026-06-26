function Documents() {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-8">Documents</h2>

      <div className="grid grid-cols-[260px_1fr] bg-white rounded-xl shadow overflow-hidden">
        <aside className="bg-blue-600 text-white min-h-[500px]">
          <div className="p-5 border-b border-blue-500">Document 1</div>
          <div className="p-5 border-b border-blue-500">Document 2</div>
        </aside>

        <main className="p-10 space-y-5">
          <p><strong>Document Name:</strong> Dream Textbook</p>
          <p><strong>Document Size:</strong> 25 MB</p>
          <p><strong>Total Pages:</strong> 552</p>
          <p><strong>Source Language:</strong> Mixed English + Arabic</p>
          <p><strong>Target Language:</strong> Uyghur</p>
          <p><strong>Preserved Arabic Terms:</strong> Enabled</p>

          <div>
            <h3 className="font-bold mt-8 mb-3">Chapters</h3>
            <div className="space-y-3">
              <div className="flex justify-between border rounded-lg p-4">
                <span>Chapter 1 - Types of Words in Arabic</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Translate</button>
              </div>
              <div className="flex justify-between border rounded-lg p-4">
                <span>Chapter 2 - الإعراب</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Translate</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  )
}

export default Documents