import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

import { formatCurrency } from "../../utils/currency";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

import ProjectionPeriodSlider
    from "./ProjectionPeriodSlider";
    
export default function ReportProjection({

    historical = [],
    projection = [],

    projectionPeriods = [],
    projectionFrom,
    projectionTo,
    onProjectionPeriodChange

}) {

    const labels = [
        ...historical.map(item => item.month),
        ...projection.map(item => item.month)
    ];

    const ordinaryValues = [
        ...historical.map(
            item => item.cumulativeOrdinaryBalance
        ),
        ...projection.map(
            item => item.cumulativeOrdinaryBalance
        )
    ];

    const totalValues = [
        ...historical.map(
            item => item.cumulativeTotalBalance
        ),
        ...projection.map(
            item => item.cumulativeTotalBalance
        )
    ];

    /*
     * Dataset della linea dello zero.
     */
    const zeroValues =
        labels.map(() => 0);

    const data = {

        labels,

        datasets: [

    {
        label: "Saldo ordinario cumulato",

        data: ordinaryValues,

        borderColor: "#0d6efd",

        backgroundColor: "#0d6efd",

        borderWidth: 3,

        pointRadius: 4,

        pointHoverRadius: 6,

        tension: 0,

        fill: false,

        segment: {

            borderDash: context =>
                context.p1DataIndex >= historical.length
                    ? [7, 6]
                    : undefined

        }
    },

    {
        label: "Saldo totale cumulato",

        data: totalValues,

        borderColor: "rgba(108, 117, 125, 0.75)",

        backgroundColor:
            "rgba(108, 117, 125, 0.75)",

        borderWidth: 2,

        pointRadius: 3,

        pointHoverRadius: 5,

        tension: 0,

        fill: false,

        segment: {

            borderDash: context =>
                context.p1DataIndex >= historical.length
                    ? [7, 6]
                    : undefined

        }
    },

    {
        label: "Zero",

        data: zeroValues,

        borderColor: "rgba(108, 117, 125, 0.55)",

        borderWidth: 1,

        borderDash: [5, 5],

        pointRadius: 0,

        pointHoverRadius: 0,

        tension: 0,

        fill: false
    }

        ]

    };

    const options = {

        responsive: true,

        maintainAspectRatio: false,

        interaction: {
            mode: "index",
            intersect: false
        },

        plugins: {

            legend: {
                display: false


            },

            tooltip: {

                callbacks: {

                    title: context => {

                        const month =
                            context[0]?.label;

                        if (!month)
                            return "";

                        const [
                            year,
                            monthNumber
                        ] = month.split("-");

                        const date =
                            new Date(
                                Number(year),
                                Number(monthNumber) - 1
                            );

                        return date.toLocaleDateString(
                            "it-IT",
                            {
                                month: "long",
                                year: "numeric"
                            }
                        );

                    },

                    label: context => {

                        if (context.dataset.label === "Zero") return null;

                        return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;

                    },

                    afterBody: context => {
                        const point = context[0];
                        if (!point) return [];

                        const dataIndex = point.dataIndex;

                        if (dataIndex < historical.length) {
                            const month = historical[dataIndex];
                            const ordinaryBalance = Number(month.ordinaryBalance) || 0;
                            const extraordinaryBalance = Number(month.extraordinaryBalance) || 0;
                            const totalBalance = Number(month.totalBalance) || 0;

                            return [
                                "",
                                "Movimenti del mese",
                                `Entrate ordinarie: ${formatCurrency(month.ordinaryIncome ?? 0)}`,
                                `Uscite ordinarie: ${formatCurrency(-(month.ordinaryExpenses ?? 0))}`,
                                `Saldo ordinario del mese: ${formatCurrency(ordinaryBalance)}`,
                                `Entrate straordinarie: ${formatCurrency(month.extraordinaryIncome ?? 0)}`,
                                `Uscite straordinarie: ${formatCurrency(-(month.extraordinaryExpenses ?? 0))}`,
                                `Saldo straordinario del mese: ${formatCurrency(extraordinaryBalance)}`,
                                `Saldo totale del mese: ${formatCurrency(totalBalance)}`,
                                "",
                                `Saldo straordinario cumulato: ${formatCurrency(month.cumulativeExtraordinaryBalance ?? 0)}`
                            ];
                        }

                        const projected = projection[dataIndex - historical.length];
                        if (!projected) return [];

                        const projectedExtraordinary =
                            (Number(projected.totalBalance) || 0) -
                            (Number(projected.ordinaryBalance) || 0);
                        const cumulativeExtraordinary =
                            (Number(projected.cumulativeTotalBalance) || 0) -
                            (Number(projected.cumulativeOrdinaryBalance) || 0);

                        return [
                            "",
                            "Stima media mensile",
                            `Saldo ordinario previsto: ${formatCurrency(projected.ordinaryBalance ?? 0)}`,
                            `Saldo straordinario previsto: ${formatCurrency(projectedExtraordinary)}`,
                            `Saldo totale previsto: ${formatCurrency(projected.totalBalance ?? 0)}`,
                            "",
                            `Saldo straordinario cumulato previsto: ${formatCurrency(cumulativeExtraordinary)}`
                        ];
                    }

                }

            }

        },

        scales: {

            x: {

                grid: {
                    display: false
                },

                ticks: {

                    callback: value => {

                        const month =
                            labels[value];

                        if (!month)
                            return "";

                        const [
                            year,
                            monthNumber
                        ] = month.split("-");

                        return `${monthNumber}/${year.slice(2)}`;

                    }

                }

            },

            y: {

                beginAtZero: false,

                ticks: {

                    callback: value =>
                        formatCurrency(value)

                }

            }

        }

    };
    return (

        <div className="card border-0 shadow-sm">

            <div className="card-body">

                <div className="row align-items-start mb-4">

                    <div className="col-12 col-lg-6">

                        <h2 className="h4 mb-1">
                            Evoluzione del saldo
                        </h2>

                        <p className="text-muted mb-0">
                            Andamento cumulativo e proiezione del saldo
                        </p>

                    </div>

                    <div className="col-12 col-lg-6 d-flex justify-content-lg-end mt-3 mt-lg-0">

                        <div
                            style={{
                                width: "420px",
                                maxWidth: "100%"
                            }}
                        >

                            <ProjectionPeriodSlider
                                periods={projectionPeriods}
                                from={projectionFrom}
                                to={projectionTo}
                                onChange={onProjectionPeriodChange}
                            />

                        </div>

                    </div>

                </div>

                    <div
                        style={{
                            position: "relative",
                            height: "330px",
                        }}
                    >

                    <Line
                        data={data}
                        options={options}
                    />

                </div>
                <div className="d-flex flex-wrap justify-content-center gap-4 mt-3 small text-muted">

                    <div className="d-flex align-items-center gap-2">

                        <span
                            style={{
                                width: "28px",
                                borderTop: "3px solid #0d6efd"
                            }}
                        />

                        <span>
                            Saldo ordinario
                        </span>

                    </div>

                    <div className="d-flex align-items-center gap-2">

                        <span
                            style={{
                                width: "28px",
                                borderTop: "2px solid rgba(108, 117, 125, 0.75)"
                            }}
                        />

                        <span>
                            Saldo totale
                        </span>

                    </div>

                    <div className="d-flex align-items-center gap-2">

                        <span
                            style={{
                                width: "28px",
                                borderTop: "3px dashed #0d6efd"
                            }}
                        />

                        <span>
                            Proiezione ordinaria
                        </span>

                    </div>

                    <div className="d-flex align-items-center gap-2">

                        <span
                            style={{
                                width: "28px",
                                borderTop: "2px dashed rgba(108, 117, 125, 0.75)"
                            }}
                        />

                        <span>
                            Proiezione totale
                        </span>

                    </div>

                    <div className="d-flex align-items-center gap-2">

                        <span
                            style={{
                                width: "28px",
                                borderTop: "1px dashed rgba(108, 117, 125, 0.55)"
                            }}
                        />

                        <span>
                            Zero
                        </span>

                    </div>

                </div>
                <div className="row g-3 mt-3">

                    <div className="col-12 col-md-6">

                        <div className="border rounded p-3">

                            <div className="text-muted small mb-1">
                                Proiezione ordinaria
                            </div>

                            <div className="fs-4 fw-semibold text-primary">
                                {formatCurrency(
                                    projection?.[0]?.ordinaryBalance ?? 0
                                )}

                                <span className="fs-6 fw-normal">
                                    {" / mese"}
                                </span>
                            </div>

                            <div className="mt-3">

                                <div className="text-muted small">
                                    Saldo previsto a 3 mesi
                                </div>

                                <div className="fw-semibold">
                                    {formatCurrency(
                                        projection?.at(-1)?.cumulativeOrdinaryBalance ?? 0
                                    )}
                                </div>

                            </div>

                            <div className="text-muted small mt-2">
                                Basata esclusivamente sul comportamento
                                ordinario del periodo storico selezionato.
                            </div>

                        </div>

                    </div>

                    <div className="col-12 col-md-6">

                        <div className="border rounded p-3">

                            <div className="text-muted small mb-1">
                                Proiezione totale
                            </div>

                            <div className="fs-4 fw-semibold">
                                {formatCurrency(
                                    projection?.[0]?.totalBalance ?? 0
                                )}

                                <span className="fs-6 fw-normal">
                                    {" / mese"}
                                </span>
                            </div>

                            <div className="mt-3">

                                <div className="text-muted small">
                                    Saldo previsto a 3 mesi
                                </div>

                                <div className="fw-semibold">
                                    {formatCurrency(
                                        projection?.at(-1)?.cumulativeTotalBalance ?? 0
                                    )}
                                </div>

                            </div>

                            <div className="text-muted small mt-2">
                                Basata sull'andamento complessivo
                                del periodo storico selezionato.
                            </div>

                        </div>

                    </div>

                </div>
                <div className="text-muted small mt-3">
                    La proiezione estende per i prossimi 3 mesi
                    il comportamento medio del periodo storico selezionato.
                </div>

            </div>

        </div>

    );

}

