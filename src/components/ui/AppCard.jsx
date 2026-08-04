// src/components/ui/AppCard.jsx

export default function AppCard({
  title,
  subtitle,
  children,
  className = "",
}) {
  return (
    <div className={`card app-card h-100 ${className}`}>

      {(title || subtitle) && (

        <div className="card-header bg-transparent border-0">

          <div className="d-flex justify-content-between align-items-start">

            <div>

              {title && (
                <h5 className="mb-1 fw-semibold">
                  {title}
                </h5>
              )}

              {subtitle && (
                <small className="text-muted">
                  {subtitle}
                </small>
              )}

            </div>

     

          </div>

        </div>

      )}

      <div className="card-body p-4">

        {children}

      </div>

    </div>
  );
}