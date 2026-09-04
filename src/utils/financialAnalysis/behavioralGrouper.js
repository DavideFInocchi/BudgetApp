/**
 * Raggruppa merchant cluster che possono rappresentare la stessa entita'
 * finanziaria, mantenendo separata l'identita' del merchant.
 *
 * Step 2A - Behavioral Grouping:
 * - non modifica le transazioni;
 * - non assegna il financialType;
 * - distingue similarity e complementarity;
 * - usa evidenze indipendenti invece di un singolo score;
 * - produce AUTO_MATCH, REVIEW o REJECT.
 *
 * Il risultato e' volutamente descrittivo: la fase successiva potra' usare
 * questi gruppi per assegnare il tipo finanziario.
 */
export function buildBehavioralGroups(features = []) {
    const rows = Array.isArray(features) ? features : [];
    const profiles = buildClusterProfiles(rows);
    const profileList = Array.from(profiles.values());
    const candidates = [];

    for (let i = 0; i < profileList.length; i += 1) {
        for (let j = i + 1; j < profileList.length; j += 1) {
            const left = profileList[i];
            const right = profileList[j];
            const evidence = evaluateRelationship(left, right);

            if (evidence.decision !== "REJECT") {
                candidates.push({
                    leftClusterId: left.clusterId,
                    rightClusterId: right.clusterId,
                    relationship: evidence.relationship,
                    decision: evidence.decision,
                    confidence: evidence.confidence,
                    evidence: evidence.evidence,
                });
            }
        }
    }

    return {
        profiles,
        candidates,
    };
}

function buildClusterProfiles(features) {
    const profiles = new Map();

    features.forEach(feature => {
        const clusterId = String(feature.merchantClusterId ?? feature.merchant ?? "").trim();
        if (!clusterId) return;

        const current = profiles.get(clusterId) ?? createEmptyProfile(clusterId);
        const amount = Number(feature.amount);
        const absoluteAmount = Math.abs(Number(feature.absoluteAmount ?? amount));
        const month = String(feature.month ?? "").slice(0, 7);
        const day = Number(feature.dayOfMonth);

        current.transactionCount += 1;
        if (month) current.months.add(month);
        if (feature.categoryId !== null && feature.categoryId !== undefined) {
            current.categories.set(
                feature.categoryId,
                (current.categories.get(feature.categoryId) ?? 0) + 1,
            );
        }
        if (Number.isFinite(amount) && amount !== 0) {
            current.direction = amount > 0 ? "income" : "expense";
        }
        if (Number.isFinite(absoluteAmount)) current.amounts.push(absoluteAmount);
        if (Number.isFinite(day) && day > 0) current.days.push(day);

        const merchant = String(feature.merchant ?? "").trim();
        const context = String(feature.merchantContext ?? "").trim();
        if (merchant) current.merchants.add(merchant);
        if (context) current.contexts.add(context);

        profiles.set(clusterId, current);
    });

    profiles.forEach(profile => finalizeProfile(profile));
    return profiles;
}

function createEmptyProfile(clusterId) {
    return {
        clusterId,
        transactionCount: 0,
        months: new Set(),
        categories: new Map(),
        direction: null,
        amounts: [],
        days: [],
        merchants: new Set(),
        contexts: new Set(),
        monthCoverage: 0,
        averageAmount: 0,
        amountCV: null,
        averageDayOfMonth: null,
        categoryId: null,
        semanticTokens: new Set(),
    };
}

function finalizeProfile(profile) {
    profile.monthCount = profile.months.size;
    profile.monthCoverage = profile.monthCount / 12;
    profile.averageAmount = average(profile.amounts);
    profile.amountCV = coefficientOfVariation(profile.amounts);
    profile.averageDayOfMonth = average(profile.days);
    profile.categoryId = getDominantKey(profile.categories);
    profile.semanticTokens = getSemanticTokens([
        ...profile.merchants,
        ...profile.contexts,
    ].join(" "));
}

function evaluateRelationship(left, right) {
    const evidence = {
        category: sameValue(left.categoryId, right.categoryId),
        direction: sameValue(left.direction, right.direction),
        amount: amountCompatibility(left.averageAmount, right.averageAmount),
        dayOfMonth: dayCompatibility(left, right),
        semantic: semanticCompatibility(left.semanticTokens, right.semanticTokens),
        similarity: monthSimilarity(left.months, right.months),
        complementarity: monthComplementarity(left.months, right.months),
    };

    // Hard vetoes: these relationships cannot represent the same financial
    // phenomenon regardless of temporal similarity.
    if (evidence.category === false || evidence.direction === false) {
        return reject(evidence);
    }

    if (evidence.amount === "mismatch") {
        return reject(evidence);
    }

    const strongSemantic = evidence.semantic === "strong";
    const temporalMatch = evidence.similarity >= 0.5;
    const temporalComplement = evidence.complementarity >= 0.5;
    const strongTemporal = evidence.complementarity >= 0.75;
    const calendarMatch = evidence.dayOfMonth >= 0.75;

    // Automatic grouping requires independent evidence. Pure numerical or
    // temporal coincidence is intentionally insufficient.
    if (
        strongSemantic &&
        (temporalMatch || temporalComplement) &&
        (calendarMatch || evidence.amount === "close")
    ) {
        return accept(
            temporalComplement ? "complementarity" : "similarity",
            0.98,
            evidence,
        );
    }

    if (
        strongTemporal &&
        evidence.amount === "close" &&
        calendarMatch &&
        strongSemantic
    ) {
        return accept("complementarity", 0.99, evidence);
    }

    // Review covers plausible relationships that require confirmation or a
    // future semantic model (e.g. Discovery/Dplay or other renamed merchants).
    const independentSignals = [
        evidence.amount === "close",
        temporalMatch,
        temporalComplement,
        calendarMatch,
        evidence.semantic !== "none",
    ].filter(Boolean).length;

    if (independentSignals >= 3) {
        return review(
            temporalComplement ? "complementarity" : "similarity",
            calculateReviewConfidence(evidence),
            evidence,
        );
    }

    return reject(evidence);
}

function accept(relationship, confidence, evidence) {
    return {
        decision: "AUTO_MATCH",
        relationship,
        confidence,
        evidence,
    };
}

function review(relationship, confidence, evidence) {
    return {
        decision: "REVIEW",
        relationship,
        confidence,
        evidence,
    };
}

function reject(evidence) {
    return {
        decision: "REJECT",
        relationship: "none",
        confidence: 0,
        evidence,
    };
}

function amountCompatibility(left, right) {
    if (!Number.isFinite(left) || !Number.isFinite(right) || left <= 0 || right <= 0) {
        return "unknown";
    }

    const ratio = Math.min(left, right) / Math.max(left, right);
    if (ratio < 0.9) return "mismatch";
    if (ratio >= 0.97) return "close";
    return "compatible";
}

function dayCompatibility(left, right) {
    if (!Number.isFinite(left.averageDayOfMonth) || !Number.isFinite(right.averageDayOfMonth)) {
        return 0;
    }

    const difference = Math.abs(left.averageDayOfMonth - right.averageDayOfMonth);
    return Math.max(0, 1 - difference / 4);
}

function semanticCompatibility(leftTokens, rightTokens) {
    if (!leftTokens.size || !rightTokens.size) return "none";

    const strongLeft = [...leftTokens].filter(isStrongSemanticToken);
    const strongRight = [...rightTokens].filter(isStrongSemanticToken);
    const sharedStrong = strongLeft.filter(token => strongRight.includes(token));

    if (sharedStrong.length > 0) return "strong";

    const shared = [...leftTokens].filter(token => rightTokens.has(token));
    if (shared.length > 0) return "contextual";

    return "none";
}

function getSemanticTokens(value) {
    return new Set(
        String(value ?? "")
            .toLowerCase()
            .split(/[^a-z0-9]+/)
            .filter(token => token.length >= 4 && !GENERIC_SEMANTIC_TOKENS.has(token)),
    );
}

function isStrongSemanticToken(token) {
    return STRONG_SEMANTIC_TOKENS.has(token);
}

function monthSimilarity(leftMonths, rightMonths) {
    const union = new Set([...leftMonths, ...rightMonths]);
    if (!union.size) return 0;

    const intersection = [...leftMonths].filter(month => rightMonths.has(month)).length;
    return intersection / union.size;
}

function monthComplementarity(leftMonths, rightMonths) {
    if (!leftMonths.size || !rightMonths.size) return 0;

    const overlap = [...leftMonths].filter(month => rightMonths.has(month)).length;
    if (overlap > 0) return 0;

    const smaller = Math.min(leftMonths.size, rightMonths.size);
    const larger = Math.max(leftMonths.size, rightMonths.size);
    return smaller / larger;
}

function coefficientOfVariation(values) {
    if (values.length < 2) return 0;

    const mean = average(values);
    if (!mean) return 0;

    const variance = values.reduce(
        (sum, value) => sum + ((value - mean) ** 2),
        0,
    ) / values.length;

    return Math.sqrt(variance) / mean;
}

function average(values) {
    if (!values.length) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getDominantKey(map) {
    let dominantKey = null;
    let dominantCount = -1;

    map.forEach((count, key) => {
        if (count > dominantCount) {
            dominantKey = key;
            dominantCount = count;
        }
    });

    return dominantKey;
}

function sameValue(left, right) {
    if (left === null || right === null || left === undefined || right === undefined) {
        return null;
    }

    return left === right;
}

function calculateReviewConfidence(evidence) {
    let score = 0.5;
    if (evidence.amount === "close") score += 0.15;
    else if (evidence.amount === "compatible") score += 0.1;
    if (evidence.similarity >= 0.5) score += 0.1;
    if (evidence.complementarity >= 0.5) score += 0.1;
    if (evidence.dayOfMonth >= 0.75) score += 0.1;
    if (evidence.semantic === "contextual") score += 0.05;

    return Math.min(score, 0.95);
}

const STRONG_SEMANTIC_TOKENS = new Set([
    "mutuo",
    "rata",
    "cucina",
    "stipendio",
    "rimborso",
    "prime",
    "chatgpt",
    "openai",
    "discovery",
    "dplay",
    "crunchyroll",
]);

const GENERIC_SEMANTIC_TOKENS = new Set([
    "casa",
    "cena",
    "pranzo",
    "regalo",
    "pieno",
    "auto",
    "via",
    "presso",
    "com",
    "bank",
    "capital",
    "hotel",
    "store",
    "superstore",
]);

export default buildBehavioralGroups;
