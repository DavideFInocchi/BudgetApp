import { useReport } from "../../hooks/useReport";
import { useState } from "react";

import ReportPeriodSlider from "./ReportPeriodSlider";
import ReportMonthlyBalanceChart
    from "./ReportMonthlyBalanceChart";

import ReportPeriodComparisonSankey 
    from "./ReportPeriodComparisonSankey";
import AppStatCard from "../../components/ui/AppStatCard";

import { useProjection }
    from "../../hooks/useProjection";
import ReportProjection
    from "./ReportProjection";
import { useProjectionPeriods }
    from "../../hooks/useProjectionPeriods";

import { useReportFocus }
    from "../../hooks/useReportFocus";

import { useReportComparison }
    from "../../hooks/useReportComparison";



export default function Reports() {

    // ==========================================
    // PERIODO PRINCIPALE DEL REPORT
    // ==========================================

    const [
        selectedPeriod,
        setSelectedPeriod
    ] = useState(null);

    const {
        periods,
        period,
        summary,
        isLoading,
        error
    } = useReport(
        selectedPeriod
    );
    const [
        comparisonPeriodA,
        setComparisonPeriodA
    ] = useState(null);

    const [
        comparisonPeriodB,
        setComparisonPeriodB
    ] = useState(null);

    // ==========================================
    // MESE FOCUS DEL GRAFICO STATISTICO
    // ==========================================

    const [
        selectedFocusMonth,
        setSelectedFocusMonth
    ] = useState(null);

    const defaultFocusMonth =
        periods.at(-1)?.slice(0, 7) ?? null;

    const focusMonth =
        selectedFocusMonth ??
        defaultFocusMonth;

    const {
        data: focusDistribution
    } = useReportFocus(
        focusMonth
    );

    const availableComparisonPeriods =
        periods ?? [];

    const defaultComparisonPeriodB =
        comparisonPeriodB ??
        availableComparisonPeriods.at(-1) ??
        null;

    const defaultComparisonPeriodA =
        comparisonPeriodA ??
        (
            availableComparisonPeriods.length > 1
                ? availableComparisonPeriods[
                    availableComparisonPeriods.length - 2
                ]
                : null
        );
    const {
        transactionsA,
        transactionsB
    } = useReportComparison(
        defaultComparisonPeriodA,
        defaultComparisonPeriodB
    );
    // ==========================================
    // PROIEZIONE
    // ==========================================

    const [
        selectedProjectionPeriod,
        setSelectedProjectionPeriod
    ] = useState(null);

    const {
        data: projectionPeriods
    } = useProjectionPeriods();

    const availablePeriods =
        projectionPeriods ?? [];

    const defaultProjectionPeriod =
        availablePeriods.length > 0
            ? {
                from:
                    availablePeriods[
                        Math.max(
                            availablePeriods.length - 6,
                            0
                        )
                    ],

                to:
                    availablePeriods.at(-1)
            }
            : null;

    const projectionPeriod =
        selectedProjectionPeriod ??
        defaultProjectionPeriod;

    const {
        data: projection
    } = useProjection(
        projectionPeriod
    );


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div className="page report-page">
            <h1 className="mb-3">Reports</h1>

            {/* ==================================
                PERIODO PRINCIPALE
            ================================== */}

            <div className="mb-3 report-main-period">

                <ReportPeriodSlider

                    periods={periods}

                    from={period?.from}

                    to={period?.to}

                    onChange={
                        setSelectedPeriod
                    }

                />

            </div>


            {/* ==================================
                SUMMARY
            ================================== */}

            <div className="row g-3 mb-3">
                <div className="col-12 col-sm-6 col-xl-3">

                    <AppStatCard
                        title="Entrate"
                        value={
                            summary?.income ?? 0
                        }
                        icon="arrow-down-left"
                        variant="success"
                    />

                </div>


                <div className="col-12 col-sm-6 col-xl-3">

                    <AppStatCard
                        title="Uscite"
                        value={
                            summary?.expenses ?? 0
                        }
                        icon="arrow-up-right"
                        variant="danger"
                    />

                </div>


                <div className="col-12 col-sm-6 col-xl-3">

                    <AppStatCard
                        title="Saldo"
                        value={
                            summary?.balance ?? 0
                        }
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
                        value={
                            summary?.averageMonthlyBalance ?? 0
                        }
                        icon="graph-up"
                        variant={
                            (
                                summary?.averageMonthlyBalance ?? 0
                            ) >= 0
                                ? "success"
                                : "danger"
                        }
                    />

                </div>

            </div>


            {/* ==================================
                DISTRIBUZIONE STORICA
            ================================== */}
            <div className="report-section">
                <ReportMonthlyBalanceChart

                    distribution={
                        focusDistribution?.distribution ?? []
                    }

                    focusMonth={
                        focusDistribution?.focusMonth
                    }

                    stats={{

                        daysInRange:
                            focusDistribution?.daysInRange ?? 0,

                        daysBelowRange:
                            focusDistribution?.daysBelowRange ?? 0,

                        daysAboveRange:
                            focusDistribution?.daysAboveRange ?? 0,

                        totalDays:
                            focusDistribution?.totalDays ?? 0,

                        percentageInRange:
                            focusDistribution?.percentageInRange ?? 0

                    }}

                    percentile={
                        focusDistribution?.monthlyPercentile
                    }

                    percentileDescription={
                        focusDistribution?.percentileDescription
                    }

                    focusPeriods={
                        periods
                    }

                    onFocusMonthChange={
                        setSelectedFocusMonth
                    }

                />

            </div>
            
            {/* ==================================
                PROIEZIONE
            ================================== */}
            <div className="report-section">
                <ReportProjection

                    historical={
                        projection?.historical ?? []
                    }

                    projection={
                        projection?.projection ?? []
                    }

                    projectionPeriods={
                        availablePeriods
                    }

                    projectionFrom={
                        projectionPeriod?.from
                    }

                    projectionTo={
                        projectionPeriod?.to
                    }

                    onProjectionPeriodChange={
                        setSelectedProjectionPeriod
                    }

                />
            </div>
            <ReportPeriodComparisonSankey

                periodA={
                    defaultComparisonPeriodA
                }

                periodB={
                    defaultComparisonPeriodB
                }

                periods={
                    availableComparisonPeriods
                }

                onPeriodAChange={
                    setComparisonPeriodA
                }

                onPeriodBChange={
                    setComparisonPeriodB
                }

                transactionsA={
                    transactionsA
                }

                transactionsB={
                    transactionsB
                }

            />

            
        </div>

    );

}