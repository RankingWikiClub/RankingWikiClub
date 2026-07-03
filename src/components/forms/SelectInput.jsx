function SelectInput({
  label,
  value,
  onChange,
  options = [],
  children,
  required = false,
  disabled = false,
  placeholder = "Selecione...",
}) {
  return (
    <div className="mb-3">
      {label && <label className="form-label">{label}</label>}

      <select
        className="form-select"
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.nome}
          </option>
        ))}

        {children}
      </select>
    </div>
  );
}

export default SelectInput;