import { useFormContext } from "react-hook-form";

export default function TextField({
    name,
    label,
    placeholder = "",
}) {

    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (

        <div className="mb-3">

            <label className="form-label">

                {label}

            </label>

            <input
                className={`form-control ${
                    errors[name] ? "is-invalid" : ""
                }`}
                placeholder={placeholder}
                {...register(name)}
            />

            {errors[name] && (

                <div className="invalid-feedback">

                    {errors[name].message}

                </div>

            )}

        </div>

    );

}