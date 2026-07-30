import {  useMemo, useState } from "react";

import { useTransactions } from "../../hooks/useTransactions";
import { useCategories } from "../../hooks/useCategories";

import AppCard from "../../components/ui/AppCard";
import AppSpinner from "../../components/ui/AppSpinner";
import AppPagination from "../../components/ui/AppPagination";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

import toastService from "../../services/toastService";

import TransactionToolbar from "./TransactionToolbar";
import TransactionTable from "./TransactionTable";
import TransactionModal from "./TransactionModal";


export default function TransactionsPage() {

    const {
        data: transactions = [],
        isLoading,
        error,
        remove
    } = useTransactions();

    const {
        data: categories = []
    } = useCategories();

    const [showModal, setShowModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [sortField, setSortField] = useState("transaction_date");
    const [sortDirection, setSortDirection] = useState("desc");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);

    const handleAdd = () => {

        setSelectedTransaction(null);
        setShowModal(true);

    };

    const handleEdit = (transaction) => {

        setSelectedTransaction(transaction);
        setShowModal(true);

    };

    const handleDelete = (transaction) => {

        setTransactionToDelete(transaction);

    };

    const confirmDelete = async () => {

        if (!transactionToDelete)
            return;

        const toastId = toastService.loading("Eliminazione movimento...");

        try {

            await remove.mutateAsync(transactionToDelete.id);

            toastService.dismiss(toastId);
            toastService.success("Movimento eliminato.");

        } catch (err) {

            console.error(err);

            toastService.dismiss(toastId);
            toastService.error(err.message);

        } finally {

            setTransactionToDelete(null);

        }

    };
    const handleSort = (field) => {

        if (field === sortField) {

            setSortDirection(prev =>
                prev === "asc"
                    ? "desc"
                    : "asc"
            );

        } else {

            setSortField(field);
            setSortDirection("asc");

        }

    };
const filteredTransactions = useMemo(() => {

    return transactions.filter(transaction => {

        const matchesSearch =
            (transaction.description ?? "")
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesCategory =
            !category ||
            String(transaction.category_id) === String(category);

        const matchesType =
            !type ||
            transaction.transaction_type === type;

        const transactionDate = transaction.transaction_date;

        const matchesFrom =
            !fromDate ||
            transactionDate >= fromDate;

        const matchesTo =
            !toDate ||
            transactionDate <= toDate;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesType &&
            matchesFrom &&
            matchesTo
        );

    });

}, [
    transactions,
    search,
    category,
    type,
    fromDate,
    toDate
]);
const sortedTransactions = useMemo(() => {

    return [...filteredTransactions].sort((a, b) => {

        let valueA = a[sortField];
        let valueB = b[sortField];

        if (sortField === "amount") {
            valueA = Number(valueA);
            valueB = Number(valueB);
        }

        if (sortField === "transaction_date") {
            valueA = new Date(valueA);
            valueB = new Date(valueB);
        }

        if (typeof valueA === "string") valueA = valueA.toLowerCase();
        if (typeof valueB === "string") valueB = valueB.toLowerCase();

        if (valueA < valueB)
            return sortDirection === "asc" ? -1 : 1;

        if (valueA > valueB)
            return sortDirection === "asc" ? 1 : -1;

        return 0;

    });

}, [filteredTransactions, sortField, sortDirection]);
const pagedTransactions = useMemo(() => {

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return sortedTransactions.slice(start, end);

}, [sortedTransactions, page, pageSize]);

    if (isLoading)
        return <AppSpinner />;

    if (error) {

        return (

            <div className="alert alert-danger">

                {error.message}

            </div>

        );

    }
     return (

        <div className="container py-4">
            <TransactionToolbar
                search={search}
                setSearch={(value) => {
                    setSearch(value);
                    setPage(1);
                }}

                category={category}
                setCategory={(value) => {
                    setCategory(value);
                    setPage(1);
                }}

                type={type}
                setType={(value) => {
                    setType(value);
                    setPage(1);
                }}

                fromDate={fromDate}
                setFromDate={(value) => {
                    setFromDate(value);
                    setPage(1);
                }}

                toDate={toDate}
                setToDate={(value) => {
                    setToDate(value);
                    setPage(1);
                }}

                categories={categories}
                onAdd={handleAdd}
            />

            <AppCard>
     
                <TransactionTable
                    transactions={pagedTransactions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                />

            </AppCard>
            <AppPagination
                totalItems={sortedTransactions.length}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
            />
            <TransactionModal
                show={showModal}
                transaction={selectedTransaction}
                onClose={() => {

                    setShowModal(false);
                    setSelectedTransaction(null);

                }}
            />

            <ConfirmDialog
                open={!!transactionToDelete}
                title="Elimina movimento"
                message={
                    transactionToDelete
                        ? `Vuoi eliminare il movimento "${transactionToDelete.description}"?`
                        : ""
                }
                confirmText="Elimina"
                cancelText="Annulla"
                confirmVariant="danger"
                onConfirm={confirmDelete}
                onClose={() => setTransactionToDelete(null)}
            />

        </div>

    );

}