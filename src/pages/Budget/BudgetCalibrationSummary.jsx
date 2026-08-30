export default function BudgetCalibrationSummary({
    calibration
}) {

    if (!calibration)
        return null;

    const capacity =
        calibration.capacity ?? {};

    const categories =
        calibration.categories ?? [];

    const increaseAllocation =
        calibration.increaseAllocation ?? {};

    const ordinaryIncomeMedian =
        Number(
            capacity.ordinaryIncomeMedian
        ) || 0;

    const budgetMedian =
        Number(
            capacity.budgetMedian
        ) || 0;

    const expenseDeviation =
        Number(
            capacity.medianOrdinaryExpenseBudgetDeviation
        ) || 0;

    const prudentialMargin =
        Number(
            capacity.ordinaryMarginMedian
        ) || 0;


    const increaseCount =
        categories.filter(
            category =>
                category.recommendation?.type ===
                "increase"
        ).length;


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


    const requestedTotal =
        Number(
            increaseAllocation.requestedTotal
        ) || 0;


    const allocatedTotal =
        Number(
            increaseAllocation.allocatedTotal
        ) || 0;


    const remainingMargin =
        Number(
            increaseAllocation.remainingMargin
        ) || 0;


    const uncoveredAmount =
        Number(
            increaseAllocation.uncoveredAmount
        ) || 0;


    const allocationStatus =
        increaseAllocation.allocationStatus ??
        (
            uncoveredAmount > 0
                ? "insufficient"
                : "sustainable"
        );


    const formatAmount = value =>
        Number(value).toLocaleString(
            "it-IT",
            {
                style: "currency",
                currency: "EUR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );


    const getDeviationClass =
        value => {

            if (value > 0)
                return "text-danger";

            if (value < 0)
                return "text-success";

            return "text-body";

        };


    return (

        <div className="mt-3">

            {/* =========================
                KPI PRINCIPALI
                ========================= */}

            <div className="row g-4">

                <div className="col-12 col-md-6 col-xl-3">

                    <div className="small text-muted">
                        Entrate ordinarie mediane
                    </div>

                    <div className="fs-5 fw-semibold">
                        {formatAmount(
                            ordinaryIncomeMedian
                        )}
                    </div>

                </div>


                <div className="col-12 col-md-6 col-xl-3">

                    <div className="small text-muted">
                        Budget mediano
                    </div>

                    <div className="fs-5 fw-semibold">
                        {formatAmount(
                            budgetMedian
                        )}
                    </div>

                </div>


                <div className="col-12 col-md-6 col-xl-3">

                    <div className="small text-muted">
                        Scostamento mediano spese
                    </div>

                    <div
                        className={`fs-5 fw-semibold ${getDeviationClass(
                            expenseDeviation
                        )}`}
                    >

                        {expenseDeviation > 0
                            ? "+"
                            : ""}

                        {formatAmount(
                            expenseDeviation
                        )}

                    </div>

                </div>


                <div className="col-12 col-md-6 col-xl-3">

                    <div className="small text-muted">
                        Margine prudenziale
                    </div>

                    <div
                        className={
                            `fs-5 fw-semibold ${
                                prudentialMargin >= 0
                                    ? "text-success"
                                    : "text-danger"
                            }`
                        }
                    >

                        {formatAmount(
                            prudentialMargin
                        )}

                    </div>

                </div>

            </div>


            <hr className="my-4" />


            {/* =========================
                STATO CATEGORIE
                ========================= */}

            <div className="row g-4">

                <div className="col-12 col-md-4">

                    <div className="small text-muted">
                        Categorie da aumentare
                    </div>

                    <div className="fs-5 fw-semibold">
                        {increaseCount}
                    </div>

                </div>


                <div className="col-12 col-md-4">

                    <div className="small text-muted">
                        Categorie da ridurre
                    </div>

                    <div className="fs-5 fw-semibold">
                        {decreaseCount}
                    </div>

                </div>


                <div className="col-12 col-md-4">

                    <div className="small text-muted">
                        Mantenute per alta variabilità
                    </div>

                    <div className="fs-5 fw-semibold">
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

            </div>


            {/* =========================
                SINTESI FINANZIARIA
                ========================= */}

            <div className="mt-4">

                {allocationStatus === "sustainable" ? (

                    <div className="alert alert-success mb-0">

                        <strong>
                            Situazione sostenibile.
                        </strong>{" "}

                        Le categorie che richiedono
                        un aumento necessitano
                        complessivamente{" "}
                        {formatAmount(
                            requestedTotal
                        )}.

                        Il margine prudenziale
                        consente di coprire
                        interamente l'adeguamento.

                        {remainingMargin > 0 && (
                            <>
                                {" "}
                                Rimangono{" "}
                                {formatAmount(
                                    remainingMargin
                                )}{" "}
                                di margine non allocato.
                            </>
                        )}

                    </div>

                ) : (

                    <div className="alert alert-warning mb-0">

                        <strong>
                            Margine prudenziale insufficiente.
                        </strong>{" "}

                        Le categorie richiedono
                        complessivamente{" "}
                        {formatAmount(
                            requestedTotal
                        )}{" "}
                        di aumento, ma il margine
                        consente di allocare solo{" "}
                        {formatAmount(
                            allocatedTotal
                        )}.

                        Rimane un fabbisogno
                        non coperto di{" "}
                        {formatAmount(
                            uncoveredAmount
                        )}.

                    </div>

                )}

            </div>

        </div>

    );

}