function Card({ children }) {
  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body">{children}</div>
    </div>
  );
}

export default Card;