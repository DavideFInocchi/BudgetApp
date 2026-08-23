import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

export default function BudgetCalibrationChart({
    calibration
}) {

    if (!calibration?.categories?.length) {
        return null;
    }

    const categories =
        calibration.categories
            .map(category => {

                const budget =
                    Number(
                        category.currentBudget
                    ) || 0;

                const medianConsumption =
                    Math.abs(
                        Number(
                            category.ordinary?.median
                        ) || 0
                    );

                return {

                    categoryName:
                        category.categoryName,

                    budget,

                    medianConsumption,

                    deviation:
                        medianConsumption -
                        budget

                };

            })
            .sort(
                (a, b) =>
                    b.deviation -
                    a.deviation
            );


    const formatCurrency = value =>
        Number(value).toLocaleString(
            "it-IT",
            {
                style: "currency",
                currency: "EUR",
                maximumFractionDigits: 0
            }
        );


    const data = {

        labels:
            categories.map(
                category =>
                    category.categoryName
            ),

        datasets: [

            {
                label: "Budget",
                
                data:
                    categories.map(
                        category =>
                            category.budget
                    ),

                backgroundColor:
                    "rgba(108, 117, 125, 0.20)",

                borderColor:
                    "rgba(108, 117, 125, 0.45)",

                borderWidth: 1.5,

                borderRadius: 5,

                barThickness: 16,

                grouped: false,

                order: 2
            },

            {
                label: "Consumo mediano",

                data:
                    categories.map(
                        category =>
                            category.medianConsumption
                    ),

                backgroundColor:
                    "rgba(13, 110, 253, 0.80)",

                borderColor:
                    "rgba(13, 110, 253, 1)",

                borderWidth: 0,

                borderRadius: 5,

                barThickness: 9,

                grouped: false,

                order: 1
            }

        ]

    };


    const options = {

        indexAxis: "y",

        responsive: true,

        maintainAspectRatio: false,

        animation: false,

        interaction: {

            mode: "nearest",

            intersect: true,

            axis: "y"

        },

        plugins: {

            legend: {

                position: "top",

                align: "end",

                labels: {

                    boxWidth: 10,

                    boxHeight: 10,

                    padding: 12,

                    font: {
                        size: 11
                    }

                }

            },

            tooltip: {

                enabled: true,

                position: "nearest",

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

                        return categories[index]
                            .categoryName;

                    },

                    label: () => null,

                    afterBody: tooltipItems => {

                        const index =
                            tooltipItems?.[0]
                                ?.dataIndex;

                        if (
                            index === undefined
                        ) {
                            return [];
                        }

                        const category =
                            categories[index];

                        const deviation =
                            category.deviation;

                        return [

                            `Budget: ${
                                formatCurrency(
                                    category.budget
                                )
                            }`,

                            `Consumo mediano: ${
                                formatCurrency(
                                    category.medianConsumption
                                )
                            }`,

                            `Scostamento: ${
                                deviation > 0
                                    ? "+"
                                    : ""
                            }${
                                formatCurrency(
                                    deviation
                                )
                            }`

                        ];

                    }

                }

            }

        },

        scales: {

            x: {

                beginAtZero: true,

                stacked: false,

                border: {
                    display: false
                },

                grid: {
                    color:
                        "rgba(0, 0, 0, 0.06)"
                },

                ticks: {

                    font: {
                        size: 10
                    },

                    callback: value =>
                        `${value} €`

                }

            },

            y: {
                stacked: false,

                border: {
                    display: false
                },

                grid: {
                    display: false
                },

                ticks: {

                    font: {
                        size: 10
                    },

                    padding: 4

                }

            }

        }

    };


    return (

        <div className="mt-4">

            <div className="d-flex justify-content-between align-items-center mb-2">

                <h5 className="mb-0">
                    Budget vs consumo mediano
                </h5>

                <div className="small text-muted">
                    Ordinato per scostamento
                </div>

            </div>

            <div
                style={{
                    height:
                        `${categories.length * 25 + 40}px`,
                    maxWidth: "1050px",
                    margin: "0 auto"
                }}
            >

                <Bar
                    data={data}
                    options={options}
                />

            </div>

        </div>

    );

}