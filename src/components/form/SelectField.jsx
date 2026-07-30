import { useFormContext } from "react-hook-form";

export default function SelectField({
    name,
    label,
    options,
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

            <select
                className={`form-select ${
                    errors[name] ? "is-invalid" : ""
                }`}
                {...register(name)}
            >

                {options.map((option) => (

                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>

                ))}

            </select>

            {errors[name] && (
                <div className="invalid-feedback">
                    {errors[name].message}
                </div>
            )}

        </div>

    );

}