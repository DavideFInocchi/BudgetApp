import { forwardRef } from "react";

const AppCheckbox = forwardRef(function AppCheckbox({

    id,
    label,
    error,
    className = "",
    ...props

}, ref) {

    const inputId = id ?? props.name;

    return (

        <div className="mb-3">

            <div className="form-check">

                <input
                    ref={ref}
                    id={inputId}
                    type="checkbox"
                    className={`form-check-input ${error ? "is-invalid" : ""} ${className}`}
                    {...props}
                />

                {label && (

                    <label
                        className="form-check-label"
                        htmlFor={inputId}
                    >

                        {label}

                    </label>

                )}

            </div>

            {error && (

                <div className="invalid-feedback d-block">

                    {error}

                </div>

            )}

        </div>

    );

});

export default AppCheckbox;
