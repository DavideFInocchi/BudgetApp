import AppButton from "../../components/ui/AppButton";
import AppSearch from "../../components/ui/AppSearch";
import AppSelect from "../../components/ui/AppSelect";
import AppInput from "../../components/ui/AppInput";
import TransactionImport from "./TransactionImport";

export default function TransactionToolbar({

    search,
    setSearch,

    category,
    setCategory,
    categories = [],

    type,
    setType,

    fromDate,
    setFromDate,

    toDate,
    setToDate,

    onAdd,
    onImport

}) {

    const categoryOptions = [
        { value: "", label: "Tutte le categorie" },
        ...categories.map(category => ({
            value: category.id,
            label: category.name
        }))
    ];

    const typeOptions = [
        { value: "", label: "Tutti i tipi" },
        { value: "Entrata", label: "Entrata" },
        { value: "Uscita", label: "Uscita" }
    ];

    return (

    <div className="transaction-toolbar mb-4">

        <div className="transaction-toolbar__search">
            <AppSearch
                value={search}
                onChange={setSearch}
                placeholder="Cerca movimento..."
            />
        </div>

        <div className="transaction-toolbar__category">
            <AppSelect
                value={category}
                onChange={e => setCategory(e.target.value)}
                options={categoryOptions}
            />
        </div>

        <div className="transaction-toolbar__type">
            <AppSelect
                value={type}
                onChange={e => setType(e.target.value)}
                options={typeOptions}
            />
        </div>

        <div className="transaction-toolbar__date transaction-toolbar__from">
            <AppInput
                type="date"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
            />
        </div>

        <div className="transaction-toolbar__date transaction-toolbar__to">
            <AppInput
                type="date"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
            />
        </div>

        <div className="transaction-toolbar__actions">

            <TransactionImport
                onFileSelected={onImport}
            />

            <AppButton
                icon="plus-lg"
                onClick={onAdd}
            >
                Nuovo
            </AppButton>

        </div>

    </div>

);

}