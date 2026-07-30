import AppButton from "../AppButton";
import AppModal from "../AppModal";

export default function ConfirmDialog({

    open,
    title = "Conferma",
    message,
    confirmText = "Conferma",
    cancelText = "Annulla",
    confirmVariant = "danger",
    onConfirm,
    onClose

}) {

    const footer = (

        <>
            <AppButton
                variant="secondary"
                onClick={onClose}
            >
                {cancelText}
            </AppButton>

            <AppButton
                variant={confirmVariant}
                onClick={onConfirm}
            >
                {confirmText}
            </AppButton>
        </>

    );

    return (

        <AppModal
            open={open}
            title={title}
            onClose={onClose}
            footer={footer}
        >

            <p className="mb-0">

                {message}

            </p>

        </AppModal>

    );

}