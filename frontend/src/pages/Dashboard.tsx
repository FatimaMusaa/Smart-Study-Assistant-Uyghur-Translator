function Dashboard() {
  return (
    <section className="max-w-5xl mx-auto">
      <h2 className="text-4xl font-bold text-center text-slate-800 mb-4">
        Smart Study Assistant
      </h2>

      <p className="text-center text-slate-600 mb-12">
        Translate Quranic Arabic learning materials into Uyghur while preserving
        Arabic terms and Quranic examples.
      </p>

      <div className="grid grid-cols-3 gap-8">
        {[
          {
            title: 'Dashboard',
            description: 'View project progress and recent documents.',
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
        ].map((card) => (
          <div key={card.title} className="bg-white rounded-xl shadow p-8 text-center">
            <h3 className="font-semibold text-lg">{card.title}</h3>
            <p className="text-sm text-slate-500 mt-2">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Dashboard