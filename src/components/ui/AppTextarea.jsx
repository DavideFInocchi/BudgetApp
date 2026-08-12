import { forwardRef } from "react";

const AppTextarea = forwardRef(function AppTextarea({

    label,
    error,
    className = "",
    rows = 3,
    ...props

}, ref) {

    return (

        <div className="mb-3">

            {label && (

                <label className="form-label">

                    {label}

                </label>

            )}

            <textarea
                ref={ref}
                rows={rows}
                className={`form-control ${error ? "is-invalid" : ""} ${className}`}
                {...props}
            />

            {error && (

                <div className="invalid-feedback">

                    {error}

                </div>

            )}

        </div>

    );

});

export default AppTextarea;