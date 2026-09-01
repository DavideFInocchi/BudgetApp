import { supabase } from "./supabase";

const BACKUP_VERSION = 1;
const BACKUP_TABLES = [
    "categories",
    "transactions",
    "budgets",
    "transaction_templates",
    "extra_months",
    "settings",
];

function downloadJson(filename, payload) {
    const blob = new Blob(
        [JSON.stringify(payload, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
}

async function readTable(table) {
    const { data, error } = await supabase
        .from(table)
        .select("*");

    if (error) {
        throw new Error(`Errore lettura ${table}: ${error.message}`);
    }

    return data ?? [];
}

export async function createBackup() {
    const entries = await Promise.all(
        BACKUP_TABLES.map(async (table) => [table, await readTable(table)])
    );

    const backup = {
        app: "BudgetApp",
        version: BACKUP_VERSION,
        createdAt: new Date().toISOString(),
        data: Object.fromEntries(entries),
    };

    const date = new Date().toISOString().slice(0, 10);
    downloadJson(`budgetapp-backup-${date}.json`, backup);

    return backup;
}

export function validateBackup(backup) {
    if (!backup || typeof backup !== "object" || Array.isArray(backup)) {
        throw new Error("Il file selezionato non contiene un backup valido.");
    }

    if (backup.app !== "BudgetApp") {
        throw new Error("Il file non è un backup di BudgetApp.");
    }

    if (backup.version !== BACKUP_VERSION) {
        throw new Error(`Versione backup non supportata: ${backup.version}.`);
    }

    if (!backup.data || typeof backup.data !== "object" || Array.isArray(backup.data)) {
        throw new Error("Il backup non contiene una sezione dati valida.");
    }

    for (const table of BACKUP_TABLES) {
        if (!Array.isArray(backup.data[table])) {
            throw new Error(`Il backup non contiene dati validi per ${table}.`);
        }
    }

    return true;
}

export async function restoreBackup(backup) {
    validateBackup(backup);

    const { error } = await supabase.rpc("restore_budgetapp_backup", {
        backup,
    });

    if (error) {
        throw new Error(`Ripristino non riuscito: ${error.message}`);
    }
}

export async function parseBackupFile(file) {
    if (!file || file.type !== "application/json" && !file.name.toLowerCase().endsWith(".json")) {
        throw new Error("Seleziona un file JSON di backup.");
    }

    let backup;

    try {
        backup = JSON.parse(await file.text());
    } catch {
        throw new Error("Il file selezionato non contiene JSON valido.");
    }

    validateBackup(backup);
    return backup;
}

export const BACKUP_TABLE_NAMES = BACKUP_TABLES;
