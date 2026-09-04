import { useEffect, useState } from "react";

import { getHistoricalFinancialAnalysis } from "../../services/financialAnalysisService";
import { extractFinancialFeatures } from "../../utils/financialAnalysis/featureExtractor";

const ANALYSIS_PERIOD = {
    from: "2025-09-01",
    to: "2026-08-31",
};

export default function FinancialAnalysisPage() {
    const [features, setFeatures] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function loadAnalysis() {
            try {
                const result = await getHistoricalFinancialAnalysis(ANALYSIS_PERIOD);
                const extractedFeatures = extractFinancialFeatures(result.classifiedTransactions);

                if (!cancelled) {
                    setFeatures(extractedFeatures);
                    console.log("[FinancialAnalysis] Historical analysis:", result);
                    console.log("[FinancialAnalysis] Extracted features:", extractedFeatures);
                }
            } catch (loadError) {
                if (!cancelled) {
                    setError(loadError);
                    console.error("[FinancialAnalysis] Error:", loadError);
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
                Step 2A — feature extraction sullo storico 2025-09 / 2026-08.
            </p>

            {error && (
                <div className="alert alert-danger" role="alert">
                    Errore nel caricamento dell'analisi: {error.message}
                </div>
            )}

            {!error && features.length === 0 && <p>Caricamento feature...</p>}

            {features.length > 0 && (
                <div className="table-responsive">
                    <table className="table table-sm table-striped align-middle">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Merchant</th>
                                <th>Categoria</th>
                                <th>Importo</th>
                                <th>Mese</th>
                                <th>Occorrenze</th>
                                <th>Mesi</th>
                                <th>Media</th>
                                <th>Min</th>
                                <th>Max</th>
                            </tr>
                        </thead>
                        <tbody>
                            {features.slice(0, 100).map(feature => (
                                <tr key={feature.transactionId}>
                                    <td>{feature.transactionId}</td>
                                    <td>{feature.merchant || "—"}</td>
                                    <td>{feature.categoryName || "—"}</td>
                                    <td>{feature.amount.toFixed(2)} €</td>
                                    <td>{feature.month || "—"}</td>
                                    <td>{feature.merchantOccurrenceCount}</td>
                                    <td>{feature.merchantMonthCount}</td>
                                    <td>{feature.merchantAverageAmount.toFixed(2)} €</td>
                                    <td>{feature.merchantMinAmount.toFixed(2)} €</td>
                                    <td>{feature.merchantMaxAmount.toFixed(2)} €</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="text-muted small">
                        Visualizzate le prime 100 transazioni dello storico.
                    </p>
                </div>
            )}
        </div>
    );
}
