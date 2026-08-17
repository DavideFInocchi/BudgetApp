export async function createTransactionFingerprint(transaction) {

    const raw = [
        transaction.transaction_date ?? "",
        Number(transaction.amount ?? 0).toFixed(2),
        transaction.source_operation ?? "",
        transaction.source_details ?? ""
    ]
        .map(value =>
            String(value)
                .trim()
                .toLowerCase()
                .replace(/\s+/g, " ")
        )
        .join("|");

    const encoded =
        new TextEncoder().encode(raw);

    const hashBuffer =
        await window.crypto.subtle.digest(
            "SHA-256",
            encoded
        );

    const hashArray =
        Array.from(new Uint8Array(hashBuffer));

    const hash =
        hashArray
            .map(byte =>
                byte.toString(16).padStart(2, "0")
            )
            .join("");

    return hash;
}