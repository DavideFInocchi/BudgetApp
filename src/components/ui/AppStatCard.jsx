// src/components/ui/AppStatCard.jsx

import AppCard from "./AppCard";
import { formatCurrency } from "../../utils/currency";

export default function AppStatCard({
  title,
  value = 0,
  type = "currency",
  icon,
  variant = "primary",
}) {

  const formattedValue =
    type === "currency"
      ? formatCurrency(value)
      : new Intl.NumberFormat("it-IT").format(value);

  return (

<AppCard
    className={`app-stat-card border-start border-4 border-${variant}`}
>

  <div className="app-stat-card__content">

      {icon && (
          <div
              className="app-stat-card__icon"
              style={{
                  background: `var(--bs-${variant}-bg-subtle)`
              }}
          >
              <i className={`bi bi-${icon} text-${variant}`} />
          </div>
      )}

      <div className="app-stat-card__info">

          <div className="app-stat-card__title">
              {title}
          </div>

          <div className="app-stat-card__value">
              {formattedValue}
          </div>

      </div>

  </div>

</AppCard>

  );

}