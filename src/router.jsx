import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";

import ReportPage from "./pages/Reports/ReportPage";
import Categories from "./pages/Categories";
import Settings from "./pages/Settings";
import TransactionsPage from "./pages/Transactions/TransactionsPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import BudgetPage from "./pages/Budget/BudgetPage";
export default function Router() {

    return (

        <BrowserRouter>

            <Routes>

                <Route element={<Layout />}>

                    <Route path="/" element={<DashboardPage />} />

                    <Route
                        path="/transactions"
                        element={<TransactionsPage />}
                    />

                    <Route
                        path="/budget"
                        element={<BudgetPage />}
                    />

                    <Route
                        path="/reports"
                        element={<ReportPage />}
                    />

                    <Route
                        path="/categories"
                        element={<Categories />}
                    />

                    <Route
                        path="/settings"
                        element={<Settings />}
                    />

                </Route>

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Routes>

        </BrowserRouter>

    );

}