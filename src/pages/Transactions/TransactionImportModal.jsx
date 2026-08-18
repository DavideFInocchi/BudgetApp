import AppModal from "../../components/ui/AppModal";
import TransactionImportTable from "./TransactionImportTable";
import AppButton from "../../components/ui/AppButton";

import { useState } from "react";

export default function TransactionImportModal({
    open,
    transactions = [],
    importResult,
    onClose,
    categories = [],
    onImport

}) {
    console.log(
    "MODAL IMPORT RESULT:",
    importResult
);

    const [changes, setChanges] = useState({});

    const duplicateFingerprints = new Set(
        (importResult?.duplicates ?? [])
            .map(transaction => transaction.source_fingerprint)
    );

    const displayedTransactions = transactions.map(
        (transaction, index) => ({
            ...transaction,
            ...(changes[index] ?? {})
        })
    );

    const handleCategoryChange = (index, categoryId) => {
        setChanges(previous => ({
            ...previous,
            [index]: {
                ...previous[index],
                category_id: categoryId
            }
        }));

    };
    const handleImport = () => {

        const selected = displayedTransactions.filter(
            transaction =>
                transaction.included &&
                !duplicateFingerprints.has(
                    transaction.source_fingerprint
                )
        );

        onImport?.(selected);

    };
    const handleDescriptionChange = (index, description) => {

        setChanges(previous => ({
            ...previous,
            [index]: {
                ...previous[index],
                description
            }
        }));

    };
    const handleBalanceTypeChange = (index, balanceType) => {

        setChanges(previous => ({
            ...previous,
            [index]: {
                ...previous[index],
                balance_type: balanceType
            }
        }));

    };
    const handleIncludedChange = (index, included) => {

        setChanges(previous => ({
            ...previous,
            [index]: {
                ...previous[index],
                included
            }
        }));

    };


   
    return (

        <AppModal

            open={open}

            title="Importa transazioni"

            onClose={onClose}

            size="modal-xl"

            className="transaction-import-modal"
            
            footer={
                <AppButton
                    variant="primary"
                    onClick={handleImport}
                >
                    Importa transazioni
                </AppButton>
            }

        >
        <div>
            <div className="import-summary">

                <div className="import-summary__item">
                    <span className="import-summary__value">
                        {transactions.length}
                    </span>
                    <span className="import-summary__label">
                        Transazioni
                    </span>
                </div>

                <div className="import-summary__item">
                    <span className="import-summary__value import-summary__value--new">
                        {importResult?.newTransactions?.length ?? 0}
                    </span>
                    <span className="import-summary__label">
                        Nuove
                    </span>
                </div>

                <div className="import-summary__item">
                    <span className="import-summary__value import-summary__value--duplicate">
                        {importResult?.duplicates?.length ?? 0}
                    </span>
                    <span className="import-summary__label">
                        Già importate
                    </span>
                </div>

            </div>
            <TransactionImportTable
                transactions={displayedTransactions}
                categories={categories}
                manualDuplicates={importResult?.manualDuplicates ?? []}
                duplicateFingerprints={duplicateFingerprints}
                onCategoryChange={handleCategoryChange}
                onDescriptionChange={handleDescriptionChange}
                onBalanceTypeChange={handleBalanceTypeChange}
                onIncludedChange={handleIncludedChange}
            />

        </div>

        </AppModal>

    );

}