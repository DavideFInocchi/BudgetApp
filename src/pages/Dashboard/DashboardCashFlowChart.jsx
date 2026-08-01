import AppCard from "../../components/ui/AppCard";
import { Bar } from "react-chartjs-2";
import { COLORS } from "../../constants/colors";

export default function DashboardCashFlowChart({
    cashFlow = [],
}) {

    const first = cashFlow[0];

    const data = {
        labels: ["Entrate", "Uscite"],
        datasets: [
            {
                data: [
                first?.income ?? 0,
                first?.expense ?? 0,
                ],
                backgroundColor: [
                COLORS.success,
                COLORS.danger,
                ],
                borderRadius: 8,
                borderSkipped: false,
                maxBarThickness: 70,
                categoryPercentage: 0.5,
                barPercentage: 0.7,
            },
        ],
    };

    const options = {
    layout: {
        padding: {
            left: 10,
            right: 10,
            top: 5,
            bottom: 0,
        },
    },
    responsive: true,

    maintainAspectRatio: false,

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

        padding: 12,

        cornerRadius: 10,

        displayColors: false,

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
        },

        },

        y: {

        beginAtZero: true,

        border: {
            display: false,
        },

        grid: {
            color: COLORS.border,
        },

        ticks: {
            color: COLORS.textMuted,
        },

        },

    },

    };

    return (

        <AppCard title="Entrate vs Uscite">

            <div
                className="mx-auto"
                style={{
                    width: 420,
                    maxWidth: "100%",
                    height: 320,
                }}
            >
                <Bar
                    data={data}
                    options={options}
                />
            </div>

        </AppCard>

    );

}