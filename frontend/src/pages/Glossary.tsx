function Glossary() {
  const terms = [
    ['اسم', 'noun / name word', 'ئىسىم'],
    ['فعل', 'verb / action word', 'پېئىل'],
    ['حرف', 'particle / letter', 'ھەرپ'],
    ['رفع', 'doer status', 'رەفئ'],
    ['نصب', 'detail status', 'نەصب'],
    ['جر', 'after-of status', 'جەر'],
  ]

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8">Glossary</h2>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4 text-left">Arabic Term</th>
              <th className="p-4 text-left">English Meaning</th>
              <th className="p-4 text-right">Uyghur Explanation</th>
            </tr>
          </thead>
          <tbody>
            {terms.map(([arabic, english, uyghur]) => (
              <tr key={arabic} className="border-b">
                <td className="p-4 text-xl" dir="rtl">{arabic}</td>
                <td className="p-4">{english}</td>
                <td className="p-4 text-right" dir="rtl">{uyghur}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Glossary