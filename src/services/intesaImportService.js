import * as XLSX from "xlsx";
import { formatSqlDate } from "../utils/dateUtils.js";


export function parseIntesaExcel(file) {

    const workbook = XLSX.read(file, {
        type: "array",
        cellDates: true
    });

    const sheet =
        workbook.Sheets[workbook.SheetNames[0]];

    const range = XLSX.utils.decode_range(sheet["!ref"]);

    range.s.r = 0;

    range.e.r = Math.max(
        range.e.r,
        ...Object.keys(sheet)
            .filter(key => /^[A-Z]+\d+$/.test(key))
            .map(key =>
                XLSX.utils.decode_cell(key).r
            )
    );

    sheet["!ref"] =
        XLSX.utils.encode_range(range);

    const rows = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: null,
        raw: true
    });

    const headerIndex = rows.findIndex(row =>
        row?.[0] === "Data" &&
        row?.[1] === "Operazione" &&
        row?.[7] === "Importo"
    );

    if (headerIndex === -1) {
        throw new Error(
            "Formato file Intesa non riconosciuto."
        );
    }

    const headers = rows[headerIndex];

    const dataRows = rows.slice(headerIndex + 1);

    return dataRows
        .filter(row => row?.some(value => value !== null && value !== ""))
        .map(row => {

            const record = {};

            headers.forEach((header, index) => {

                if (header)
                    record[header] = row[index];

            });

            return {

                transaction_date: record["Data"]
                    ? formatSqlDate(record["Data"])
                    : null,

                description: record["Operazione"] ?? "",

                details: record["Dettagli"] ?? "",

                accounting_status:
                    record["Contabilizzazione"] ?? "",

                bank_category:
                    record["Categoria "] ??
                    record["Categoria"] ??
                    "",

                currency:
                    record["Valuta"] ?? "",

                amount:
                    Number(record["Importo"] ?? 0)

            };

        });

}

export function toTransactionRecord(transaction) {

    const amount = Number(transaction.amount);

    const description = [
        transaction.description,
        transaction.details
    ]
        .filter(Boolean)
        .join(" - ");

    return {

        transaction_date: transaction.transaction_date,

        description,

        transaction_type:
            amount >= 0
                ? "Entrata"
                : "Uscita",

        amount,

        balance_type: "Ordinario",

        category_id:
            transaction.category_id || null,

        accounting_status:
            transaction.accounting_status,

        bank_category:
            transaction.bank_category,

        included:
            transaction.accounting_status === "CONTABILIZZATO"

    };

}