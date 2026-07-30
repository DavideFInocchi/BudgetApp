export default function AppTable({

    columns = [],
    data = [],
    emptyMessage = "Nessun dato disponibile.",

    sortField,
    sortDirection,
    onSort

}) {

    return (

        <div className="table-responsive">

            <table className="table table-hover align-middle">

                <thead className="table-light">

                    <tr>

                        {columns.map(column => {

                            const sortable = column.sortable;

                            const active =
                                sortField === column.key;

                            return (

                                <th
                                    key={column.key}
                                    style={{
                                        width: column.width,
                                        cursor: sortable ? "pointer" : "default",
                                        userSelect: "none"
                                    }}
                                    onClick={() => {

                                        if (sortable && onSort) {

                                            onSort(column.key);

                                        }

                                    }}
                                >

                                    <div className="d-flex align-items-center gap-2">

                                        <span>{column.label}</span>

                                        {sortable && (

                                            <span className="small text-muted">

                                                {active
                                                    ? (
                                                        sortDirection === "asc"
                                                            ? "▲"
                                                            : "▼"
                                                    )
                                                    : "↕"}

                                            </span>

                                        )}

                                    </div>

                                </th>

                            );

                        })}

                    </tr>

                </thead>

                <tbody>

                    {data.length === 0 && (

                        <tr>

                            <td
                                colSpan={columns.length}
                                className="text-center py-5 text-muted"
                            >

                                {emptyMessage}

                            </td>

                        </tr>

                    )}

                    {data.map(row => (

                        <tr key={row.id}>

                            {columns.map(column => (

                                <td key={column.key}>

                                    {column.render
                                        ? column.render(row)
                                        : row[column.key]}

                                </td>

                            ))}

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}