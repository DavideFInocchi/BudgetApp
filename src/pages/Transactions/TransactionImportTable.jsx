import AppSelect from "../../components/ui/AppSelect";
import { BALANCE_TYPES } from "../../constants/balanceTypes";
import AppTextarea from "../../components/ui/AppTextarea";
import AppCheckbox from "../../components/ui/AppCheckbox";
import { Fragment } from "react";

export default function TransactionImportTable({

    transactions = [],
    categories = [],
    manualDuplicates = [],
    duplicateFingerprints = new Set(),
    onCategoryChange,
    onDescriptionChange,
    onBalanceTypeChange,
    onIncludedChange

}) {

    const getManualDuplicate = (transaction) => {

        return manualDuplicates.find(item => {

            const candidate = item.transaction;

            return (
                candidate.transaction_date === transaction.transaction_date &&
                Number(candidate.amount) === Number(transaction.amount) &&
                candidate.transaction_type === transaction.transaction_type
            );

        });

    };

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

                        const manualDuplicate =
                            getManualDuplicate(transaction);

                        const isManualDuplicate =
                            Boolean(manualDuplicate);

                        return (

                            <Fragment key={`${transaction.transaction_date}-${index}`}>

                                <tr
                                        className={
                                            isDuplicate
                                                ? "transaction-import-row--duplicate"
                                                : isManualDuplicate
                                                    ? "transaction-import-row--possible-duplicate"
                                                    : ""
                                        }
                                >
                                <td>
                                    {transaction.transaction_date}
                                </td>

                                <td style={{ minWidth: 350 }}>

                                    <AppTextarea
                                        rows={2}
                                        value={
                                            transaction.description ?? ""
                                        }
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

                                    <div>
                                        {transaction.accounting_status}
                                    </div>

                                </td>

                                <td>
                                    {transaction.bank_category || "-"}
                                </td>

                                <td>

                                    <AppSelect
                                        value={
                                            transaction.category_id ?? ""
                                        }

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
                                        value={
                                            transaction.balance_type ??
                                            "Ordinario"
                                        }

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
                                                    : transaction.included ??
                                                      false
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

                                        {isManualDuplicate && (

                                            <span className="transaction-import__possible-duplicate-badge">
                                                Possibile duplicato
                                            </span>

                                        )}
                                        

                                    </div>

                                </td>
                            
                            </tr>
                            {isManualDuplicate && (
                                <tr className="transaction-import-manual-match-row">
                                    <td colSpan="8">
                                        <div className="transaction-import__manual-match">
                                            Movimento già presente:
                                            {" "}
                                            {manualDuplicate.matches[0]?.transaction_date}
                                            {" · "}
                                            {manualDuplicate.matches[0]?.amount} €
                                            {" · "}
                                            {manualDuplicate.matches[0]?.description}
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </Fragment>
                        );

                    })}

                </tbody>

            </table>

        </div>

    );

}