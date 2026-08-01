import React from "react";
import ReactDOM from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import { queryClient } from "./services/queryClient";

import "./styles/theme.css";
import "./styles/layout.css";
import "./styles/components.css";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>

        <QueryClientProvider client={queryClient}>

            <App />

            <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={8}
                toastOptions={{
                    duration: 3000,
                    style: {
                        borderRadius: "10px",
                        background: "#363636",
                        color: "#fff"
                    },
                    success: {
                        iconTheme: {
                            primary: "#198754",
                            secondary: "#fff"
                        }
                    },
                    error: {
                        iconTheme: {
                            primary: "#dc3545",
                            secondary: "#fff"
                        }
                    }
                }}
            />

        </QueryClientProvider>

    </React.StrictMode>
);