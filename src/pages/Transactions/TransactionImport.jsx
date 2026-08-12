import { useRef } from "react";

import AppButton from "../../components/ui/AppButton";

export default function TransactionImport({
    onFileSelected
}) {

    const inputRef = useRef(null);

    const handleChange = (event) => {

        const file = event.target.files?.[0];

        if (!file)
            return;

        onFileSelected?.(file);

        event.target.value = "";
    };

    return (

        <>
            <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls"
                className="d-none"
                onChange={handleChange}
            />

            <AppButton
                variant="secondary"
                onClick={() => inputRef.current?.click()}
            >
                Importa Excel
            </AppButton>
        </>

    );

}