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
 * Step 2 dell'Analisi Finanziaria:
 * - applica una classificazione finanziaria temporanea in memoria;
 * - non salva la classificazione su Supabase.
 *
 * @param {Object} params
 * @param {string} params.from Data iniziale inclusiva (YYYY-MM-DD)
 * @param {string} params.to Data finale inclusiva (YYYY-MM-DD)
 * @returns {Promise<Object>}
 */
export async function getHistoricalFinancialAnalysis({ from, to }) {
    const transactions = await transactionService.getByPeriod({ from, to });
    const classifiedTransactions = transactions.map(classifyTransaction);

    return {
        ...buildHistoricalMonthlyCashFlow(transactions),
        classifiedTransactions,
    };
}

/**
 * Classifica una transazione esclusivamente in memoria.
 *
 * Priorita delle regole:
 * 1. descrizione specifica
 * 2. pattern nella descrizione
 * 3. categoria
 * 4. DA_CLASSIFICARE
 *
 * @param {Object} transaction
 * @returns {Object}
 */
function classifyTransaction(transaction) {
    const description = String(transaction.description ?? "").trim();
    const normalizedDescription = description.toLowerCase();
    const category = String(transaction.category_name ?? "").trim().toLowerCase();
    const amount = Number(transaction.amount);

    if (amount >= 0) {
        return {
            ...transaction,
            financialType: "DA_CLASSIFICARE",
            classificationReason: "transazione di entrata non classificata nello Step 2",
        };
    }

    if (/mutuo|rata mutuo|prestito cucina|rata cucina/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "STRUTTURALE",
            classificationReason: "impegno finanziario strutturale",
        };
    }

    if (/condizionatore|asciugatrice|mova mobius|materasso rata|telefono rata/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "PROGRAMMATO",
            classificationReason: "acquisto programmato o pagamento rateale",
        };
    }

    if (/battesimo|compleanno/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "PREVEDIBILE",
            classificationReason: "evento prevedibile",
        };
    }

    if (/regalo|anello/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "OCCASIONALE",
            classificationReason: "spesa occasionale",
        };
    }

    if (/freni|tagliando|revisione|manutenzione auto/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "RICORRENTE_IRREGOLARE",
            classificationReason: "manutenzione auto ricorrente irregolare",
        };
    }

    if (/bollo/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "RICORRENTE_IRREGOLARE",
            classificationReason: "bollo auto ricorrente irregolare",
        };
    }

    if (/pieno|benzina|metano|rifornimento/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "RICORRENTE",
            classificationReason: "carburante ricorrente",
        };
    }

    if (/telepass/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "RICORRENTE",
            classificationReason: "pedaggio ricorrente",
        };
    }

    if (/rca|assicurazione/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "RICORRENTE",
            classificationReason: "assicurazione ricorrente",
        };
    }

    if (/vodafone|enel|gas|argos/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "STRUTTURALE",
            classificationReason: "utenza/spesa domestica strutturale",
        };
    }

    if (category === "alimentari") {
        return {
            ...transaction,
            financialType: "STRUTTURALE",
            classificationReason: "categoria alimentari strutturale",
        };
    }

    return {
        ...transaction,
        financialType: "DA_CLASSIFICARE",
        classificationReason: "nessuna regola applicabile",
    };
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
