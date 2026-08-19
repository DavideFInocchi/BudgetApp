
import { useReport } from "../../hooks/useReport";
import { useState } from "react";

import ReportPeriodSlider from "./ReportPeriodSlider";
import ReportMonthlyBalanceChart
    from "./ReportMonthlyBalanceChart";
import AppStatCard from "../../components/ui/AppStatCard";

export default function Reports() {

    const [selectedPeriod, setSelectedPeriod] = useState(null);

    const {
        periods,
        period,
        summary,
        isLoading,
        error
    } = useReport(selectedPeriod);

    const balanceDistribution =
        summary?.balanceDistribution;

    const percentile =
        balanceDistribution?.monthlyPercentile;

    const percentileDescription =
        balanceDistribution?.percentileDescription;
    return (

        <div className="page">

            <h1>Reports</h1>
            
            <p>
                <ReportPeriodSlider
                    periods={periods}
                    from={period?.from}
                    to={period?.to}
                    onChange={setSelectedPeriod}
                />
            </p>

            <div className="row g-4 mb-4">

                <div className="col-12 col-sm-6 col-xl-3">

                    <AppStatCard
                        title="Entrate"
                        value={summary?.income ?? 0}
                        icon="arrow-down-left"
                        variant="success"
                    />

                </div>

                <div className="col-12 col-sm-6 col-xl-3">

                    <AppStatCard
                        title="Uscite"
                        value={summary?.expenses ?? 0}
                        icon="arrow-up-right"
                        variant="danger"
                    />

                </div>

                <div className="col-12 col-sm-6 col-xl-3">

                    <AppStatCard
                        title="Saldo"
                        value={summary?.balance ?? 0}
                        icon="wallet2"
                        variant={
                            (summary?.balance ?? 0) >= 0
                                ? "success"
                                : "danger"
                        }
                    />

                </div>

                <div className="col-12 col-sm-6 col-xl-3">

                    <AppStatCard
                        title="Saldo medio mensile"
                        value={summary?.averageMonthlyBalance ?? 0}
                        icon="graph-up"
                        variant={
                            (summary?.averageMonthlyBalance ?? 0) >= 0
                                ? "success"
                                : "danger"
                        }
                    />

                </div>
                    {percentile !== null &&
                        percentile !== undefined && (

                        <div className="mb-4">

                            <div className="text-muted small">
                                Posizione rispetto allo storico
                            </div>

                            <div className="d-flex align-items-baseline gap-2">

                                <strong className="fs-3">
                                    {Math.round(percentile)}° percentile
                                </strong>

                            </div>

                            <div className="text-muted small">
                                {percentileDescription}
                            </div>

                        </div>

                    )}
                    <ReportMonthlyBalanceChart

                        distribution={
                            summary?.balanceDistribution?.distribution ?? []
                        }

                        focusMonth={
                            summary?.balanceDistribution?.focusMonth
                        }

                        stats={{
                            daysInRange:
                                summary?.balanceDistribution?.daysInRange ?? 0,

                            daysBelowRange:
                                summary?.balanceDistribution?.daysBelowRange ?? 0,

                            daysAboveRange:
                                summary?.balanceDistribution?.daysAboveRange ?? 0,

                            totalDays:
                                summary?.balanceDistribution?.totalDays ?? 0,

                            percentageInRange:
                                summary?.balanceDistribution?.percentageInRange ?? 0
                        }}

                    />
            </div>

        </div>

        );

}
