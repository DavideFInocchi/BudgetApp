import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";

import Dashboard from "./pages/Dashboard";
import Budget from "./pages/Budget";
import Reports from "./pages/Reports";
import Categories from "./pages/Categories";
import Settings from "./pages/Settings";
import TransactionsPage from "./pages/Transactions/TransactionsPage";

export default function Router() {

    return (

        <BrowserRouter>

            <Routes>

                <Route element={<Layout />}>

                    <Route path="/" element={<Dashboard />} />

                    <Route
                        path="/transactions"
                        element={<TransactionsPage />}
                    />

                    <Route
                        path="/budget"
                        element={<Budget />}
                    />

                    <Route
                        path="/reports"
                        element={<Reports />}
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