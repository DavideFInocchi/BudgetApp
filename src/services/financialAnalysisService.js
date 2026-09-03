// src/services/financialAnalysisService.js

import transactionService from "./transactionService";

/**
 * Recupera e aggrega il cash flow storico su base mensile.
 *
 * Step 1 dell'Analisi Finanziaria:
 * - usa esclusivamente transazioni reali;
 * - considera gli investimenti separatamente dalle altre uscite;
 * - non applica classificazioni future o simulazioni;
 * - non modifica alcun dato.
 *
 * @param {Object} params
 * @param {string} params.from Data iniziale inclusiva (YYYY-MM-DD)
 * @param {string} params.to Data finale inclusiva (YYYY-MM-DD)
 * @returns {Promise<Object>}
 */
export async function getHistoricalFinancialAnalysis({ from, to }) {
    const transactions = await transactionService.getByPeriod({ from, to });

    return buildHistoricalMonthlyCashFlow(transactions);
}

/**
 * Aggrega le transazioni per mese.
 *
 * @param {Array<Object>} transactions
 * @returns {Object}
 */
function buildHistoricalMonthlyCashFlow(transactions) {
    const months = new Map();

    transactions.forEach(transaction => {
        const date = transaction.transaction_date;
        const month = date.slice(0, 7);
        const amount = Number(transaction.amount);

        if (!months.has(month)) {
            months.set(month, {
                month,
                income: 0,
                expenses: 0,
                investments: 0,
                cashFlowPrePac: 0,
                cashFlowPostPac: 0,
                transactionsCount: 0,
            });
        }

        const summary = months.get(month);
        summary.transactionsCount += 1;

        if (amount > 0) {
            summary.income += amount;
            return;
        }

        if (amount < 0) {
            const expense = Math.abs(amount);

            if (Number(transaction.category_id) === 8) {
                summary.investments += expense;
            } else {
                summary.expenses += expense;
            }
        }
    });

    const monthly = [...months.values()]
        .sort((a, b) => a.month.localeCompare(b.month))
        .map(summary => ({
            ...summary,
            cashFlowPrePac: summary.income - summary.expenses,
            cashFlowPostPac:
                summary.income - summary.expenses - summary.investments,
        }));

    return {
        from: monthly[0]?.month ?? null,
        to: monthly.at(-1)?.month ?? null,
        monthly,
    };
}

export default {
    getHistoricalFinancialAnalysis,
};
