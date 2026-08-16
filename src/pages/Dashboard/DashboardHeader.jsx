import AppButton from "../../components/ui/AppButton";
import AppSelect from "../../components/ui/AppSelect";



export default function DashboardHeader({
  period,
  periods,
  onPeriodChange,
  onNewTransaction,
}) {

  return (
    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-3">

      <div>
        <h2 className="fw-bold mb-0 fs-3">
            Dashboard
        </h2>

        <p className="text-muted mb-0">
          Panoramica delle tue finanze
        </p>

      </div>

      <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">

      <AppSelect
          wrapperClassName="dashboard-period-select-wrapper"  
          className="w-auto dashboard-period-select"

          value={period?.key ?? ""}

          onChange={(e) => {

              const selected = periods.find(

                  p => p.key === e.target.value

              );

              if (selected) {

                  onPeriodChange(selected);

              }

          }}

          options={

              periods.map(period => ({

                  value: period.key,

                  label: period.label,

              }))

          }

      />

        <AppButton
          icon="plus-lg"
          className="dashboard-new-transaction"
          onClick={onNewTransaction}
        >
            Nuova transazione
        </AppButton>

      </div>

    </div>
  );
}