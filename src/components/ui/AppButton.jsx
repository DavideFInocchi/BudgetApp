export default function AppButton({
  children,
  variant = "primary",
  type = "button",
  onClick,
  className = "",
  disabled = false,
  icon,
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} app-button ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && (
        <i className={`bi bi-${icon} app-button__icon`} />
      )}

      <span>{children}</span>
    </button>
  );
}