import { useFormContext } from "react-hook-form";

export default function NumberField({
    name,
    label,
    step = "0.01",
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
                type="number"
                step={step}
                className={`form-control ${
                    errors[name] ? "is-invalid" : ""
                }`}
                {...register(name, {
                    valueAsNumber: true,
                })}
            />

            {errors[name] && (
                <div className="invalid-feedback">
                    {errors[name].message}
                </div>
            )}

        </div>

    );

}