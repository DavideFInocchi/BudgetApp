import { z } from "zod";

export const transactionSchema = z.object({

    transaction_date: z.string().min(1, "Inserisci la data"),

    description: z
        .string()
        .trim()
        .min(3, "La descrizione è troppo corta")
        .max(200),

    amount: z.coerce
        .number({
            invalid_type_error: "Importo non valido",
        }),

    category: z
        .string()
        .min(1, "Categoria obbligatoria"),

    type: z.enum([
        "Entrata",
        "Uscita",
    ]),

    balance_type: z.enum([
        "Ordinario",
        "Straordinario",
    ]),

});