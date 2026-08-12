export function filterTransactions(
    transactions,
    {
        search,
        category,
        type,
        fromDate,
        toDate
    }
) {

    return transactions.filter(transaction => {

        const matchesSearch =
            (transaction.description ?? "")
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesCategory =
            !category ||
            String(transaction.category_id) === String(category);

        const matchesType =
            !type ||
            transaction.transaction_type === type;

        const transactionDate =
            transaction.transaction_date;

        const matchesFrom =
            !fromDate ||
            transactionDate >= fromDate;

        const matchesTo =
            !toDate ||
            transactionDate <= toDate;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesType &&
            matchesFrom &&
            matchesTo
        );

    });
}

export function sortTransactions(
    transactions,
    sortField,
    sortDirection
) {

    return [...transactions].sort((a, b) => {

        let valueA = a[sortField];
        let valueB = b[sortField];

        if (sortField === "amount") {

            valueA = Number(valueA);
            valueB = Number(valueB);

        }

        if (sortField === "transaction_date") {

            valueA = new Date(valueA);
            valueB = new Date(valueB);

        }

        if (typeof valueA === "string")
            valueA = valueA.toLowerCase();

        if (typeof valueB === "string")
            valueB = valueB.toLowerCase();

        if (valueA < valueB)
            return sortDirection === "asc" ? -1 : 1;

        if (valueA > valueB)
            return sortDirection === "asc" ? 1 : -1;

        return 0;

    });

}