function PageHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: "25px" }}>
      <h1 style={{ fontWeight: "bold", marginBottom: "5px" }}>
        {title}
      </h1>

      {subtitle && (
        <p style={{ color: "#6b7280", margin: 0 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default PageHeader;