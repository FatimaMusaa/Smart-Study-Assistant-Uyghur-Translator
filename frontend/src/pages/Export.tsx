function Export() {
  return (
    <section className="max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-10">Export Final Uyghur Translation</h2>

      <div className="bg-white rounded-xl shadow p-8 mb-8 text-left">
        <p><strong>Document:</strong> Dream Textbook</p>
        <p><strong>Chapter:</strong> Chapter 1</p>
        <p><strong>Review Status:</strong> Reviewed</p>
      </div>

      <div className="space-y-6">
        <button className="w-full bg-blue-600 text-white py-5 rounded-xl text-xl font-bold">
          Download DOCX
        </button>
        <button className="w-full bg-blue-600 text-white py-5 rounded-xl text-xl font-bold">
          Download PDF
        </button>
      </div>
    </section>
  )
}

export default Export