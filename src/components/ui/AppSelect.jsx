export default function AppSelect({
  value,
  onChange,
  options = [],
  className = "",
}) {
  return (
    <select
      className={`form-select app-select ${className}`}
      value={value}
      onChange={onChange}
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}