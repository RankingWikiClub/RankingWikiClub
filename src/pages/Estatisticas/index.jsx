import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/cards/Card";

import { listarTimes } from "../../services/timesService";
import { listarPaises } from "../../services/paisesService";
import { listarCompeticoes } from "../../services/competicoesService";
import { listarEdicoes } from "../../services/edicoesService";

function Estatisticas() {
  const [times,setTimes]=useState([]);
  const [paises,setPaises]=useState([]);
  const [competicoes,setCompeticoes]=useState([]);
  const [edicoes,setEdicoes]=useState([]);

  useEffect(()=>{
    async function carregar(){
      const [t,p,c,e]=await Promise.all([
        listarTimes(),
        listarPaises(),
        listarCompeticoes(),
        listarEdicoes()
      ]);
      setTimes(t||[]);
      setPaises(p||[]);
      setCompeticoes(c||[]);
      setEdicoes(e||[]);
    }
    carregar();
  },[]);

  const stats=useMemo(()=>{
    const titulos={};
    const vices={};

    edicoes.forEach(ed=>{
      if(ed.campeao_id){
        titulos[ed.campeao_id]=(titulos[ed.campeao_id]||0)+1;
      }
      if(ed.vice_id){
        vices[ed.vice_id]=(vices[ed.vice_id]||0)+1;
      }
    });

    const maiorCampeaoId=Object.keys(titulos).sort((a,b)=>titulos[b]-titulos[a])[0];
    const maiorViceId=Object.keys(vices).sort((a,b)=>vices[b]-vices[a])[0];

    return{
      totalTimes:times.length,
      totalPaises:paises.length,
      totalCompeticoes:competicoes.length,
      totalEdicoes:edicoes.length,
      maiorCampeao:times.find(t=>String(t.id)===String(maiorCampeaoId)),
      maiorCampeaoQtd:titulos[maiorCampeaoId]||0,
      maiorVice:times.find(t=>String(t.id)===String(maiorViceId)),
      maiorViceQtd:vices[maiorViceId]||0
    };
  },[times,paises,competicoes,edicoes]);

  const Item=({titulo,valor})=>(
    <div className="col-md-3 mb-3">
      <Card>
        <h6>{titulo}</h6>
        <h3>{valor}</h3>
      </Card>
    </div>
  );

  return(
    <div>
      <PageHeader
        title="📈 Estatísticas"
        subtitle="Resumo geral do banco de dados do FutPédia."
      />

      <div className="row">
        <Item titulo="Times" valor={stats.totalTimes}/>
        <Item titulo="Países" valor={stats.totalPaises}/>
        <Item titulo="Competições" valor={stats.totalCompeticoes}/>
        <Item titulo="Edições" valor={stats.totalEdicoes}/>
      </div>

      <div className="row">
        <div className="col-md-6">
          <Card>
            <h5>🏆 Maior Campeão</h5>
            <p><strong>{stats.maiorCampeao?.nome||"-"}</strong></p>
            <p>{stats.maiorCampeaoQtd} títulos</p>
          </Card>
        </div>

        <div className="col-md-6">
          <Card>
            <h5>🥈 Maior Vice</h5>
            <p><strong>{stats.maiorVice?.nome||"-"}</strong></p>
            <p>{stats.maiorViceQtd} vice-campeonatos</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Estatisticas;