import { useMemo, useState } from "react";

import AppCard from "../../components/ui/AppCard";
import { formatCurrency } from "../../utils/currency";

function monthLabel(value) {

    if (!value)
        return "";

    const normalized =
        String(value).slice(0, 7);

    const date =
        new Date(`${normalized}-01T00:00:00`);

    if (Number.isNaN(date.getTime()))
        return "";

    return date.toLocaleDateString("it-IT", {
        month: "long",
        year: "numeric"
    });
}
    const CATEGORY_COLORS = {
        "Alimentari": "#2f8f46",
        "Assicurazione": "#0097a7",
        "Bonus / Extra": "#8e24aa",
        "Bollette": "#f9a825",
        "Casa": "#ef6c00",
        "Intrattenimento": "#7b1fa2",
        "Investimenti": "#00796b",
        "Mutuo": "#795548",
        "Salute": "#d32f2f",
        "Svago": "#009688",
        "Trasporti": "#1976d2",
        "Vestiti": "#c2185b",
        "Altro": "#607d8b",
        "Senza categoria": "#78909c"
    };
function aggregateCategoryBalances(
    transactions,
    month
) {

    const map =
        new Map();

    const targetMonth =
        String(month ?? "").slice(0, 7);

    transactions.forEach(
        transaction => {

            const transactionMonth =
                String(
                    transaction.transaction_date
                ).slice(0, 7);

            if (
                transactionMonth !==
                targetMonth
            ) {
                return;
            }

            const category =
                transaction.category_name ??
                "Senza categoria";

            /*
             * Lo stipendio è reddito e non appartiene
             * alla composizione delle uscite.
             *
             * Le altre categorie rimangono comprese,
             * compreso Bonus / Extra.
             */

            const amount =
                Number(
                    transaction.amount
                ) || 0;
            if (
                category === "Stipendio"
                
            ) {
                return;
            }
            if (
                category === "Bonus / Extra" &&
                amount > 0
            ) {
                return;
            }
            const current =
                map.get(category) ?? 0;

            map.set(
                category,
                current + amount
            );

        }
    );

    return map;

}

function formatPercent(value) {
    if (!Number.isFinite(value) || value === 0)
        return "0%";

    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function buildLabelPositions(
    positioned,
    side,
    minLabelGap,
    top,
    bottom
) {
    const items =
        positioned
            .map(row => ({
                category: row.category,
                naturalY:
                    side === "left"
                        ? row.leftCenter
                        : row.rightCenter
            }))
            .sort(
                (a, b) =>
                    a.naturalY -
                    b.naturalY
            );

    if (!items.length)
        return new Map();

    const placed = [];

    items.forEach(
        (item, index) => {

            const y =
                index === 0
                    ? Math.max(
                        top,
                        item.naturalY
                    )
                    : Math.max(
                        item.naturalY,
                        placed[index - 1].y +
                        minLabelGap
                    );

            placed.push({
                ...item,
                y
            });

        }
    );

    const overflow =
        placed.at(-1).y -
        bottom;

    if (overflow > 0) {

        placed[placed.length - 1].y -=
            overflow;

        for (
            let index = placed.length - 2;
            index >= 0;
            index--
        ) {

            placed[index].y =
                Math.min(
                    placed[index].y,
                    placed[index + 1].y -
                    minLabelGap
                );

        }

    }

    placed.forEach(item => {

        item.y =
            Math.max(
                top,
                Math.min(
                    bottom,
                    item.y
                )
            );

    });

    return new Map(
        placed.map(item => [
            item.category,
            item.y
        ])
    );
}

export default function ReportPeriodComparisonSankey({

    periodA,
    periodB,

    periods = [],

    onPeriodAChange,
    onPeriodBChange,

    transactionsA = [],
    transactionsB = []

}) {
    const [hoveredCategory, setHoveredCategory] = useState(null);

    const data = useMemo(() => {
        const a = aggregateCategoryBalances(
            transactionsA,
            periodA
        );

        const b = aggregateCategoryBalances(
            transactionsB,
            periodB
        );

        const rows =
            [...new Set([...a.keys(), ...b.keys()])]
                .map(category => {
                    const valueA = a.get(category) ?? 0;
                    const valueB = b.get(category) ?? 0;

                    return {
                        category,
                        valueA,
                        valueB,
                        delta: valueB - valueA
                    };
                })
                .filter(
                    row =>
                        row.valueA !== 0 ||
                        row.valueB !== 0
                )
                .sort(
                    (x, y) =>
                        Math.max(
                            Math.abs(y.valueA),
                            Math.abs(y.valueB)
                        ) -
                        Math.max(
                            Math.abs(x.valueA),
                            Math.abs(x.valueB)
                        )
                );

        return {
            rows,
            totalA: rows.reduce(
                (sum, row) => sum + row.valueA,
                0
            ),
            totalB: rows.reduce(
                (sum, row) => sum + row.valueB,
                0
            )
        };
     }, [
        periodA,
        periodB,
        transactionsA,
        transactionsB
    ]);

    if (!periodA || !periodB)
        return null;

    const width = 1000;
    const height = 455;

    const leftX = 150;
    const rightX = 850;

    /*
     * Area verticale del Sankey.
     *
     * I due lati condividono la stessa scala:
     * 1 € corrisponde allo stesso numero di pixel
     * a sinistra e a destra.
     *
     * Le pile partono entrambe dal basso e crescono
     * verso l'alto, così la differenza del totale
     * risulta immediatamente visibile.
     */
    const compactTop = 82;
    const compactBottom = 440;
    const compactHeight =
        compactBottom - compactTop;

    const categoryGap = 4;
    /*
     * Saldi contabili:
     *
     * - valore negativo = uscita
     * - valore positivo = rimborso netto
     *
     * Per la geometria usiamo la magnitudine delle
     * uscite. I valori contabili rimangono invariati
     * per totale e tooltip.
     */
    const visualRows =
        data.rows.map(row => ({

            ...row,

            flowA:
                Math.max(
                    -row.valueA,
                    0
                ),

            flowB:
                Math.max(
                    -row.valueB,
                    0
                )

        }));


    const flowTotalA =
        visualRows.reduce(
            (sum, row) =>
                sum + row.flowA,
            0
        );

    const flowTotalB =
        visualRows.reduce(
            (sum, row) =>
                sum + row.flowB,
            0
        );


    /*
     * Confronto del totale.
     */
    const totalDelta =
        Math.abs(data.totalB) -
        Math.abs(data.totalA);

    const totalDeltaPercent =
        Math.abs(data.totalA) > 0
            ? (
                totalDelta /
                Math.abs(data.totalA)
            ) * 100
            : null;

    const totalDirection =
        totalDelta > 0.01
            ? "increase"
            : totalDelta < -0.01
                ? "decrease"
                : "stable";

    const totalComparisonText =
        totalDirection === "increase"
            ? `${monthLabel(periodB)} hai speso ${formatCurrency(
                Math.abs(totalDelta)
            )} in più rispetto a ${monthLabel(periodA)}`
            : totalDirection === "decrease"
                ? `${monthLabel(periodB)} hai speso ${formatCurrency(
                    Math.abs(totalDelta)
                )} in meno rispetto a ${monthLabel(periodA)}`
                : "Le uscite sono sostanzialmente invariate tra i due periodi";


    /*
     * SCALE COMUNE
     *
     * Usiamo un unico rapporto pixel/euro per entrambi
     * i lati. La scala viene calcolata tenendo conto
     * anche dell'altezza minima visiva dei nodi.
     */
    const minNodeHeight = 4;

    const categoryCount =
        visualRows.length;

    const minVisibleHeight =
        categoryCount *
        minNodeHeight;

    const totalGapHeight =
        categoryGap *
        Math.max(
            categoryCount - 1,
            0
        );

    const maxFlowTotal =
        Math.max(
            flowTotalA,
            flowTotalB
        );

    const availableFlowHeight =
        Math.max(
            compactHeight -
            minVisibleHeight -
            totalGapHeight,
            0
        );

    const pixelsPerEuro =
        maxFlowTotal > 0
            ? availableFlowHeight /
              maxFlowTotal
            : 0;


    /*
     * Altezze reali dei flussi + altezza minima visiva.
     *
     * La parte aggiuntiva serve esclusivamente a mantenere
     * leggibili categorie molto piccole; non modifica
     * valueA/valueB né i totali.
     */
    const positioned =
        visualRows.reduce(
            (
                result,
                row
            ) => {

                const scaledLeftHeight =
                    row.flowA *
                    pixelsPerEuro;

                const scaledRightHeight =
                    row.flowB *
                    pixelsPerEuro;

                const leftHeight =
                    row.flowA > 0
                        ? Math.max(
                            scaledLeftHeight,
                            minNodeHeight
                        )
                        : 0;

                const rightHeight =
                    row.flowB > 0
                        ? Math.max(
                            scaledRightHeight,
                            minNodeHeight
                        )
                        : 0;


                /*
                 * Impilamento DAL BASSO verso L'ALTO.
                 *
                 * Il primo nodo parte da compactBottom,
                 * il successivo termina dove iniziava
                 * quello precedente.
                 */
                const previous =
                    result.at(-1);

                const previousLeftY =
                    previous
                        ? previous.leftY
                        : compactBottom;

                const previousRightY =
                    previous
                        ? previous.rightY
                        : compactBottom;

                const leftY =
                    previous
                        ? previousLeftY -
                        categoryGap -
                        leftHeight
                        : compactBottom -
                        leftHeight;

                const rightY =
                    previous
                        ? previousRightY -
                        categoryGap -
                        rightHeight
                        : compactBottom -
                        rightHeight;


                result.push({

                    ...row,

                    leftY,
                    rightY,

                    leftHeight,
                    rightHeight,

                    leftCenter:
                        leftY +
                        leftHeight / 2,

                    rightCenter:
                        rightY +
                        rightHeight / 2

                });


                return result;

            },
            []
        );

    const hovered =
        positioned.find(
            row =>
                row.category ===
                hoveredCategory
        );
    const hoveredDelta =
        hovered
            ? Math.abs(hovered.valueB) -
              Math.abs(hovered.valueA)
            : 0;

    const hoveredPercent =
        hovered &&
        Math.abs(hovered.valueA) > 0
            ? (
                hoveredDelta /
                Math.abs(hovered.valueA)
            ) * 100
            : null;

    const hoveredDirection =
        hoveredDelta > 0.01
            ? "increase"
            : hoveredDelta < -0.01
                ? "decrease"
                : "stable";

    const hoveredMessage =
        hoveredDirection === "increase"
            ? "Hai speso di più"
            : hoveredDirection === "decrease"
                ? "Hai speso di meno"
                : "Spesa invariata";
        /*
     * Le label vengono posizionate separatamente dai nodi,
     * mantenendo una distanza minima per evitare sovrapposizioni.
     */
    const minLabelGap = 10;

    const leftLabelY =
        buildLabelPositions(
            positioned,
            "left",
            minLabelGap,
            compactTop,
            compactBottom
        );

    const rightLabelY =
        buildLabelPositions(
            positioned,
            "right",
            minLabelGap,
            compactTop,
            compactBottom
        );
    const labelOffset = 22;

    const leftLabelX =
        leftX - labelOffset;

    const rightLabelX =
        rightX + labelOffset;

    return (
        <AppCard>
            <div className="d-flex justify-content-between align-items-start">
                <div>
                    <h2 className="h4 mb-1">
                        Confronto delle uscite
                    </h2>

                    <p className="text-muted mb-0">
                        Come è cambiato il totale e la composizione delle spese tra i due periodi.
                    </p>
                </div>
            </div>
        <div className="row g-3 mt-1">

            <div className="col-12 col-md-6">

                <label className="form-label small text-muted mb-1">
                    Periodo 1
                </label>

                <select
                    className="form-select form-select-sm"
                    value={periodA ?? ""}
                    onChange={event =>
                        onPeriodAChange?.(
                            event.target.value
                        )
                    }
                >

                    {periods.map(period => (

                        <option
                            key={period}
                            value={period}
                        >
                            {monthLabel(period)}
                        </option>

                    ))}

                </select>

            </div>


            <div className="col-12 col-md-6">

                <label className="form-label small text-muted mb-1">
                    Periodo 2
                </label>

                <select
                    className="form-select form-select-sm"
                    value={periodB ?? ""}
                    onChange={event =>
                        onPeriodBChange?.(
                            event.target.value
                        )
                    }
                >

                    {periods.map(period => (

                        <option
                            key={period}
                            value={period}
                        >
                            {monthLabel(period)}
                        </option>

                    ))}

                </select>

            </div>

        </div>
            <div className="position-relative mt-3">
                <div className="text-center small text-muted mt-1">
                        {totalComparisonText}
                </div>
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    width="100%"
                    role="img"
                >
                    {/* TOTALI NETTI */}
                    <text
                        x={leftX}
                        y="32"
                        textAnchor="middle"
                        fontSize="18"
                        fontWeight="600"
                    >
                        {formatCurrency(data.totalA)}
                    </text>

                    <text
                        x={rightX}
                        y="32"
                        textAnchor="middle"
                        fontSize="18"
                        fontWeight="600"
                    >
                        {formatCurrency(data.totalB)}
                    </text>
                    <text
                        x={width / 2}
                        y="24"
                        textAnchor="middle"
                        fontSize="15"
                        fontWeight="600"
                    >
                        {totalDirection === "increase"
                            ? `↑ ${formatCurrency(Math.abs(totalDelta))}`
                            : totalDirection === "decrease"
                                ? `↓ ${formatCurrency(Math.abs(totalDelta))}`
                                : "≈ 0 €"
                        }
                    </text>

                    <text
                        x={width / 2}
                        y="44"
                        textAnchor="middle"
                        fontSize="12"
                        fill="#6c757d"
                    >
                        {totalDeltaPercent !== null
                            ? `${totalDeltaPercent > 0 ? "+" : ""}${totalDeltaPercent.toFixed(1)}%`
                            : ""
                        }
                    </text>

                    <text
                        x={leftX}
                        y="54"
                        textAnchor="middle"
                        fontSize="12"
                        fill="#6c757d"
                    >
                        {monthLabel(periodA)}
                    </text>

                    <text
                        x={rightX}
                        y="54"
                        textAnchor="middle"
                        fontSize="12"
                        fill="#6c757d"
                    >
                        {monthLabel(periodB)}
                    </text>

                    {/* FLUSSI */}
                    {positioned.map(row => {
                        if (row.leftHeight <= 0 && row.rightHeight <= 0)
                            return null;
                        const categoryColor =
                            CATEGORY_COLORS[
                                row.category
                            ] ??
                            CATEGORY_COLORS["Senza categoria"];
                        const leftTop = row.leftY;
                        const leftBottom = row.leftY + row.leftHeight;
                        const rightTop = row.rightY;
                        const rightBottom = row.rightY + row.rightHeight;

                        const controlOffset =
                            (rightX - leftX) * 0.42;

                        const path = `
                            M ${leftX} ${leftTop}
                            C ${leftX + controlOffset} ${leftTop},
                              ${rightX - controlOffset} ${rightTop},
                              ${rightX} ${rightTop}
                            L ${rightX} ${rightBottom}
                            C ${rightX - controlOffset} ${rightBottom},
                              ${leftX + controlOffset} ${leftBottom},
                              ${leftX} ${leftBottom}
                            Z
                        `;

                        const isHovered =
                            hoveredCategory ===
                            row.category;

                        const hasHover =
                            hoveredCategory !== null;

                        const opacity =
                            !hasHover
                                ? 0.22
                                : isHovered
                                    ? 0.60
                                    : 0.06;
                        
                        return (
                            <path
                                key={row.category}
                                d={path}
                                fill="currentColor"
                                color={categoryColor}
                                opacity={opacity}
                                stroke="none"
                                onMouseEnter={() =>
                                    setHoveredCategory(
                                        row.category
                                    )
                                }
                                onMouseLeave={() =>
                                    setHoveredCategory(
                                        null
                                    )
                                }
                            />
                        );
                    })}
                    {/* GUIDE DELLE LABEL */}

                    {positioned.map(row => {

                        const leftNaturalY =
                            row.leftCenter;

                        const leftLabel =
                            leftLabelY.get(
                                row.category
                            ) ??
                            leftNaturalY;

                        const rightNaturalY =
                            row.rightCenter;

                        const rightLabel =
                            rightLabelY.get(
                                row.category
                            ) ??
                            rightNaturalY;



                        /*
                        * Il leader parte dal bordo del nodo,
                        * esce brevemente in orizzontale,
                        * poi raggiunge la quota della label.
                        *
                        * Non arriva fino al testo:
                        * lasciamo 5 px di separazione.
                        */


                        const leftMoved =
                            Math.abs(
                                leftLabel -
                                leftNaturalY
                            ) > 2;

                        const rightMoved =
                            Math.abs(
                                rightLabel -
                                rightNaturalY
                            ) > 2;


                        return (

                            <g
                                key={`${row.category}-guides`}
                                pointerEvents="none"
                            >

                            {leftMoved && (
                                <polyline
                                    points={`
                                        ${leftX - 8},${leftNaturalY}
                                        ${leftX - 16},${leftNaturalY}
                                        ${leftX - 16},${leftLabel}
                                        ${leftLabelX + 6},${leftLabel}
                                    `}
                                    fill="none"
                                    stroke="#9aa0a6"
                                    strokeWidth="0.8"
                                />
                            )}


                            {rightMoved && (
                                <polyline
                                    points={`
                                        ${rightX + 8},${rightNaturalY}
                                        ${rightX + 16},${rightNaturalY}
                                        ${rightX + 16},${rightLabel}
                                        ${rightLabelX - 6},${rightLabel}
                                    `}
                                    fill="none"
                                    stroke="#9aa0a6"
                                    strokeWidth="0.8"
                                />
                            )}

                            </g>

                        );

                    })}

                    {/* BLOCCHI E LABEL */}
                    {positioned.map(row => {
                        const categoryColor =
                            CATEGORY_COLORS[
                                row.category
                            ] ??
                            CATEGORY_COLORS["Senza categoria"];
                        const active =
                            hoveredCategory ===
                            row.category;
                        return (
                            <g
                                key={`${row.category}-blocks`}
                                color={categoryColor}
                            >

                                <rect
                                    x={leftX - 8}
                                    y={row.leftY}
                                    width="16"
                                    height={row.leftHeight}
                                    rx="2"
                                    fill="currentColor"
                                    opacity={
                                        active
                                            ? 1
                                            : 0.8
                                    }
                                    onMouseEnter={() =>
                                        setHoveredCategory(
                                            row.category
                                        )
                                    }
                                    onMouseLeave={() =>
                                        setHoveredCategory(
                                            null
                                        )
                                    }
                                />

                                <rect
                                    x={rightX - 8}
                                    y={row.rightY}
                                    width="16"
                                    height={row.rightHeight}
                                    rx="2"
                                    fill="currentColor"
                                    opacity={
                                        active
                                            ? 1
                                            : 0.8
                                    }
                                    onMouseEnter={() =>
                                        setHoveredCategory(
                                            row.category
                                        )
                                    }
                                    onMouseLeave={() =>
                                        setHoveredCategory(
                                            null
                                        )
                                    }
                                />

                                <text
                                    x={leftLabelX}
                                    y={
                                        (
                                            leftLabelY.get(
                                                row.category
                                            ) ??
                                            row.leftCenter
                                        ) + 4
                                    }
                                    textAnchor="end"
                                    fontSize="11"
                                    onMouseEnter={() =>
                                        setHoveredCategory(
                                            row.category
                                        )
                                    }

                                    onMouseLeave={() =>
                                        setHoveredCategory(
                                            null
                                        )
                                    }
                                >
                                    {row.category}
                                </text>

                                <text
                                    x={rightLabelX}
                                    y={
                                        (
                                            rightLabelY.get(
                                                row.category
                                            ) ??
                                            row.rightCenter
                                        ) + 4
                                    }
                                    fontSize="11"
                                    onMouseEnter={() =>
                                        setHoveredCategory(
                                            row.category
                                        )
                                    }
                                    onMouseLeave={() =>
                                        setHoveredCategory(
                                            null
                                        )
                                    }
                                >
                                    {row.category}
                                </text>

                            </g>
                        );

                    })}

                </svg>

                {/* TOOLTIP */}

                {hovered && (

                    <div
                        className="position-absolute bg-dark text-white rounded-3 px-3 py-2 shadow"
                        style={{
                            top: "12px",
                            left: "50%",
                            transform:
                                "translateX(-50%)",
                            pointerEvents:
                                "none",
                            fontSize: "12px",
                            lineHeight: 1.45,
                            minWidth: "190px",
                            zIndex: 2
                        }}
                    >

                        <div
                            className="fw-semibold mb-2"
                        >
                            {hovered.category}
                        </div>


                        <div
                            className="d-flex justify-content-between gap-3"
                        >
                            <span>
                                {monthLabel(periodA)}
                            </span>

                            <strong>
                                {formatCurrency(
                                    Math.abs(
                                        hovered.valueA
                                    )
                                )}
                            </strong>
                        </div>


                        <div
                            className="d-flex justify-content-between gap-3"
                        >
                            <span>
                                {monthLabel(periodB)}
                            </span>

                            <strong>
                                {formatCurrency(
                                    Math.abs(
                                        hovered.valueB
                                    )
                                )}
                            </strong>
                        </div>


                        <div className="border-top border-secondary mt-2 pt-2">

                            <div className="fw-semibold">

                                {hoveredDirection ===
                                "increase"
                                    ? "↑"
                                    : hoveredDirection ===
                                        "decrease"
                                            ? "↓"
                                            : "≈"
                                }

                                {" "}

                                {formatCurrency(
                                    Math.abs(
                                        hoveredDelta
                                    )
                                )}

                                {hoveredPercent !== null && (
                                    <>
                                        {" "}
                                        (
                                        {hoveredPercent > 0
                                            ? "+"
                                            : ""
                                        }
                                        {hoveredPercent.toFixed(
                                            1
                                        )}
                                        %)
                                    </>
                                )}

                            </div>


                            <div
                                className="text-white-50"
                            >
                                {hoveredMessage}
                            </div>

                        </div>

                    </div>

                )}
            </div>
        </AppCard>
    );
}
