// Second-level normalization for bank-generated boilerplate.
//
// This function does not classify transactions and does not alter the
// original description. It only removes technical/bank-generated noise
// before merchant clustering.

export function normalizeMerchantContext(merchant) {
    return String(merchant ?? "")
        .replace(/\beffettuato\s+il\b.*?(?=\bpresso\b|$)/g, " ")
        .replace(/\balle\s+ore\b.*?(?=\bpresso\b|$)/g, " ")
        .replace(/\bmediante\s+la\s+carta\b.*?(?=\bpresso\b|$)/g, " ")
        .replace(/\bcarta\s+(?:n\.?\s*)?x+[a-z0-9]*\b/g, " ")
        .replace(/\b(?:terminal|term|pos|operazione|transazione|autorizzazione|codice)\s*[a-z0-9-]{4,}\b/g, " ")
        .replace(/\b(?:srl|srls|snc|sas|sapa|spa|gmbh|ltd|llc|inc|corp)\b/g, " ")
        .replace(/\bpresso\b/g, " ")
        .replace(/\b(?:citta|sant|angelo|pescara|montesilvano|silvi|pescasseroli|atri|pineto|montesil)\b/g, " ")
        .replace(/\b(?:via|viale|piazza|strada|corso)\b(?:\s+[a-z0-9]+){0,4}/g, " ")
        .replace(/\b\d{2,}\b/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export default normalizeMerchantContext;
