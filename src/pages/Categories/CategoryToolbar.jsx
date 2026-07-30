import AppButton from "../../components/ui/AppButton";
import AppSearch from "../../components/ui/AppSearch";

export default function CategoryToolbar({

    search,
    setSearch,
    onAdd

})  {

    return (

        <>

            <div className="d-flex justify-content-between align-items-center mb-3">

                <h2 className="mb-0">

                    Categorie

                </h2>

                <AppButton onClick={onAdd}>

                    <i className="bi bi-plus-lg me-2"></i>

                    Nuova categoria

                </AppButton>

            </div>

            <AppSearch
                value={search}
                onChange={setSearch}
                placeholder="Cerca categoria..."
            />

        </>

    );

}