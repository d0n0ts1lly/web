export default function Pagination({ page, totalPages, setPage }) {
  return (
    <div className="d-flex justify-content-center mt-4 gap-2">
      <button
        className="btn btn-outline-secondary"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Prev
      </button>

      <span className="align-self-center">
        {page} / {totalPages}
      </span>

      <button
        className="btn btn-outline-secondary"
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
