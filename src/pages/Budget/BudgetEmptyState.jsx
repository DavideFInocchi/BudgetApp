import AppEmptyState from "../../components/ui/AppEmptyState";
import AppButton from "../../components/ui/AppButton";

export default function BudgetEmptyState({

    onCopy,

    onCreate

}) {

    return (

        <div className="py-4">

            <AppEmptyState

                title="Nessun budget"

                description="Non esiste ancora un budget per il periodo selezionato."

            />

            <div className="d-flex justify-content-center gap-3 mt-4">

                <AppButton

                    variant="primary"

                    onClick={onCopy}

                >

                    Copia mese precedente

                </AppButton>

                <AppButton

                    variant="secondary"

                    onClick={onCreate}

                >

                    Crea da zero

                </AppButton>

            </div>

        </div>

    );

}