import { useEffect } from "react";

import { getHistoricalFinancialAnalysis } from "../../services/financialAnalysisService";

const ANALYSIS_PERIOD = {
    from: "2025-09-01",
    to: "2026-08-31",
};

export default function FinancialAnalysisPage() {

    useEffect(() => {
        let cancelled = false;

        async function loadAnalysis() {
            try {
                const result = await getHistoricalFinancialAnalysis(ANALYSIS_PERIOD);

                if (!cancelled) {
                    console.log("[FinancialAnalysis] Historical analysis:", result);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("[FinancialAnalysis] Error:", error);
                }
            }
        }

        loadAnalysis();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="page">
            <h1>Analisi Finanziaria</h1>
            <p className="text-muted">
                Step 1 — dati storici. Apri la console del browser per verificare il risultato.
            </p>
        </div>
    );
}
