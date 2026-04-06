// Reusable Input Component

export default function Input({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  error,
}) {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    marginBottom: "12px",
  };

  const inputStyle = {
    padding: "10px",
    borderRadius: "6px",
    border: error ? "1px solid red" : "1px solid #ccc",
    outline: "none",
  };

  const labelStyle = {
    marginBottom: "4px",
    fontWeight: "500",
  };

  const errorStyle = {
    color: "red",
    fontSize: "12px",
    marginTop: "4px",
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={inputStyle}
      />

      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
}