import normalizeMerchant from "./merchantNormalizer";
import normalizeMerchantContext from "./merchantContextNormalizer";

/**
 * Raggruppa merchant storicamente simili senza modificare la descrizione originale.
 *
 * Il clustering e' volutamente conservativo:
 * - la categoria deve essere compatibile quando entrambe sono disponibili;
 * - la similarita' testuale da sola non basta per i nomi corti o generici;
 * - il confronto usa una seconda normalizzazione per rimuovere il boilerplate bancario;
 * - ogni cluster conserva un confidence score e il merchant rappresentativo.
 */
export function buildMerchantClusters(transactions = []) {
    const rows = Array.isArray(transactions) ? transactions : [];
    const merchants = buildMerchantProfiles(rows);
    const parent = new Map(merchants.map(profile => [profile.merchant, profile.merchant]));

    for (let i = 0; i < merchants.length; i += 1) {
        for (let j = i + 1; j < merchants.length; j += 1) {
            const left = merchants[i];
            const right = merchants[j];
            const confidence = getClusterConfidence(left, right);

            if (confidence >= 0.9) {
                union(parent, left.merchant, right.merchant, merchants);
            }
        }
    }

    const clusterProfiles = new Map();

    merchants.forEach(profile => {
        const root = find(parent, profile.merchant);
        const cluster = clusterProfiles.get(root) ?? {
            merchant: null,
            merchants: [],
            confidence: 1,
        };

        cluster.merchants.push(profile);
        cluster.merchant = selectRepresentative(cluster.merchant, profile.merchant, merchants);
        clusterProfiles.set(root, cluster);
    });

    const result = new Map();

    clusterProfiles.forEach(cluster => {
        const representative = cluster.merchant;
        const clusterConfidence = calculateClusterConfidence(cluster.merchants, representative);

        cluster.merchants.forEach(profile => {
            result.set(profile.merchant, {
                clusterId: representative,
                clusterConfidence,
                clusterMerchants: cluster.merchants.map(item => item.merchant),
            });
        });
    });

    return result;
}

export function getMerchantCluster(merchantClusters, merchant) {
    if (!(merchantClusters instanceof Map)) {
        return {
            clusterId: merchant,
            clusterConfidence: 0,
            clusterMerchants: merchant ? [merchant] : [],
        };
    }

    return merchantClusters.get(merchant) ?? {
        clusterId: merchant,
        clusterConfidence: 0,
        clusterMerchants: merchant ? [merchant] : [],
    };
}

function buildMerchantProfiles(transactions) {
    const profiles = new Map();

    transactions.forEach(transaction => {
        const merchant = normalizeMerchant(transaction.description);
        if (!merchant) return;

        const current = profiles.get(merchant) ?? {
            merchant,
            contextMerchant: normalizeMerchantContext(merchant),
            categoryIds: new Set(),
            occurrenceCount: 0,
        };

        current.occurrenceCount += 1;
        if (transaction.category_id !== null && transaction.category_id !== undefined) {
            current.categoryIds.add(transaction.category_id);
        }

        profiles.set(merchant, current);
    });

    return Array.from(profiles.values());
}

function getClusterConfidence(left, right) {
    if (!areCategoriesCompatible(left, right)) return 0;
    if (left.merchant === right.merchant) return 1;

    const leftValue = left.contextMerchant || left.merchant;
    const rightValue = right.contextMerchant || right.merchant;
    if (leftValue === rightValue) return 0.97;

    const leftTokens = tokenize(leftValue);
    const rightTokens = tokenize(rightValue);
    const leftCoreTokens = getCoreTokens(leftTokens);
    const rightCoreTokens = getCoreTokens(rightTokens);

    if (haveSameCoreTokens(leftCoreTokens, rightCoreTokens)) {
        return 0.96;
    }

    if (hasGenericShortName(leftCoreTokens) || hasGenericShortName(rightCoreTokens)) {
        return 0;
    }

    const editSimilarity = normalizedLevenshtein(leftValue, rightValue);
    const tokenSimilarity = tokenSimilarityScore(leftCoreTokens, rightCoreTokens);
    const prefixSimilarity = prefixScore(leftValue, rightValue);

    return Math.max(
        editSimilarity * 0.65 + tokenSimilarity * 0.35,
        prefixSimilarity * 0.75 + tokenSimilarity * 0.25,
    );
}

function areCategoriesCompatible(left, right) {
    if (!left.categoryIds.size || !right.categoryIds.size) return true;

    for (const categoryId of left.categoryIds) {
        if (right.categoryIds.has(categoryId)) return true;
    }

    return false;
}

function tokenize(value) {
    return value.split(/\s+/).filter(Boolean);
}

function getCoreTokens(tokens) {
    return tokens.filter(token => !ACCESSORY_TOKENS.has(token));
}

function haveSameCoreTokens(leftTokens, rightTokens) {
    if (!leftTokens.length || !rightTokens.length) return false;

    const leftSet = new Set(leftTokens);
    const rightSet = new Set(rightTokens);

    if (leftSet.size !== rightSet.size) return false;

    return [...leftSet].every(token => rightSet.has(token));
}

function hasGenericShortName(tokens) {
    if (tokens.length !== 1) return false;

    const token = tokens[0];
    return token.length <= 3 || [
        "bar",
        "md",
        "spa",
        "via",
        "casa",
        "auto",
        "coop",
    ].includes(token);
}

function tokenSimilarityScore(leftTokens, rightTokens) {
    if (!leftTokens.length || !rightTokens.length) return 0;

    const matched = leftTokens.filter(leftToken =>
        rightTokens.some(rightToken => normalizedLevenshtein(leftToken, rightToken) >= 0.85),
    ).length;

    return matched / Math.max(leftTokens.length, rightTokens.length);
}

function prefixScore(left, right) {
    const shorter = left.length <= right.length ? left : right;
    const longer = left.length > right.length ? left : right;

    if (shorter.length < 4 || !longer.startsWith(`${shorter} `)) return 0;

    return shorter.length / longer.length;
}

function normalizedLevenshtein(left, right) {
    if (left === right) return 1;
    if (!left.length || !right.length) return 0;

    const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

    for (let i = 1; i <= left.length; i += 1) {
        let previousDiagonal = previous[0];
        previous[0] = i;

        for (let j = 1; j <= right.length; j += 1) {
            const current = previous[j];
            const cost = left[i - 1] === right[j - 1] ? 0 : 1;

            previous[j] = Math.min(
                previous[j] + 1,
                previous[j - 1] + 1,
                previousDiagonal + cost,
            );

            previousDiagonal = current;
        }
    }

    return 1 - previous[right.length] / Math.max(left.length, right.length);
}

function union(parent, left, right, profiles) {
    const leftRoot = find(parent, left);
    const rightRoot = find(parent, right);

    if (leftRoot === rightRoot) return;

    const leftProfile = profiles.find(profile => profile.merchant === leftRoot);
    const rightProfile = profiles.find(profile => profile.merchant === rightRoot);
    const leftCount = leftProfile?.occurrenceCount ?? 0;
    const rightCount = rightProfile?.occurrenceCount ?? 0;

    if (leftCount >= rightCount) {
        parent.set(rightRoot, leftRoot);
    } else {
        parent.set(leftRoot, rightRoot);
    }
}

function find(parent, merchant) {
    let root = merchant;

    while (parent.get(root) !== root) {
        root = parent.get(root);
    }

    let current = merchant;
    while (parent.get(current) !== current) {
        const next = parent.get(current);
        parent.set(current, root);
        current = next;
    }

    return root;
}

function selectRepresentative(current, candidate, profiles) {
    if (!current) return candidate;

    const currentProfile = profiles.find(profile => profile.merchant === current);
    const candidateProfile = profiles.find(profile => profile.merchant === candidate);

    if ((candidateProfile?.occurrenceCount ?? 0) > (currentProfile?.occurrenceCount ?? 0)) {
        return candidate;
    }

    return current;
}

function calculateClusterConfidence(profiles, representative) {
    if (profiles.length <= 1) return 1;

    const representativeProfile = profiles.find(item => item.merchant === representative);
    if (!representativeProfile) return 0;

    const scores = profiles
        .filter(profile => profile.merchant !== representative)
        .map(profile => getClusterConfidence(profile, representativeProfile));

    return scores.length
        ? scores.reduce((sum, score) => sum + score, 0) / scores.length
        : 1;
}

const ACCESSORY_TOKENS = new Set([
    "spa",
    "srl",
    "srls",
    "snc",
    "sas",
    "sapa",
    "ltd",
    "llc",
    "inc",
    "corp",
    "store",
    "outlet",
    "superstore",
    "via",
    "viale",
    "piazza",
    "strada",
    "corso",
    "pescara",
    "montesilvano",
    "montesil",
    "silvi",
    "pescasseroli",
    "atri",
    "pineto",
    "citta",
    "sant",
    "angelo",
]);

export default buildMerchantClusters;
