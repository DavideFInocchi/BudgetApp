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

function classifyTransaction(transaction) {
    const description = String(transaction.description ?? "").trim();
    const normalizedDescription = description.toLowerCase();
    const category = String(transaction.category_name ?? "").trim().toLowerCase();
    const amount = Number(transaction.amount);

    if (Number(transaction.category_id) === 8 && amount < 0) {
        return {
            ...transaction,
            financialType: "INVESTIMENTO",
            classificationReason: "movimento di investimento",
        };
    }

    if (amount >= 0) {
        return {
            ...transaction,
            financialType: "DA_CLASSIFICARE",
            classificationReason: "transazione di entrata non classificata nello Step 2",
        };
    }

    if (/mutuo|rata mutuo|prestito cucina|rata cucina|rata mutu|^cucina$/.test(normalizedDescription)) {
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

    if (/battesimo|compleanno|rosa compleaano|rosa compleanno/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "PREVEDIBILE",
            classificationReason: "evento prevedibile",
        };
    }

    if (/spumante|torta|no latte/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "PREVEDIBILE",
            classificationReason: "spesa collegata a evento prevedibile (compleanno Cloe)",
        };
    }

    if (/ombrellone/.test(normalizedDescription)) {
        if (Math.abs(amount) >= 100) {
            return {
                ...transaction,
                financialType: "PROGRAMMATO",
                classificationReason: "spesa programmata di importo elevato",
            };
        }

        return {
            ...transaction,
            financialType: "OCCASIONALE",
            classificationReason: "spesa occasionale per svago",
        };
    }

    if (/stabilimento/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "OCCASIONALE",
            classificationReason: "spesa occasionale per svago",
        };
    }

    if (/mare da papà|mare da papa/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "OCCASIONALE",
            classificationReason: "spesa occasionale per svago",
        };
    }

    if (/amazon prime/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "RICORRENTE",
            classificationReason: "abbonamento ricorrente",
        };
    }

    if (/pannolini|mangiapannolini|tigota|babylinoshop|detergente robot|capsule lavastoviglie|sacchetti robot|shampoo/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "STRUTTURALE",
            classificationReason: "spesa domestica strutturale",
        };
    }

    if (/lucia|lucia mazzone/.test(normalizedDescription) && category === "casa") {
        return {
            ...transaction,
            financialType: "STRUTTURALE",
            classificationReason: "pulizia della casa ricorrente strutturale",
        };
    }

    if (
        /cloe/.test(normalizedDescription) &&
        (category === "casa" || category === "vestiti") &&
        !/\bvarie cloe\b|\blatte ?cloe\b|\bcloe lavaggi\b/.test(normalizedDescription)
    ) {
        return {
            ...transaction,
            financialType: "PROGRAMMATO",
            classificationReason: "acquisto esplicito per Cloe",
        };
    }

    if (/regalo|anello|pensione luigi|argeste club vacanze|zoo|noleggio sci|jhon cena|amazon|temu|brico|ikea|spettacolo pampers/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "OCCASIONALE",
            classificationReason: "spesa occasionale",
        };
    }

    if (/freni|tagliando|revisione|manutenzione auto|scalo due autoricambi|pezza ruota|maccina daniels|manutenzione caldaia/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "RICORRENTE_IRREGOLARE",
            classificationReason: "manutenzione/spesa tecnica ricorrente irregolare",
        };
    }

    if (/bollo/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "RICORRENTE_IRREGOLARE",
            classificationReason: "bollo auto ricorrente irregolare",
        };
    }

    if (/pieno|benzina|metano|rifornimento|refuel|\beni\b|\blacnia\b|\blancia\b/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "RICORRENTE",
            classificationReason: "spesa auto/carburante ricorrente",
        };
    }

    if (/telepass/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "RICORRENTE",
            classificationReason: "pedaggio ricorrente",
        };
    }

    if (/\brca\b|assicurazione|polizza/.test(normalizedDescription)) {
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

    if (/prime|crunchyroll|crunchy roll|chruncy roll|crucnhyroll|discovery|dplay|chatgpt|openai|vpn|mullvad vpn|3 mesi abbonamento/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "RICORRENTE",
            classificationReason: "abbonamento ricorrente",
        };
    }

    if (/palestra|barbiere/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "RICORRENTE",
            classificationReason: "servizio ricorrente",
        };
    }

    if (/farmacia|farmaci|farmcia|parafarmacia|ryaltris|spray davide|analisi|cardiologo|certificato e holter|monitoraggio notturno|lenti daniela|casa di cura|allergologo|pneumologo|osteopata|fisioterapia|visita cloe/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "RICORRENTE_IRREGOLARE",
            classificationReason: "spesa sanitaria ricorrente irregolare",
        };
    }

    if (/condominio/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "STRUTTURALE",
            classificationReason: "spesa condominiale strutturale",
        };
    }

    if (/\baction\b/.test(normalizedDescription) && category === "casa") {
        return {
            ...transaction,
            financialType: "STRUTTURALE",
            classificationReason: "acquisto domestico strutturale",
        };
    }

    // Latte Cloe è un consumo alimentare ricorrente della famiglia.
    if (/\blatte ?cloe\b/.test(normalizedDescription) && category === "alimentari") {
        return {
            ...transaction,
            financialType: "STRUTTURALE",
            classificationReason: "consumo alimentare ricorrente strutturale",
        };
    }

    if (/\bmd\b|conad|eurospin|lidl|carrefour|supermercato|supermarket|macelleria|alimentari|cona market|maxi tigre/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "STRUTTURALE",
            classificationReason: "spesa alimentare strutturale",
        };
    }

    if (/ford|lancia/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "RICORRENTE",
            classificationReason: "spesa auto ricorrente",
        };
    }

    if (/cena|pranzo|pizza|colazione|caffè|caffe|bar|gelateria|gelato|asporto|sushi/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "RICORRENTE_IRREGOLARE",
            classificationReason: "spesa di consumo ricorrente irregolare",
        };
    }

    if (/primigi outlet|scarpe zalando|zalando|maglia|mutande|scarpe diem/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "RICORRENTE_IRREGOLARE",
            classificationReason: "abbigliamento ricorrente irregolare",
        };
    }

    if (/ritiro sportello/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "RICORRENTE_IRREGOLARE",
            classificationReason: "prelievo ricorrente irregolare",
        };
    }

    if (/pezzotto/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "RICORRENTE",
            classificationReason: "servizio ricorrente",
        };
    }

    return {
        ...transaction,
        financialType: "DA_CLASSIFICARE",
        classificationReason: "nessuna regola applicabile",
    };
}

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
