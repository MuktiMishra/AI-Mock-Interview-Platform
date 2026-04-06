// Reusable Card Component

export default function Card({ title, children, style = {} }) {
  const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginBottom: "16px",
    ...style,
  };

  const titleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "10px",
  };

  return (
    <div style={cardStyle}>
      {title && <div style={titleStyle}>{title}</div>}
      <div>{children}</div>
    </div>
  );
}