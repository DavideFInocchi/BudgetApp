import { useState } from "react";
import AppButton from "../AppButton";
import IconPickerModal from "./IconPickerModal";

export default function AppIconPicker({

    label,
    value,
    onChange,
    icons,
    error

}) {

    const [open, setOpen] = useState(false);

    const selectedIcon = icons.find(icon => icon.value === value);

    const handleSelect = (icon) => {

        onChange?.(icon.value);
        setOpen(false);

    };

    return (

        <div className="mb-3">

            {label && (

                <label className="form-label">

                    {label}

                </label>

            )}

            <AppButton
                variant="outline-secondary"
                className={`w-100 d-flex justify-content-between align-items-center ${error ? "border-danger" : ""}`}
                onClick={() => setOpen(true)}
                type="button"
            >

                <span className="d-flex align-items-center gap-2">

                    {selectedIcon ? (

                        <>
                            <i className={`bi bi-${selectedIcon.value}`} />
                            {selectedIcon.label}
                        </>

                    ) : (

                        "Seleziona icona"

                    )}

                </span>

                <i className="bi bi-chevron-down" />

            </AppButton>

            {error && (

                <div className="text-danger small mt-1">

                    {error}

                </div>

            )}

            <IconPickerModal
                open={open}
                icons={icons}
                selected={value}
                onClose={() => setOpen(false)}
                onSelect={handleSelect}
            />

        </div>

    );

}