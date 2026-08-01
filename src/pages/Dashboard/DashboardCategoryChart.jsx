import AppCard from "../../components/ui/AppCard";
import { Doughnut } from "react-chartjs-2";
import { COLORS } from "../../constants/colors";


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

            <div
                style={{
                    height:300,
                    padding: "10px",
                }}
            >

                <Doughnut
                    data={data}
                    options={options}
                />

            </div>
            <div className="mt-4">

            {categoryExpenses.map((expense) => (

                <div
                    key={expense.categoryId}
                    className="d-flex justify-content-between align-items-center py-2"
                >

                    <div className="d-flex align-items-center">

                        <span
                            className="rounded-circle me-2"
                            style={{
                                width: 10,
                                height: 10,
                                backgroundColor: expense.color,
                            }}
                        />

                        <span>

                            {expense.name}

                        </span>

                    </div>

                    <strong>

                        € {expense.total.toLocaleString("it-IT")}

                    </strong>

                </div>

            ))}

        </div>
        </AppCard>
        

    );

}