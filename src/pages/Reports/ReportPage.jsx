
import { useReport } from "../../hooks/useReport";
import { useEffect, useState } from "react";

import ReportPeriodSlider from "./ReportPeriodSlider";
import reportService from "../../services/reportService";

import AppStatCard from "../../components/ui/AppStatCard";

export default function Reports() {

    const [period, setPeriod] = useState({
        from: null,
        to: null
    });

    const {
        periods,
        summary,
        isLoading,
        error
    } = useReport(period);



    useEffect(() => {

        if (!periods.length)
            return;

        setPeriod(current => {

            if (current.from && current.to)
                return current;

            return {
                from: periods[0],
                to: periods[periods.length - 1]
            };

        });

    }, [periods]);

    //console.log("REPORT PERIOD:", period);
    console.log("REPORT SUMMARY:", summary);
    return (

        <div className="page">

            <h1>Reports</h1>
            
            <p>
                <ReportPeriodSlider
                    periods={periods}
                    from={period.from}
                    to={period.to}
                    onChange={setPeriod}
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

            </div>
        </div>

        );

}
