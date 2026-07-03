function Card({ title, children }) {
  return (
    <div className="card shadow-sm mb-3">
      {title && (
        <div className="card-header">
          <strong>{title}</strong>
        </div>
      )}

      <div className="card-body">{children}</div>
    </div>
  );
}

export default Card;