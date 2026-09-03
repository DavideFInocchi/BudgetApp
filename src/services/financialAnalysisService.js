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

    if (/battesimo|compleanno|rosa compleanno/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "PREVEDIBILE",
            classificationReason: "evento prevedibile",
        };
    }

    // Un ombrellone di importo elevato viene trattato come spesa programmata;
    // le normali spese balneari di importo contenuto restano occasionali.
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

    // Amazon Prime è un abbonamento ricorrente e deve essere valutato
    // prima della regola generica Amazon.
    if (/amazon prime/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "RICORRENTE",
            classificationReason: "abbonamento ricorrente",
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

    if (/pannolini|mangiapannolini|tigota|babylinoshop|detergente robot|capsule lavastoviglie|sacchetti robot|shampoo/.test(normalizedDescription)) {
        return {
            ...transaction,
            financialType: "STRUTTURALE",
            classificationReason: "spesa domestica strutturale",
        };
    }

    if (/\baction\b/.test(normalizedDescription) && category === "casa") {
        return {
            ...transaction,
            financialType: "STRUTTURALE",
            classificationReason: "acquisto domestico strutturale",
        };
    }