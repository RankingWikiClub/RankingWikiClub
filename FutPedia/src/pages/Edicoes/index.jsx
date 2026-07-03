import { useState } from "react";

import PageHeader from "../../components/ui/PageHeader";
import SelectInput from "../../components/forms/SelectInput";
import Card from "../../components/cards/Card";

import EditarCompeticoes from "./EditarCompeticoes";
import EditarTimes from "./EditarTimes";
import EditarPaises from "./EditarPaises";
import EditarContinentes from "./EditarContinentes";
import EditarCampeoes from "../EditarCampeoes";

function Edicoes() {
  const [tipoEdicao, setTipoEdicao] = useState("competicoes");

  return (
    <div>
      <PageHeader
        title="✏️ Edições"
        subtitle="Edite ou exclua informações cadastradas no FutPédia."
      />

      <Card>
        <div className="row">
          <div className="col-md-4">
            <SelectInput
              label="O que deseja editar?"
              value={tipoEdicao}
              onChange={(e) => setTipoEdicao(e.target.value)}
              options={[
                { id: "competicoes", nome: "Competições" },
                { id: "campeoes", nome: "Campeões e Vices" },
                { id: "times", nome: "Times" },
                { id: "paises", nome: "Países" },
                { id: "continentes", nome: "Continentes" },
              ]}
            />
          </div>
        </div>
      </Card>

      {tipoEdicao === "competicoes" && <EditarCompeticoes />}
      {tipoEdicao === "campeoes" && <EditarCampeoes />}
      {tipoEdicao === "times" && <EditarTimes />}
      {tipoEdicao === "paises" && <EditarPaises />}
      {tipoEdicao === "continentes" && <EditarContinentes />}
    </div>
  );
}

export default Edicoes;