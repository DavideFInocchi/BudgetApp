import AppButton from "../../components/ui/AppButton";
import AppSearch from "../../components/ui/AppSearch";
import AppSelect from "../../components/ui/AppSelect";
import AppInput from "../../components/ui/AppInput";

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

    onAdd

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

        <div className="row g-3 align-items-end mb-4">

            <div className="col-lg-3">

                <AppSearch
                    value={search}
                    onChange={setSearch}
                    placeholder="Cerca movimento..."
                />

            </div>

            <div className="col-lg-2">

                <AppSelect
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    options={categoryOptions}
                />

            </div>

            <div className="col-lg-2">

                <AppSelect
                    value={type}
                    onChange={e => setType(e.target.value)}
                    options={typeOptions}
                />

            </div>

            <div className="col-lg-2">

                <AppInput
                    type="date"
                    value={fromDate}
                    onChange={e => setFromDate(e.target.value)}
                />

            </div>

            <div className="col-lg-2">

                <AppInput
                    type="date"
                    value={toDate}
                    onChange={e => setToDate(e.target.value)}
                />

            </div>

            <div className="col-lg-1 d-grid">

                <AppButton
                    icon="bi-plus-lg"
                    onClick={onAdd}
                >
                    Nuovo
                </AppButton>

            </div>

        </div>

    );

}