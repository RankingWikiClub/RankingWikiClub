function DataTable({ columns, data, actions }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover table-bordered align-middle bg-white">
        <thead className="table-primary">
          <tr>
            {columns.map((coluna) => (
              <th key={coluna.key}>{coluna.label}</th>
            ))}

            {actions && <th>Ações</th>}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)}>
                Nenhum registro encontrado.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                {columns.map((coluna) => (
                  <td key={coluna.key}>
                    {coluna.render
                      ? coluna.render(item)
                      : item[coluna.key]}
                  </td>
                ))}

                {actions && <td>{actions(item)}</td>}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;