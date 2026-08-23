export default function BudgetCalibrationSummary({
    calibration
}) {

    if (!calibration)
        return null;

    const {
        analysisPeriod,
        capacity,
        categories = []
    } = calibration;




    const prudentialMargin =
        Math.max(
            capacity?.ordinaryMarginMedian ?? 0,
            0
        );

    const requestedIncrease =
        calibration
            ?.increaseAllocation
            ?.requestedTotal ?? 0;

    const increaseAllocation =
        calibration.increaseAllocation ?? {};

    const requestedTotal =
        increaseAllocation.requestedTotal ?? 0;

    const allocatedTotal =
        increaseAllocation.allocatedTotal ?? 0;

    const remainingMargin =
        increaseAllocation.remainingMargin ?? 0;

    const uncoveredAmount =
        increaseAllocation.uncoveredAmount ?? 0;

    const allocationStatus =
        increaseAllocation.allocationStatus ??
        (
            uncoveredAmount > 0
                ? "insufficient"
                : "sustainable"
        );

    const increaseCandidates =
        calibration.increaseCandidates ?? [];

    const decreaseCount =
        categories.filter(
            category =>
                category.recommendation?.type ===
                "decrease"
        ).length;

    const highVolatilityCategories =
        categories.filter(
            category =>
                category.recommendation?.type ===
                    "maintain" &&
                category.recommendation?.reason ===
                    "high_volatility"
        );

    const increaseCount =
        increaseCandidates.length;

    const formatAmount = value =>
        new Intl.NumberFormat(
            "it-IT",
            {
                style: "currency",
                currency: "EUR"
            }
        ).format(
            Number(value) || 0
        );

    const formatPeriod = period => {

        if (!period)
            return "";

        const date =
            new Date(
                `${period}T00:00:00`
            );

        return date.toLocaleDateString(
            "it-IT",
            {
                month: "short",
                year: "numeric"
            }
        );

    };

    return (

        <div className="row g-3">

            <div className="col-12 col-md-6 col-xl-3">

                <div className="small text-muted">
                    Periodo analizzato
                </div>

                <div className="fw-semibold">

                    {formatPeriod(
                        analysisPeriod?.from
                    )}

                    {" → "}

                    {formatPeriod(
                        analysisPeriod?.to
                    )}

                </div>

            </div>


            <div className="col-12 col-md-6 col-xl-3">

                <div className="small text-muted">
                    Entrate ordinarie mediane
                </div>

                <div className="fw-semibold">
                    {formatAmount(
                        capacity?.ordinaryIncomeMedian
                    )}
                </div>

            </div>


            <div className="col-12 col-md-6 col-xl-3">

                <div className="small text-muted">
                    Margine prudenziale
                </div>

                <div className="fw-semibold">
                    {formatAmount(
                        prudentialMargin
                    )}
                </div>

            </div>


            <div className="col-12 col-md-6 col-xl-3">

                <div className="small text-muted">
                    Budget mediano
                </div>

                <div className="fw-semibold">
                    {formatAmount(
                        capacity?.budgetMedian
                    )}
                </div>

            </div>
            <div className="col-12 col-md-6 col-xl-3">

                <div className="small text-muted">
                    Scostamento mediano spese
                </div>

                <div
                    className={
                        (capacity?.medianOrdinaryExpenseBudgetDeviation ?? 0) > 0
                            ? "fw-semibold text-danger"
                            : "fw-semibold text-success"
                    }
                >
                    {formatAmount(
                        capacity?.medianOrdinaryExpenseBudgetDeviation
                    )}
                </div>

            </div>

            <div className="col-12">

                <hr />

            </div>


            <div className="col-12 col-md-4">

                <div className="small text-muted">
                    Categorie da aumentare
                </div>

                <div className="fw-semibold">
                    {increaseCount}
                </div>

            </div>


            <div className="col-12 col-md-4">

                <div className="small text-muted">
                    Categorie da ridurre
                </div>

                <div className="fw-semibold">
                    {decreaseCount}
                </div>

            </div>

            <div className="col-12 col-md-4">

                <div className="small text-muted">
                    Mantenute per alta variabilità
                </div>

                <div className="fw-semibold">
                    {highVolatilityCategories.length}
                </div>

                {highVolatilityCategories.length > 0 && (

                    <div className="small text-muted mt-1">

                        {highVolatilityCategories
                            .map(
                                category =>
                                    category.categoryName
                            )
                            .join(", ")}

                    </div>

                )}

            </div>  
            <div className="mt-3">

                {allocationStatus === "sustainable" ? (

                <div className="alert alert-success mb-0">

                    <strong>
                        Situazione sostenibile.
                    </strong>{" "}

                    Le categorie che richiedono un aumento
                    necessitano complessivamente{" "}
                    {formatAmount(requestedTotal)}.

                    Il margine prudenziale consente di coprire
                    interamente l'adeguamento.

                    {remainingMargin > 0 && (
                        <>
                            {" "}
                            Rimangono{" "}
                            {formatAmount(remainingMargin)}
                            {" "}
                            di margine non allocato.
                        </>
                    )}

                </div>

                ) : (

                    <div className="alert alert-warning mb-0">

                        <strong>
                            Margine prudenziale insufficiente.
                        </strong>{" "}

                        Le categorie richiedono complessivamente{" "}
                        {formatAmount(requestedTotal)}
                        {" "}
                        di aumento, ma il margine disponibile
                        consente di allocare solo{" "}
                        {formatAmount(allocatedTotal)}.

                        Rimane un fabbisogno non coperto di{" "}
                        {formatAmount(uncoveredAmount)}.

                    </div>

                )}

            </div>      
            <div className="col-12 col-md-4">

                <div className="small text-muted">
                    Proposte di aumento
                </div>

                <div className="fw-semibold">
                    {formatAmount(
                        requestedIncrease
                    )}
                </div>

            </div>


            <div className="col-12">

                <div className="small text-muted">
                    Margine prudenziale non allocato
                </div>

                <div className="fw-semibold">
                    {formatAmount(
                        remainingMargin
                    )}
                </div>

            </div>

        </div>

    );

}