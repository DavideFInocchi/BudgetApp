
import "dotenv/config";
import fs from "fs/promises";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {

    console.log("================================");
    console.log("IMPORT BUDGETS");
    console.log("================================");

    // Legge il JSON
    const file = await fs.readFile(
        "src/script/data/finance.json",
        "utf8"
    );

    const json = JSON.parse(file);

    const budgets = json.budgets;

    console.log(`Budget trovati: ${budgets.length}`);

    // Recupera le categorie
    const { data: categories, error } = await supabase
        .from("categories")
        .select("id, name");

    if (error)
        throw error;

    // Crea la mappa Nome -> ID
    const categoryMap = new Map();

    categories.forEach(category => {

        categoryMap.set(category.name, category.id);

    });

    // Converte i budget
    const rows = budgets.map(budget => ({

        legacy_id: budget.id,

        month: `${budget.m}-01`,

        transaction_type: budget.n,

        balance_type: budget.t,

        amount: budget.imp,

        category_id: categoryMap.get(budget.c),

    }));

    // Controlla categorie mancanti
    const missing = rows.filter(row => !row.category_id);

    if (missing.length > 0) {

        console.error("");

        console.error("Categorie mancanti:");

        console.table(missing);

        return;

    }

    // Inserimento
    const { error: insertError } = await supabase
        .from("budgets")
        .insert(rows);

    if (insertError)
        throw insertError;

    console.log("");

    console.log("Import completato.");

    console.log(`${rows.length} budget inseriti.`);

}

main().catch(error => {

    console.error("");

    console.error(error);

});