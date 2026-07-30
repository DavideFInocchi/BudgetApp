export default function AppPagination({

    totalItems,
    page,
    pageSize,

    onPageChange,
    onPageSizeChange

}) {

    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    const start = totalItems === 0
        ? 0
        : (page - 1) * pageSize + 1;

    const end = Math.min(page * pageSize, totalItems);

    return (

        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-3">

            <div className="d-flex align-items-center gap-2">

                <span className="text-muted">

                    Mostra

                </span>

                <select
                    className="form-select"
                    style={{ width: 90 }}
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                >

                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>

                </select>

                <span className="text-muted">

                    Visualizzati {start}-{end} di {totalItems}

                </span>

            </div>

            <div className="btn-group">

                <button
                    className="btn btn-outline-secondary"
                    disabled={page === 1}
                    onClick={() => onPageChange(1)}
                >

                    «

                </button>

                <button
                    className="btn btn-outline-secondary"
                    disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}
                >

                    ‹

                </button>

                <button
                    className="btn btn-outline-primary"
                    disabled
                >

                    {page} / {totalPages}

                </button>

                <button
                    className="btn btn-outline-secondary"
                    disabled={page === totalPages}
                    onClick={() => onPageChange(page + 1)}
                >

                    ›

                </button>

                <button
                    className="btn btn-outline-secondary"
                    disabled={page === totalPages}
                    onClick={() => onPageChange(totalPages)}
                >

                    »

                </button>

            </div>

        </div>

    );

}