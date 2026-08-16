import { forwardRef } from "react";

const AppSelect = forwardRef(function AppSelect({

    label,
    error,
    options = [],
    className = "",
    wrapperClassName = "",
    ...props

}, ref) {

    return (

        <div className={`mb-3 ${wrapperClassName}`}>

            {label && (

                <label className="form-label">
                    {label}
                </label>

            )}

            <select
                ref={ref}
                className={`form-select ${error ? "is-invalid" : ""} ${className}`}
                {...props}
            >

                {options.map(option => (

                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>

                ))}

            </select>

            {error && (

                <div className="invalid-feedback">
                    {error}
                </div>

            )}

        </div>

    );

});

export default AppSelect;