import AppCard from "../../components/ui/AppCard";
import { Doughnut } from "react-chartjs-2";
import { COLORS } from "../../constants/colors";
import { formatCurrency } from "../../utils/currency";

export default function DashboardCategoryChart({
    categoryExpenses = [],
}) {

    const data = {
        labels: categoryExpenses.map((c) => c.name),

        datasets: [
            {
            data: categoryExpenses.map((c) => c.total),

            backgroundColor: categoryExpenses.map((c) => c.color),

            borderWidth: 0,

            hoverOffset: 6,
            },
        ],
    };
    const options = {
            layout: {
                padding: 15,
            },
            responsive: true,

            maintainAspectRatio: false,
            radius: "80%",
            cutout: "68%",

            plugins: {
                legend: {
                display: false,
                },

                tooltip: {
                backgroundColor: COLORS.text,

                displayColors: false,

                cornerRadius: 10,

                padding: 12,

                callbacks: {
                    label(context) {
                    return `€ ${context.raw.toLocaleString("it-IT")}`;
                    },
                },
                },
            },
        };
    return (

        <AppCard title="Spese per categoria">

            <div className="p-2" style={{ height: 230 }}>

                <Doughnut
                    data={data}
                    options={options}
                />

            </div>
            <div className="mt-1">

            {categoryExpenses.map((category) => (

                <div
                    key={category.id}
                    className="d-flex justify-content-between align-items-center py-1"
                    style={{ fontSize: "0.9rem" }}
                >

                    <div className="d-flex align-items-center">

                        <span
                            className="rounded-circle me-2"
                            style={{
                                width: 8,
                                height: 8,
                                backgroundColor: category.color,
                            }}
                        />

                        <span>

                            {category.name}

                        </span>

                    </div>

                    <strong>
                        € {category.total.toLocaleString("it-IT")}
                    </strong>

                </div>

            ))}

        </div>
        </AppCard>
        

    );

}