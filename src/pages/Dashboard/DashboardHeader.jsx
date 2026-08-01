import AppButton from "../../components/ui/AppButton";
import AppSelect from "../../components/ui/AppSelect";

export default function DashboardHeader({
  period,
  onPeriodChange,
}) {
  return (
    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-4">

      <div>

        <h2 className="fw-bold mb-1">
          Dashboard
        </h2>

        <p className="text-muted mb-0">
          Panoramica delle tue finanze
        </p>

      </div>

      <div className="d-flex gap-2 mt-3 mt-lg-0">

        <AppSelect
            className="w-auto"
            value={period}
            onChange={(e) => onPeriodChange(e.target.value)}
            options={[
                {
                value: "month",
                label: "Mese corrente",
                },
                {
                value: "year",
                label: "Anno corrente",
                },
            ]}
        />

        <AppButton
          icon="plus-lg"
        >
          Nuova transazione
        </AppButton>

      </div>

    </div>
  );
}