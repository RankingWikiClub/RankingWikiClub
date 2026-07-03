function TextInput({ label, value, onChange, placeholder, type = "text", required = false }) {
  return (
    <div className="mb-3">
      {label && <label className="form-label">{label}</label>}
      <input
        type={type}
        className="form-control"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

export default TextInput;