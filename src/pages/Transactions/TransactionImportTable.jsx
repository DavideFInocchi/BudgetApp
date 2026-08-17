import AppSelect from "../../components/ui/AppSelect";
import { BALANCE_TYPES } from "../../constants/balanceTypes";
import AppTextarea from "../../components/ui/AppTextarea";
import AppCheckbox from "../../components/ui/AppCheckbox";

export default function TransactionImportTable({

    transactions = [],
    categories = [],
    duplicateFingerprints = [],
    onCategoryChange,
    onDescriptionChange,
    onBalanceTypeChange,
    onIncludedChange

}) {
console.log("IMPORT TABLE", transactions);
    return (

        <div className="table-responsive">

            <table className="table table-sm align-middle transaction-import-table">

                <thead>

                    <tr>
                        <th>Data</th>
                        <th>Descrizione</th>
                        <th>Importo</th>
                        <th>Stato</th>
                        <th>Categoria banca</th>
                        <th>Categoria</th>
                        <th>Saldo</th>
                        <th>Importa</th>
                    </tr>

                </thead>

                <tbody>
                        {transactions.map((transaction, index) => {

                            const isDuplicate =
                                duplicateFingerprints.has(
                                    transaction.source_fingerprint
                                );

                            return (
                                <tr
                                    key={`${transaction.transaction_date}-${index}`}
                                    className={
                                        isDuplicate
                                            ? "transaction-import-row transaction-import-row--duplicate"
                                            : "transaction-import-row"
                                    }
                                >

                                    <td>
                                        {transaction.transaction_date}
                                    </td>
                                    <td style={{ minWidth: 350 }}>

                                        <AppTextarea

                                            rows={2}

                                            value={transaction.description ?? ""}

                                            className="mb-0"

                                            onChange={(event) => {

                                                onDescriptionChange?.(
                                                    index,
                                                    event.target.value
                                                );

                                            }}

                                        />

                                    </td>

                                    <td className="text-end">
                                        {transaction.amount}
                                    </td>

                                    <td>
                                        {transaction.accounting_status}
                                    </td>
                                    <td>
                                        {transaction.bank_category || "-"}
                                    </td>

                                    <td>
                                        <AppSelect
                                            value={transaction.category_id ?? ""}
                                            options={[
                                                {
                                                    value: "",
                                                    label: "Seleziona categoria"
                                                },
                                                ...categories.map(category => ({
                                                    value: category.id,
                                                    label: category.name
                                                }))
                                            ]}
                                            onChange={(event) => {
                                                onCategoryChange(
                                                    index,
                                                    event.target.value
                                                );
                                            }}
                                        />
                                    </td>

                                    <td>
                                        <AppSelect
                                            value={transaction.balance_type ?? "Ordinario"}
                                            options={BALANCE_TYPES}
                                            onChange={(event) => {
                                                onBalanceTypeChange?.(
                                                    index,
                                                    event.target.value
                                                );
                                            }}
                                        />
                                    </td>

                                    <td>
                                        <div className="d-flex align-items-center gap-2">

                                            <AppCheckbox
                                                checked={
                                                    isDuplicate
                                                        ? false
                                                        : transaction.included ?? false
                                                }
                                                disabled={isDuplicate}
                                                onChange={(event) => {
                                                    if (!isDuplicate) {
                                                        onIncludedChange?.(
                                                            index,
                                                            event.target.checked
                                                        );
                                                    }
                                                }}
                                            />

                                            {isDuplicate && (
                                                <span className="transaction-import__duplicate-badge">
                                                    Importata
                                                </span>
                                            )}

                                        </div>
                                    </td>        
                                </tr>
                            );

                        })}
                </tbody>

            </table>

        </div>

    );

}