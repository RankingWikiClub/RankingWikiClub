import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/cards/Card";
import SelectInput from "../../components/forms/SelectInput";

import { listarTimes } from "../../services/timesService";
import { listarCompeticoes } from "../../services/competicoesService";
import { listarEdicoes } from "../../services/edicoesService";

function Rankings() {
  const [times, setTimes] = useState([]);
  const [competicoes, setCompeticoes] = useState([]);
  const [edicoes, setEdicoes] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("Todos");

  useEffect(() => {
    async function carregar() {
      const [t, c, e] = await Promise.all([
        listarTimes(),
        listarCompeticoes(),
        listarEdicoes(),
      ]);
      setTimes(t || []);
      setCompeticoes(c || []);
      setEdicoes(e || []);
    }
    carregar();
  }, []);

  const ranking = useMemo(() => {
    const mapa = {};

    edicoes.forEach((edicao) => {
      const comp = competicoes.find(c => Number(c.id) === Number(edicao.competicao_id));
      if (!comp) return;

      const tipo = comp.tipo === "Liga" ? "Liga Nacional"
                 : comp.tipo === "Copa" ? "Copa Nacional"
                 : comp.tipo;

      if (filtroTipo !== "Todos" && tipo !== filtroTipo) return;

      const id = edicao.campeao_id;
      if (!id) return;

      const time = times.find(t => Number(t.id) === Number(id));
      if (!time) return;

      if (!mapa[id]) {
        mapa[id] = {
          id: time.id,
          nome: time.nome,
          escudo: time.escudo,
          titulos: 0,
        };
      }
      mapa[id].titulos++;
    });

    return Object.values(mapa).sort((a,b)=>
      b.titulos-a.titulos || a.nome.localeCompare(b.nome)
    );
  }, [times, competicoes, edicoes, filtroTipo]);

  return (
    <div>
      <PageHeader
        title="📊 Rankings"
        subtitle="Ranking geral de títulos do FutPédia."
      />

      <Card>
        <div className="row">
          <div className="col-md-4">
            <SelectInput
              label="Tipo"
              value={filtroTipo}
              onChange={(e)=>setFiltroTipo(e.target.value)}
              options={[
                {id:"Todos",nome:"Todos"},
                {id:"Liga Nacional",nome:"Liga Nacional"},
                {id:"Copa Nacional",nome:"Copa Nacional"},
                {id:"Estadual",nome:"Estadual"},
                {id:"Continental",nome:"Continental"},
                {id:"Mundial",nome:"Mundial"},
              ]}
            />
          </div>
        </div>
      </Card>

      <Card>
        <h5>🏆 Maiores Campeões</h5>

        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Time</th>
                <th>Títulos</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((item,index)=>(
                <tr key={item.id}>
                  <td>{index+1}</td>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      {item.escudo && (
                        <img
                          src={item.escudo}
                          alt={item.nome}
                          style={{width:32,height:32,objectFit:"contain"}}
                        />
                      )}
                      <Link to={`/times/${item.id}`}>{item.nome}</Link>
                    </div>
                  </td>
                  <td><strong>{item.titulos}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default Rankings;