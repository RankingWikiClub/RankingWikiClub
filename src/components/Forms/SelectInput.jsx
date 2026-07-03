function SelectInput({ label, value, onChange, children, required = false }) {
  return (
    <div className="mb-3">
      {label && <label className="form-label">{label}</label>}
      <select
        className="form-select"
        value={value}
        onChange={onChange}
        required={required}
      >
        {children}
      </select>
    </div>
  );
}

export default SelectInput;