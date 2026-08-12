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
import TransactionImport from "./TransactionImport";
import TransactionImportModal from "./TransactionImportModal";

import {
    parseIntesaExcel,
    toTransactionRecord
} from "../../services/intesaImportService";
import { useTransactionFilters } from "../../hooks/useTransactionFilters";
import { filterTransactions, sortTransactions } from "../../utils/transactionUtils";

export default function TransactionsPage() {

    const {
        data: transactions = [],
        isLoading,
        error,
        remove,
        createMany
    } = useTransactions();

    const {
        data: categories = []
    } = useCategories();

    const [showModal, setShowModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    const [sortField, setSortField] = useState("transaction_date");
    const [sortDirection, setSortDirection] = useState("desc");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [showImportModal, setShowImportModal] = useState(false);
    const [importTransactions, setImportTransactions] = useState([]);

    const {

        search,
        setSearch,

        category,
        setCategory,

        type,
        setType,

        fromDate,
        setFromDate,

        toDate,
        setToDate,

    } = useTransactionFilters();

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

        return filterTransactions(

            transactions,

            {
                search,
                category,
                type,
                fromDate,
                toDate
            }

        );

    }, [
        transactions,
        search,
        category,
        type,
        fromDate,
        toDate
    ]);
    const sortedTransactions = useMemo(() => {

        return sortTransactions(
            filteredTransactions,
            sortField,
            sortDirection
        );

    }, [
        filteredTransactions,
        sortField,
        sortDirection
    ]);
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
            <TransactionImport
                onFileSelected={async (file) => {

                    try {

                        const data = await file.arrayBuffer();

                        const parsed =
                            parseIntesaExcel(data);

                        const normalized =
                            parsed.map(toTransactionRecord);

                        setImportTransactions(normalized);
                        setShowImportModal(true);

                    } catch (error) {

                        console.error("ERRORE IMPORT", error);

                    }

                }}
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
            <TransactionImportModal
                open={showImportModal}
                transactions={importTransactions}
                categories={categories}
                onClose={() => {
                    setShowImportModal(false);
                    setImportTransactions([]);
                }}
                onImport={async (data) => {

                    try {

                        const transactions =
                            data.map(toTransactionRecord);

                        const result =
                            await createMany.mutateAsync(transactions);

                        console.log("IMPORT COMPLETATO", result);

                    } catch (error) {

                        console.error("ERRORE IMPORT", error);

                    }

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