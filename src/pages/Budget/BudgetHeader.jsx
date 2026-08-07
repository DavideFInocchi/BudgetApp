import PeriodSelector from "../../components/PeriodSelector";

export default function BudgetHeader({

    period,
    periods,
    onPeriodChange

}) {

    return (

        <div className="d-flex justify-content-between align-items-center mb-4">

            <div>

                <h2 className="mb-1">

                    Budget

                </h2>

                <p className="text-muted mb-0">

                    Configura il budget del mese.

                </p>

            </div>

            <PeriodSelector

                value={period}

                periods={periods}

                onChange={onPeriodChange}

            />

        </div>

    );

}