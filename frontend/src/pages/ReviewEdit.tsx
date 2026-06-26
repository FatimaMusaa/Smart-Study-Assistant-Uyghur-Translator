function ReviewEdit() {
  return (
    <section>
      <h2 className="text-3xl font-bold text-center mb-8">Review and Edit</h2>

      <div className="flex gap-4 mb-8">
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg">Save</button>
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg">Mark as Reviewed</button>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">Export DOCX</button>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">Export PDF</button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-3 text-center">Original Text</h3>
          <div className="bg-white rounded-xl shadow min-h-[420px] p-6">
            An اسم is defined as a person, place, thing, idea, adjective, adverb,
            and more.
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-center">Uyghur Translation</h3>
          <textarea
            className="w-full bg-white rounded-xl shadow min-h-[420px] p-6 border-none"
            dir="rtl"
            defaultValue="اسم دېگەن ئادەم، ئورۇن، نەرسە، پىكىر، سۈپەت، ھال ۋە باشقىلارنى كۆرسىتىدۇ."
          />
        </div>
      </div>
        <div className="bg-white rounded-xl shadow p-4 mt-6">
        <strong>Preserved Arabic Terms:</strong> اسم | فعل | حرف | رفع | نصب | جر
        </div>
    </section>
  )
}

export default ReviewEdit