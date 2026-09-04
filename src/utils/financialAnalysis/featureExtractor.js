import normalizeMerchant from "./merchantNormalizer";

/**
 * Estrae feature descrittive dalle transazioni storiche.
 *
 * Step 2A:
 * - non classifica la transazione;
 * - non modifica i dati originali;
 * - separa le caratteristiche osservabili dalle future etichette del classificatore.
 *
 * Le feature comprendono dati della singola transazione e semplici statistiche
 * storiche del merchant osservato nel dataset fornito.
 */
export function extractFinancialFeatures(transactions = []) {
    const rows = Array.isArray(transactions) ? transactions : [];
    const merchantStats = buildMerchantStats(rows);

    return rows.map(transaction => {
        const amount = Number(transaction.amount);
        const absoluteAmount = Math.abs(amount);
        const date = String(transaction.transaction_date ?? "");
        const merchant = normalizeMerchant(transaction.description);
        const stats = merchantStats.get(merchant) ?? emptyMerchantStats();

        return {
            transactionId: transaction.id,
            merchant,
            categoryId: transaction.category_id ?? null,
            categoryName: transaction.category_name ?? null,
            transactionType: transaction.transaction_type ?? null,
            balanceType: transaction.balance_type ?? null,
            amount,
            absoluteAmount,
            isIncome: amount > 0,
            isExpense: amount < 0,
            month: date.slice(0, 7),
            dayOfMonth: getDayOfMonth(date),
            dayOfWeek: getDayOfWeek(date),
            merchantOccurrenceCount: stats.occurrenceCount,
            merchantMonthCount: stats.monthCount,
            merchantAverageAmount: stats.averageAmount,
            merchantMinAmount: stats.minAmount,
            merchantMaxAmount: stats.maxAmount,
        };
    });
}

function buildMerchantStats(transactions) {
    const stats = new Map();

    transactions.forEach(transaction => {
        const merchant = normalizeMerchant(transaction.description);
        if (!merchant) return;

        const amount = Math.abs(Number(transaction.amount));
        const month = String(transaction.transaction_date ?? "").slice(0, 7);
        const current = stats.get(merchant) ?? emptyMerchantStats();

        current.occurrenceCount += 1;
        if (Number.isFinite(amount)) {
            current.totalAmount += amount;
            current.minAmount = current.minAmount === null
                ? amount
                : Math.min(current.minAmount, amount);
            current.maxAmount = current.maxAmount === null
                ? amount
                : Math.max(current.maxAmount, amount);
        }
        if (month) current.months.add(month);

        stats.set(merchant, current);
    });

    stats.forEach(value => {
        value.monthCount = value.months.size;
        value.averageAmount = value.occurrenceCount
            ? value.totalAmount / value.occurrenceCount
            : 0;
        value.minAmount = value.minAmount ?? 0;
        value.maxAmount = value.maxAmount ?? 0;
        delete value.months;
        delete value.totalAmount;
    });

    return stats;
}

function emptyMerchantStats() {
    return {
        occurrenceCount: 0,
        monthCount: 0,
        totalAmount: 0,
        averageAmount: 0,
        minAmount: null,
        maxAmount: null,
        totalAmount: 0,
        months: new Set(),
    };
}

function getDayOfMonth(date) {
    if (!/^\d{4}-\d{2}-\d{2}/.test(date)) return null;
    return Number(date.slice(8, 10));
}

function getDayOfWeek(date) {
    if (!/^\d{4}-\d{2}-\d{2}/.test(date)) return null;

    const parsed = new Date(`${date.slice(0, 10)}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return null;

    return parsed.getDay();
}

export default extractFinancialFeatures;
