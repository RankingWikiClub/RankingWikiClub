function PrimaryButton({ children, type = "button", onClick }) {
  return (
    <button type={type} onClick={onClick} className="btn btn-primary">
      {children}
    </button>
  );
}

export default PrimaryButton;