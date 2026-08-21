import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

import AppCard from "../../components/ui/AppCard";
import { formatCurrency } from "../../utils/currency";
import ReportFocusMonthSelector
    from "./ReportFocusMonthSelector";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

export default function ReportMonthlyBalanceChart({

    distribution = [],

    focusMonth,

    stats = {},

    percentile,

    percentileDescription,

    focusPeriods = [],

    onFocusMonthChange

}) {

    const labels = distribution.map(
        item => item.day
    );


        const data = {

        labels,

        datasets: [
            {
                label: "P25",
                data: distribution.map(item => item.p25),

                borderWidth: 0,
                pointRadius: 0,

                backgroundColor: "rgba(13, 110, 253, 0.08)",

                fill: false
            },
            {
                label: "Fascia storica",
                data: distribution.map(item => item.p75),

                borderWidth: 0,
                pointRadius: 0,

                backgroundColor: "rgba(13, 110, 253, 0.08)",

                fill: "-1"
            },
            {
                label: "Zero",

                data: distribution.map(() => 0),

                borderColor: "rgba(108, 117, 125, 0.6)",

                borderWidth: 1,

                borderDash: [6, 6],

                pointRadius: 0,

                tension: 0
            },
            {
                label: "Mediana storica",

                data: distribution.map(
                    item => item.median
                ),

                borderColor: "rgba(13, 110, 253, 0.55)",

                borderWidth: 1.5,

                borderDash: [4, 4],

                pointRadius: 0,

                pointHoverRadius: 4,

                tension: 0.15
            },

            {
                label: focusMonth,

                data: distribution.map(
                    item => item.focus
                ),

                borderWidth: 3,

                pointRadius: 2.5,

                pointHoverRadius: 6,

                tension: 0.15,

                spanGaps: false,

                segment: {

                    borderColor: context => {

                        const start =
                            distribution[context.p0DataIndex];

                        const end =
                            distribution[context.p1DataIndex];

                        if (!start || !end)
                            return "#0d6efd";

                        const startBelow =
                            start.focus < start.p25;

                        const endBelow =
                            end.focus < end.p25;

                        const startAbove =
                            start.focus > start.p75;

                        const endAbove =
                            end.focus > end.p75;

                        if (startBelow && endBelow)
                            return "#dc3545";

                        if (startAbove && endAbove)
                            return "#198754";

                        return "#0d6efd";

                    }

                }

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

                    title: context =>
                        `Giorno ${context[0].label}`,

                    label: context => {

                        if (
                            context.raw === null ||
                            context.raw === undefined
                        ) {
                            return null;
                        }

                        return `${context.dataset.label}: ${formatCurrency(
                            context.raw
                        )}`;

                    }

                }

            }

        },

        scales: {

            x: {

                title: {

                    display: true,

                    text: "Giorno del mese"

                }

            },

            y: {

                title: {

                    display: true,

                    text: "Saldo (€)"

                },

                ticks: {

                    callback: value =>
                        formatCurrency(value)

                }

            }

        }

    };

return (

    <AppCard>

        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">

            <div>

                <h2 className="h4 mb-1">
                    Comportamento del saldo
                </h2>

                <p className="text-muted mb-0">
                    Il mese selezionato rispetto alla distribuzione storica
                </p>

            </div>

            <ReportFocusMonthSelector

                periods={focusPeriods}

                value={focusMonth}

                onChange={
                    onFocusMonthChange
                }

            />

        </div>

        {percentile !== null &&
            percentile !== undefined && (

            <div className="report-percentile mb-3">

                <div className="report-percentile__header">
                    Posizione rispetto allo storico
                </div>

                <div className="d-flex align-items-baseline gap-2">

                    <strong className="report-percentile__value">
                        {Math.round(percentile)}°
                    </strong>

                    <span className="report-percentile__label">
                        percentile
                    </span>

                    <span className="report-percentile__description">
                        {percentileDescription}
                    </span>

                </div>

            </div>

        )}

        <div
            style={{
                width: "100%",
                height: 320
            }}
        >

            <Line
                data={data}
                options={options}
            />

        </div>
        <div className="report-monthly-balance-legend">

            <div className="report-monthly-balance-legend__item">

                <span
                    className="report-monthly-balance-legend__area"
                />

                <span>
                    Fascia storica
                </span>

            </div>

            <div className="report-monthly-balance-legend__item">

                <span
                    className="report-monthly-balance-legend__median"
                />

                <span>
                    Mediana storica
                </span>

            </div>

            <div className="report-monthly-balance-legend__item">

                <span
                    className="report-monthly-balance-legend__focus"
                />

                <span>
                    {focusMonth
                        ? new Date(
                            `${focusMonth}-01T00:00:00`
                        ).toLocaleDateString(
                            "it-IT",
                            {
                                month: "long",
                                year: "numeric"
                            }
                        )
                        : "Mese selezionato"
                    }
                </span>

            </div>

        </div>
        <div className="mt-3 pt-3 border-top">

            <div className="small text-muted mb-2">
                Comportamento rispetto alla fascia storica
            </div>

            <div className="d-flex flex-wrap gap-4">

                <div>

                    <strong>
                        {stats.daysInRange}
                    </strong>

                    <span className="text-muted ms-1">
                        giorni nella fascia
                    </span>

                </div>

                <div>

                    <strong>
                        {stats.daysBelowRange}
                    </strong>

                    <span className="text-muted ms-1">
                        sotto fascia
                    </span>

                </div>

                <div>

                    <strong>
                        {stats.daysAboveRange}
                    </strong>

                    <span className="text-muted ms-1">
                        sopra fascia
                    </span>

                </div>

                <div>

                    <strong>
                        {Math.round(
                            stats.percentageInRange
                        )}%
                    </strong>

                    <span className="text-muted ms-1">
                        nella fascia
                    </span>

                </div>

            </div>

        </div>

    </AppCard>

);

}