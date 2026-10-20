function Pagination({ currentPage, lastPage, onPageChange }) {
  if (lastPage <= 1) return null

  const pages = Array.from({ length: lastPage }, (_, i) => i + 1)

  const btnClass = (active) =>
    `px-3 py-1 text-sm border rounded ${
      active ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-300 hover:bg-gray-50'
    }`

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-gray-600">
        Page {currentPage} of {lastPage}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {pages.map((p) => (
          <button key={p} onClick={() => onPageChange(p)} className={btnClass(p === currentPage)}>
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Pagination
