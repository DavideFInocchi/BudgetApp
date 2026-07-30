import AppTable from "../../components/ui/AppTable";

export default function CategoryTable({
    categories,
    onEdit,
    onDelete
}) {

    const columns = [

        {

            key: "icon",

            label: "",

            width: "70px",

            render: (row) => (

                <i
                    className={`bi bi-${row.icon}`}
                    style={{
                        color: row.color,
                        fontSize: "1.3rem"
                    }}
                />

            )

        },

        {

            key: "name",

            label: "Categoria"

        },

        {

            key: "active",

            label: "Stato",

            width: "120px",

            render: (row) => (

                <span
                    className={`badge ${
                        row.active
                            ? "bg-success"
                            : "bg-secondary"
                    }`}
                >

                    {row.active ? "Attiva" : "Disattiva"}

                </span>

            )

        },

        {

            key: "actions",

            label: "",

            width: "120px",

            render: (row) => (

                <>

                    <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => onEdit(row)}
                    >

                        <i className="bi bi-pencil"></i>

                    </button>

                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(row)}
                    >

                        <i className="bi bi-trash"></i>

                    </button>

                </>

            )

        }

    ];

    return (

        <AppTable

            columns={columns}

            data={categories}

        />

    );

}
