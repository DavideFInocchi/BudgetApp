import { useState } from "react";

export default function BudgetCalibrationRecommendations({
    calibration,
    onApply,
    appliedChanges = {}
}) {

    if (!calibration?.categories?.length) {
        return null;
    }

    const categories =
        calibration.categories.filter(
            category =>
                category.recommendation?.type ===
                    "increase" ||
                category.recommendation?.type ===
                    "decrease"
        );

    if (!categories.length) {
        return null;
    }

    const formatAmount = value =>
        Number(value ?? 0).toLocaleString(
            "it-IT",
            {
                style: "currency",
                currency: "EUR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    return (

        <div className="mt-4">

            <h5 className="mb-1">
                Categorie da rivedere
            </h5>

            <div className="small text-muted mb-3">
                Il suggerimento è automatico; la modifica finale
                resta a tua scelta.
            </div>

            <div>

                {categories.map(category => (

                    <BudgetCalibrationRecommendationRow
                        key={
                            category.categoryId
                        }
                        category={
                            category
                        }
                        appliedBudget={
                            appliedChanges[
                                category.categoryId
                            ]
                        }
                        onApply={
                            onApply
                        }
                        formatAmount={
                            formatAmount
                        }
                    />

                ))}

            </div>

        </div>

    );
}


function BudgetCalibrationRecommendationRow({
    category,
    appliedBudget,
    onApply,
    formatAmount
}) {

    const recommendation =
        category.recommendation ?? {};

    const type =
        recommendation.type;

    const currentBudget =
        Number(
            category.currentBudget
        ) || 0;

    const suggestedBudget =
        Number(
            recommendation.suggestedBudget
        ) || currentBudget;

    const suggestedChange =
        suggestedBudget -
        currentBudget;

    const isIncrease =
        type === "increase";

    const allocation =
        category.allocation ?? null;

    const allocatedIncrease =
        Number(
            allocation?.allocatedIncrease
        ) || 0;

    const requestedIncrease =
        Number(
            recommendation.suggestedIncrease
        ) || 0;

    const uncoveredIncrease =
        Math.max(
            requestedIncrease -
            allocatedIncrease,
            0
        );

    const isApplied =
        appliedBudget !== undefined;

    const initialValue =
        appliedBudget ??
        suggestedBudget;

    const [
        value,
        setValue
    ] = useState(
        Number(initialValue).toFixed(2)
    );

    const numericValue =
        Number(value);

    const selectedDifference =
        numericValue -
        currentBudget;

    const handleApply = () => {

        if (
            !Number.isFinite(
                numericValue
            ) ||
            numericValue < 0
        ) {
            return;
        }

        onApply?.(
            category,
            numericValue
        );

    };

    return (

        <div className="border rounded-3 px-3 py-2 mb-2">

            <div className="row align-items-center g-2">

                {/* =========================
                    CATEGORIA
                    ========================= */}

                <div className="col-12 col-xl-3">

                    <div className="fw-semibold">
                        {
                            category.categoryName
                        }
                    </div>

                    <div className="small text-muted">

                        Budget attuale{" "}
                        {formatAmount(
                            currentBudget
                        )}

                    </div>

                </div>


                {/* =========================
                    SUGGERIMENTO
                    ========================= */}

                <div className="col-12 col-md-6 col-xl-3">

                    <div className="small text-muted">
                        Suggerimento
                    </div>

                    <div className="fw-semibold">

                        {formatAmount(
                            suggestedBudget
                        )}

                        <span
                            className={
                                `ms-2 ${
                                    suggestedChange > 0
                                        ? "text-success"
                                        : suggestedChange < 0
                                            ? "text-danger"
                                            : "text-muted"
                                }`
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

                    {isIncrease &&
                        recommendation
                            .correctionFactor < 1 && (

                        <div className="small text-muted">

                            Correzione prudenziale{" "}
                            {Math.round(
                                recommendation
                                    .correctionFactor *
                                100
                            )}
                            %

                        </div>

                    )}

                    {isIncrease &&
                        uncoveredIncrease > 0 && (

                        <div className="small text-danger">

                            Margine insufficiente:
                            {" "}
                            {formatAmount(
                                allocatedIncrease
                            )}
                            {" "}
                            di{" "}
                            {formatAmount(
                                requestedIncrease
                            )}
                            {" "}
                            coperti

                        </div>

                    )}

                </div>


                {/* =========================
                    TUA SCELTA
                    ========================= */}

                <div className="col-12 col-md-6 col-xl-4">

                    <div className="small text-muted">
                        Tua scelta
                    </div>

                    <div className="input-group input-group-sm">

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

                        Variazione:{" "}
                        {selectedDifference > 0
                            ? "+"
                            : ""}
                        {formatAmount(
                            selectedDifference
                        )}

                    </div>

                </div>


                {/* =========================
                    STATO
                    ========================= */}

                <div className="col-12 col-xl-2 text-xl-end">

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