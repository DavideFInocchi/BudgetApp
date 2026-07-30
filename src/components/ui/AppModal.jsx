import AppButton from "./AppButton";

export default function AppModal({

    open,
    title,
    children,
    onClose,
    footer,
    size = "",
    bodyClassName = ""

}) {

    if (!open) {
        return null;
    }

    return (

        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,.5)" }}
        >

            <div className={`modal-dialog ${size}`}>

                <div className="modal-content">

                    <div className="modal-header">

                        <h5 className="modal-title">

                            {title}

                        </h5>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        />

                    </div>

                    <div className={`modal-body ${bodyClassName}`}>

                        {children}

                    </div>

                    <div className="modal-footer">

                        {footer ?? (

                            <AppButton
                                variant="secondary"
                                onClick={onClose}
                            >

                                Chiudi

                            </AppButton>

                        )}

                    </div>

                </div>

            </div>

        </div>

    );

}