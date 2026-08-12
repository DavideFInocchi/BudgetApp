import { useState } from "react";

export function useTransactionFilters() {

    const [search, setSearchState] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const setSearch = (value) => {

        setSearchState(value);

    };

    return {

        search,
        setSearch,

        category,
        setCategory,

        type,
        setType,

        fromDate,
        setFromDate,

        toDate,
        setToDate,

    };

}