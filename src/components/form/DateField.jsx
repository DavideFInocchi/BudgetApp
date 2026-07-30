import { useFormContext } from "react-hook-form";

export default function DateField({
    name,
    label,
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
                type="date"
                className={`form-control ${
                    errors[name] ? "is-invalid" : ""
                }`}
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