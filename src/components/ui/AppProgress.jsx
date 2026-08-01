export default function AppProgress({
  value = 0,
  variant = "success",
}) {
  return (
    <div className="progress app-progress">

      <div
        className={`progress-bar bg-${variant}`}
        style={{
          width: `${Math.min(value, 100)}%`,
        }}
      />

    </div>
  );
}