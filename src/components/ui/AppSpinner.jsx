export default function AppSpinner({

    text = "Caricamento..."

}) {

    return (

        <div className="d-flex flex-column justify-content-center align-items-center py-5">

            <div
                className="spinner-border text-primary"
                role="status"
            />

            <div className="mt-3">

                {text}

            </div>

        </div>

    );

}
