// Normalizzazione delle descrizioni bancarie per l'analisi finanziaria.
//
// Obiettivo dello Step 2A:
// - ridurre le variazioni superficiali delle descrizioni;
// - produrre una chiave merchant stabile per le analisi storiche;
// - non classificare la transazione e non modificare i dati originali.

export function normalizeMerchant(description) {
    const normalized = String(description ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\b(?:paypal|sumup|bkg\*|bkg|pos)\b/g, " ")
        .replace(/https?:\/\/\S+/g, " ")
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\b(?:via|viale|piazza|strada|corso)\b\s+[a-z0-9]+/g, " ")
        .replace(/\b(?:pescara|montesilvano|silvi|pescasseroli|atri|pineto|citta sant angelo)\b/g, " ")
        .replace(/\b\d{2,}\b/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    if (!normalized) {
        return "";
    }

    if (/^amazon(?: it)? luxembourg/.test(normalized)) {
        return "amazon";
    }

    if (/^amazon prime/.test(normalized)) {
        return "amazon prime";
    }

    if (/^booking com/.test(normalized)) {
        return "booking com";
    }

    return normalized;
}

export default normalizeMerchant;
