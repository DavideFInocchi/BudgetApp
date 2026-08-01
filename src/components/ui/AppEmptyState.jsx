// src/components/ui/AppEmptyState.jsx

export default function AppEmptyState({
  title = "Nessun dato disponibile",
  description,
  icon = "inbox",
  action,
}) {
  return (
    <div className="text-center py-5">
      <i className={`bi bi-${icon} display-4 text-muted`} />

      <h5 className="mt-3">{title}</h5>

      {description && (
        <p className="text-muted mb-3">
          {description}
        </p>
      )}

      {action}
    </div>
  );
}