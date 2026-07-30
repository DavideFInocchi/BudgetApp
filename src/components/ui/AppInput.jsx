import { forwardRef } from "react";

const AppInput = forwardRef(function AppInput({

    label,
    error,
    className = "",
    ...props

}, ref) {

    return (

        <div className="mb-3">

            {label && (

                <label className="form-label">

                    {label}

                </label>

            )}

            <input
                ref={ref}
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

export default AppInput;
