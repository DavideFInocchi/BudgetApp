import AppCard from "../../components/ui/AppCard";
import { Line } from "react-chartjs-2";
import { COLORS } from "../../constants/colors";

export default function DashboardCashFlowChart({
    cashFlow = [],
}) {

    const data = {

        labels: cashFlow.map(point => {
            const date = new Date(`${point.date}T00:00:00`);

            return date.toLocaleDateString("it-IT", {
                day: "numeric",
                month: "short",
            });
        }),

        datasets: [
            {
                data: cashFlow.map(point => point.value),

                borderColor: COLORS.primary,

                backgroundColor: "transparent",

                borderWidth: 2,

                tension: 0.35,

                pointRadius: 3,

                pointHoverRadius: 5,

                pointBorderWidth: 0,

            },
        ],

    };

    const options = {

        responsive: true,

        maintainAspectRatio: false,

        layout: {
            padding: {
                left: 5,
                right: 10,
                top: 5,
                bottom: 0,
            },
        },

        plugins: {

            legend: {
                display: false,
            },

            tooltip: {

                backgroundColor: COLORS.text,

                titleFont: {
                    weight: "600",
                },

                bodyFont: {
                    size: 13,
                },

                padding: 10,

                cornerRadius: 8,

                displayColors: false,

                callbacks: {

                    title(context) {

                        return context[0].label;

                    },

                    label(context) {

                        return `Saldo: € ${Number(
                            context.raw
                        ).toLocaleString("it-IT", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}`;

                    },

                },

            },

        },

        scales: {

            x: {

                grid: {
                    display: false,
                },

                border: {
                    display: false,
                },

                ticks: {
                    color: COLORS.textMuted,
                    maxTicksLimit: 8,
                },

            },
            y: {

                border: {
                    display: false,
                },

                grid: {

                    color: (context) => {

                        if (context.tick.value === 0) {
                            return COLORS.textMuted;
                        }

                        return COLORS.border;
                    },

                    lineWidth: (context) => {

                        if (context.tick.value === 0) {
                            return 1.2;
                        }

                        return 1;
                    },

                },

                ticks: {

                    color: COLORS.textMuted,

                    callback(value) {

                        return `€ ${Number(value).toLocaleString("it-IT")}`;

                    },

                },

            },

        },

    };

    return (

        <AppCard title="Andamento saldo">

            <div
                className="mx-auto mt-4"
                style={{
                    width: "100%",
                    maxWidth: 600,
                    height: 190,
                }}
            >

                <Line
                    data={data}
                    options={options}
                />

            </div>

        </AppCard>

    );

}