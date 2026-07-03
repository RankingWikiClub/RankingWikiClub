function SelectInput({
  label,
  value,
  onChange,
  options = [],
  optionLabel = "nome",
  optionValue = "id",
  required = false,
}) {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>

      <select
        className="form-select"
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">Selecione...</option>

        {options.map((item) => (
          <option key={item[optionValue]} value={item[optionValue]}>
            {item[optionLabel]}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectInput;