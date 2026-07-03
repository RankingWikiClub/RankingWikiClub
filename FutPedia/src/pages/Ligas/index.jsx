import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../services/supabase";

function Ligas() {
  const [ligas, setLigas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  async function carregarLigas() {
    setCarregando(true);

    const { data, error } = await supabase
      .from("competicoes")
      .select("*")
      .order("nome", { ascending: true });

    if (error) {
      console.error("Erro ao carregar competições:", error);
      setLigas([]);
    } else {
      setLigas(data || []);
    }

    setCarregando(false);
  }

  useEffect(() => {
    carregarLigas();
  }, []);

  return (
    <div>
      <h1>🏆 Ligas e Competições</h1>
      <p>Lista de competições cadastradas no banco de dados</p>

      {carregando ? (
        <p>Carregando competições...</p>
      ) : ligas.length === 0 ? (
        <p>Nenhuma competição cadastrada.</p>
      ) : (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Abrangência</th>
              <th>Tipo</th>
            </tr>
          </thead>

          <tbody>
            {ligas.map((liga) => (
              <tr key={liga.id}>
                <td>
                  <Link to={`/competicoes/${liga.id}`}>
                    {liga.nome}
                  </Link>
                </td>
                <td>{liga.abrangencia || "-"}</td>
                <td>{liga.tipo || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Ligas;