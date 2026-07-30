import { useMemo, useState } from "react";

import AppModal from "../AppModal";
import AppButton from "../AppButton";

import IconSearch from "./IconSearch";
import IconGrid from "./IconGrid";

export default function IconPickerModal({

    open,
    icons,
    selected,
    onClose,
    onSelect

}) {

    const [search, setSearch] = useState("");

    const filteredIcons = useMemo(() => {

        const text = search.toLowerCase().trim();

        if (!text) {
            return icons;
        }

        return icons.filter(icon =>

            icon.label.toLowerCase().includes(text) ||
            icon.value.toLowerCase().includes(text)

        );

    }, [icons, search]);

    const footer = (

        <AppButton
            variant="secondary"
            onClick={onClose}
        >

            Chiudi

        </AppButton>

    );

    return (

        <AppModal
            open={open}
            title="Seleziona icona"
            onClose={onClose}
            footer={footer}
            size="modal-lg"
        >

            <IconSearch
                value={search}
                onChange={setSearch}
            />

            <IconGrid
                icons={filteredIcons}
                selected={selected}
                onSelect={onSelect}
            />

        </AppModal>

    );

}