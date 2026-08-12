import AppModal from "../../components/ui/AppModal";
import TransactionImportTable from "./TransactionImportTable";
import AppButton from "../../components/ui/AppButton";

import { useState } from "react";

export default function TransactionImportModal({

    open,
    transactions = [],
    onClose,
    categories = [],
    onImport

}) {
    const [draftTransactions, setDraftTransactions] = useState(null);

    const displayedTransactions =
        draftTransactions ?? transactions ?? [];
        
    const handleCategoryChange = (index, categoryId) => {

        setDraftTransactions(previous => {

            const current = previous ?? transactions ?? [];

            return current.map((transaction, currentIndex) =>
                currentIndex === index
                    ? {
                        ...transaction,
                        category_id: categoryId
                    }
                    : transaction
            );

        });

    };
    const handleImport = () => {

        const current = draftTransactions ?? transactions ?? [];

        const selected = current.filter(
            transaction => transaction.included
        );
        console.log("Totali:", current.length);
        console.log("Selezionate:", selected.length);
        onImport?.(selected);

    };
    const handleDescriptionChange = (index, description) => {

        setDraftTransactions(previous => {

            const current = previous ?? transactions ?? [];

            return current.map((transaction, currentIndex) =>
                currentIndex === index
                    ? {
                        ...transaction,
                        description
                    }
                    : transaction
            );

        });

    };
    const handleBalanceTypeChange = (index, balanceType) => {

        setDraftTransactions(previous => {

            const current = previous ?? transactions ?? [];

            return current.map((transaction, currentIndex) =>
                currentIndex === index
                    ? {
                        ...transaction,
                        balance_type: balanceType
                    }
                    : transaction
            );

        });

    };
    const handleIncludedChange = (index, included) => {

        setDraftTransactions(previous => {

            const current = previous ?? transactions ?? [];

            return current.map((transaction, currentIndex) =>
                currentIndex === index
                    ? {
                        ...transaction,
                        included
                    }
                    : transaction
            );

        });

    };


   
    return (

        <AppModal

            open={open}

            title="Importa transazioni"

            onClose={onClose}

            size="modal-xl"

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

            <p className="text-muted mb-3">

                {transactions.length} transazioni trovate.

            </p>
            <TransactionImportTable
                transactions={displayedTransactions}
                categories={categories}
                onCategoryChange={handleCategoryChange}
                onDescriptionChange={handleDescriptionChange}
                onBalanceTypeChange={handleBalanceTypeChange}
                onIncludedChange={handleIncludedChange}
            />

        </div>

        </AppModal>

    );

}