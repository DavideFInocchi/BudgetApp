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
    

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

export default function BudgetCalibrationTrendChart({
    calibration
}) {

    if (
        !calibration?.monthlyData?.length
    ) {
        return null;
    }

    const formatCurrency = value =>
        Number(value).toLocaleString(
            "it-IT",
            {
                style: "currency",
                currency: "EUR",
                maximumFractionDigits: 0
            }
        );

    const formatMonth = value => {

        const date =
            new Date(
                `${value}-01T00:00:00`
            );

        return date.toLocaleDateString(
            "it-IT",
            {
                month: "short"
            }
        );

    };

    const monthlyData =
        calibration.monthlyData;

    const labels =
        monthlyData.map(
            month =>
                formatMonth(month.month)
        );

    const values =
        monthlyData.map(
            month =>
                Number(
                    month.ordinaryExpenseBudgetDeviation
                ) || 0
        );

    const data = {

        labels,

        datasets: [

            {
                label:
                    "Scostamento spese ordinarie",

                data: values,

                borderWidth: 2,

                pointRadius: 3,

                pointHoverRadius: 5,

                tension: 0.3

            }

        ]

    };

    const options = {

        responsive: true,

        maintainAspectRatio: false,

        animation: false,

        interaction: {

            mode: "index",

            intersect: false

        },

        plugins: {

            legend: {
                display: false
            },

            tooltip: {

                displayColors: false,

                callbacks: {

                    title: tooltipItems => {

                        const index =
                            tooltipItems?.[0]
                                ?.dataIndex;

                        if (
                            index === undefined
                        ) {
                            return "";
                        }

                        return monthlyData[
                            index
                        ].month;

                    },

                    label: context => {

                        const value =
                            Number(
                                context.raw
                            ) || 0;

                        return `Scostamento: ${
                            value > 0
                                ? "+"
                                : ""
                        }${formatCurrency(
                            value
                        )}`;

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
                    font: {
                        size: 10
                    }
                }

            },

            y: {

                grid: {

                    color: context =>
                        context.tick.value === 0
                            ? "rgba(0, 0, 0, 0.45)"
                            : "rgba(0, 0, 0, 0.06)",

                    lineWidth: context =>
                        context.tick.value === 0
                            ? 2
                            : 1,

                },

                ticks: {

                    font: {
                        size: 10
                    },

                    callback: value =>
                        `${value} €`

                }

            }

        }

    };

    return (

        <div className="mt-4">

            <div className="d-flex justify-content-between align-items-center mb-2">

                <h5 className="mb-0">
                    Scostamento mensile delle spese
                </h5>

                <div className="small text-muted">
                    Spese ordinarie vs budget
                </div>

            </div>

            <div
                style={{
                    height: "220px",
                    maxWidth: "1050px",
                    margin: "0 auto"
                }}
            >

                <Line
                    data={data}
                    options={options}
                    
                />

            </div>

        </div>

    );

}