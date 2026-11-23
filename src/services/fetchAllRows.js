/**
 * Recupera tutti i record di una query Supabase usando pagine esplicite.
 * queryFactory ricostruisce la stessa query con range inclusivo [from, to].
 * Applicare sempre un ordinamento deterministico, con id come ultimo criterio.
 */
export async function fetchAllRows(queryFactory, pageSize = 500) {
    if (!Number.isInteger(pageSize) || pageSize < 1) {
        throw new Error("pageSize deve essere un intero positivo.");
    }

    const rows = [];
    let from = 0;

    while (true) {
        const to = from + pageSize - 1;
        const { data, error } = await queryFactory(from, to);

        if (error) throw error;

        const page = data ?? [];
        rows.push(...page);

        if (page.length < pageSize) return rows;
        from += pageSize;
    }
}
