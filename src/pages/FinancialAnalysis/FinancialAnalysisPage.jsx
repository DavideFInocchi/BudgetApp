import { useEffect } from "react";

import { getHistoricalFinancialAnalysis } from "../../services/financialAnalysisService";
import { extractFinancialFeatures } from "../../utils/financialAnalysis/featureExtractor";

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
                const features = extractFinancialFeatures(result.classifiedTransactions);

                if (!cancelled) {
                    console.log("[FinancialAnalysis] Historical analysis:", result);
                    console.log("[FinancialAnalysis] Extracted features:", features);
                    console.table(
                        features.slice(0, 20).map(feature => ({
                            transactionId: feature.transactionId,
                            merchant: feature.merchant,
                            category: feature.categoryName,
                            amount: feature.amount,
                            month: feature.month,
                            merchantOccurrences: feature.merchantOccurrenceCount,
                            merchantMonths: feature.merchantMonthCount,
                            merchantAverage: feature.merchantAverageAmount,
                            merchantMin: feature.merchantMinAmount,
                            merchantMax: feature.merchantMaxAmount,
                        }))
                    );
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
                Step 2A — feature extraction. Apri la console del browser per verificare il risultato.
            </p>
        </div>
    );
}
