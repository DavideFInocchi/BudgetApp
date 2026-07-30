import { BALANCE_TYPES } from "../../constants/balanceTypes";

const variants = {
  [BALANCE_TYPES.ORDINARY]: {
    className: "badge text-bg-success",
    label: "Ordinario",
  },
  [BALANCE_TYPES.EXTRAORDINARY]: {
    className: "badge text-bg-warning",
    label: "Straordinario",
  },
};

export default function AppBalanceBadge({ value }) {
  const variant = variants[value];

  if (!variant) {
    return (
      <span className="badge text-bg-secondary">
        {value ?? "-"}
      </span>
    );
  }

  return (
    <span className={variant.className}>
      {variant.label}
    </span>
  );
}