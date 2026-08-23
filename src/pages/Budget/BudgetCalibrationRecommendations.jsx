import { useState } from "react";

export default function BudgetCalibrationRecommendations({
    calibration,
    onApply
}) {

    if (!calibration)
        return null;

    const categories =
        calibration.categories ?? [];

    const recommendations =
        categories.filter(category => {

            const type =
                category.recommendation?.type;

            return (
                type === "increase" ||
                type === "decrease"
            );

        });

    if (!recommendations.length) {

        return (
            <div className="small text-muted mt-3">
                Nessuna modifica consigliata per il periodo analizzato.
            </div>
        );

    }

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

    return (

        <div className="mt-4">

            <h5 className="mb-3">
                Categorie da rivedere
            </h5>

            <div className="d-flex flex-column gap-2">

                {recommendations.map(category => {

                    const recommendation =
                        category.recommendation;

                    const type =
                        recommendation.type;

                    const suggestedBudget =
                        recommendation.suggestedBudget ?? 0;

                    const requestedIncrease =
                        recommendation.suggestedIncrease ?? 0;
                    const currentBudget =
                        Number(category.currentBudget) || 0;

                    const suggestedChange =
                        suggestedBudget -
                        currentBudget;

                    const allocatedIncrease =
                        category.allocation?.allocatedIncrease ?? 0;

                    const uncoveredIncrease =
                        Math.max(
                            requestedIncrease -
                            allocatedIncrease,
                            0
                        );
                    const allocatedBudget =
                        category.allocation?.allocatedBudget ??
                        category.currentBudget;



                    return (

                        <BudgetCalibrationRecommendationRow
                            key={category.categoryId}
                            category={category}
                            type={type}
                            suggestedBudget={suggestedBudget}
                            requestedIncrease={requestedIncrease}
                            allocatedIncrease={allocatedIncrease}
                            allocatedBudget={allocatedBudget}
                            uncoveredIncrease={uncoveredIncrease}
                            onApply={newBudget =>
                                onApply?.(
                                    category,
                                    newBudget
                                )
                            }
                            formatAmount={formatAmount}
                            suggestedChange={suggestedChange}
                        />

                    );

                })}

            </div>

        </div>

    );

}


function BudgetCalibrationRecommendationRow({
    category,
    type,
    suggestedBudget,
    requestedIncrease,
    allocatedIncrease,
    allocatedBudget,
    uncoveredIncrease,
    onApply,
    formatAmount,
    appliedBudget,
    suggestedChange
}) {

    const recommendation =
        category.recommendation;

    const currentBudget =
        Number(category.currentBudget) || 0;

    const [
        value,
        setValue
    ] = useState(
        Number(
            appliedBudget ?? suggestedBudget
        ).toFixed(2)
    );

    const isApplied =
        appliedBudget !== undefined;

    const numericValue =
        Number(value) || 0;

    const difference =
        numericValue -
        currentBudget;

    const isIncrease =
        type === "increase";

    const handleApply = () => {

        const numericBudget =
            Number(value);

        if (
            !Number.isFinite(
                numericBudget
            ) ||
            numericBudget < 0
        ) {
            return;
        }

        onApply?.(
            numericBudget
        );

    };

    return (

        <div className="border rounded-3 px-3 py-2">

            <div className="row align-items-center g-2">

                {/* CATEGORIA */}
                <div className="col-12 col-lg-3">

                    <div className="fw-semibold">
                        {category.categoryName}
                    </div>

                    <div className="small text-muted">
                        Budget attuale{" "}
                        {formatAmount(
                            currentBudget
                        )}
                    </div>

                </div>


                {/* SUGGERIMENTO */}
                <div className="small text-muted">
                    Suggerimento
                </div>
                <div className="fw-semibold">

                    {formatAmount(
                        suggestedBudget
                    )}

                    <span
                        className={
                            type === "increase"
                                ? "text-success ms-2"
                                : "text-danger ms-2"
                        }
                    >

                        {suggestedChange > 0
                            ? "+"
                            : ""}

                        {formatAmount(
                            suggestedChange
                        )}

                    </span>

                </div>
                {type === "increase" &&
                    uncoveredIncrease > 0 && (

                        <div className="small text-danger">

                            Margine disponibile insufficiente.
                            {" "}
                            Coperti{" "}
                            {formatAmount(
                                allocatedIncrease
                            )}
                            {" "}
                            su{" "}
                            {formatAmount(
                                requestedIncrease
                            )}.

                        </div>

                )}

                {/* SCELTA UTENTE */}
                <div className="col-12 col-lg-4">

                    <div className="small text-muted">
                        Tua scelta
                    </div>

                    <div className="input-group">

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="form-control"
                            value={value}
                            onChange={event =>
                                setValue(
                                    event.target.value
                                )
                            }
                        />

                        <button
                            type="button"
                            className={
                                isIncrease
                                    ? "btn btn-success"
                                    : "btn btn-warning"
                            }
                            onClick={
                                handleApply
                            }
                        >
                            Applica
                        </button>

                    </div>

                    <div className="small text-muted mt-1">

                        Variazione:
                        {" "}
                        {difference >= 0
                            ? "+"
                            : ""}
                        {formatAmount(
                            difference
                        )}

                    </div>

                </div>


                {/* STATO */}
                <div className="col-12 col-lg-2 text-lg-end">

                    {isApplied ? (

                        <span className="badge bg-info text-dark">

                            Modifica in bozza

                        </span>

                    ) : (

                        <span
                            className={
                                isIncrease
                                    ? "badge bg-success"
                                    : "badge bg-warning text-dark"
                            }
                        >
                            {isIncrease
                                ? "Aumentare"
                                : "Ridurre"}
                        </span>

                    )}

                </div>

            </div>

        </div>

    );
}