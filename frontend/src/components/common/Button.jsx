// Reusable Button Component

export default function Button({
  text,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
}) {
  const baseStyle = {
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  };

  const variants = {
    primary: {
      backgroundColor: "#4CAF50",
      color: "white",
    },
    secondary: {
      backgroundColor: "#555",
      color: "white",
    },
    danger: {
      backgroundColor: "#e53935",
      color: "white",
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...baseStyle,
        ...variants[variant],
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {text}
    </button>
  );
}