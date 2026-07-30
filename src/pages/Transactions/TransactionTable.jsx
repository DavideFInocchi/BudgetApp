import AppTable from "../../components/ui/AppTable";
//import AppButton from "../../components/ui/AppButton";
import { AppBalanceBadge } from "../../components/ui";
const currencyFormatter = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR"
});

const dateFormatter = new Intl.DateTimeFormat("it-IT");

export default function TransactionTable({
    transactions,
    onEdit,
    onDelete,
    sortField,
    sortDirection,
    onSort
}) {

    const columns = [

        {
            key: "transaction_date",

            label: "Data",

            width: "120px",
            sortable: true,
            render: (row) =>
                dateFormatter.format(new Date(row.transaction_date))
        },

        {
            key: "category_name",

            label: "Categoria",

            render: (row) => (

                <div className="d-flex align-items-center gap-2">

                    <i
                        className={`bi bi-${row.category_icon}`}
                        style={{
                            color: row.category_color,
                            fontSize: "1.2rem"
                        }}
                    />

                    <span>{row.category_name}</span>

                </div>

            )
        },

        {
            key: "description",

            label: "Descrizione"
        },

        {
            key: "transaction_type",

            label: "Tipo",

            width: "120px",

            render: (row) => (

                <span
                    className={`badge ${
                        row.transaction_type === "Entrata"
                            ? "bg-success"
                            : "bg-danger"
                    }`}
                >
                    {row.transaction_type}
                </span>

            )
        },
        {
            key: "balance_type",
            label: "Saldo",
            sortable: true,
            render: (row) => (
                <AppBalanceBadge
                    value={row.balance_type}
                    size="sm"
                />
            ),
        },

        {
            key: "amount",

            label: "Importo",

            width: "140px",

            render: (row) => (

                <span
                    className={
                        row.transaction_type === "Entrata"
                            ? "text-success fw-semibold"
                            : "text-danger fw-semibold"
                    }
                >
                    {currencyFormatter.format(row.amount)}
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
    data={transactions}
    sortField={sortField}
    sortDirection={sortDirection}
    onSort={onSort}
    emptyMessage="Nessun movimento trovato."
/>

    );

}