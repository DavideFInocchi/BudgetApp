import { useTransactions } from "../../hooks/useTransactions";

import AppModal from "../../components/ui/AppModal";

import TransactionForm from "./TransactionForm";

import toastService from "../../services/toastService";

export default function TransactionModal({

    show,
    transaction,
    onClose

}) {

    const {

        create,
        update

    } = useTransactions();

    const handleSubmit = async (data) => {

        const isEdit = !!transaction;

        const toastId = toastService.loading(

            isEdit
                ? "Aggiornamento movimento..."
                : "Creazione movimento..."

        );

        try {

            if (isEdit) {

                await update.mutateAsync({

                    id: transaction.id,
                    data

                });

            } else {

                await create.mutateAsync(data);

            }

            toastService.dismiss(toastId);

            toastService.success(

                isEdit
                    ? "Movimento aggiornato."
                    : "Movimento creato."

            );

            onClose();

        } catch (err) {

            console.error(err);

            toastService.dismiss(toastId);

            toastService.error(err.message);

        }

    };

    return (

        <AppModal
            open={show}
            onClose={onClose}
            title={
                transaction
                    ? "Modifica movimento"
                    : "Nuovo movimento"
            }
            size="modal-lg"
        >

            <TransactionForm
                transaction={transaction}
                onSubmit={handleSubmit}
                onCancel={onClose}
                loading={create.isPending || update.isPending}
            />

        </AppModal>

    );

}