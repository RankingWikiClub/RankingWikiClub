import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";
import Continentes from "../pages/Continentes";
import Paises from "../pages/Paises";
import Times from "../pages/Times";
import TimeDetalhes from "../pages/TimeDetalhes";
import Competicoes from "../pages/Competicoes";
import CompeticaoDetalhes from "../pages/CompeticaoDetalhes";
import HistorialCompeticoes from "../pages/HistorialCompeticoes";
import Edicoes from "../pages/Edicoes"; // NOVO
import Rankings from "../pages/Rankings";
import Estatisticas from "../pages/Estatisticas";
import Configuracoes from "../pages/Configuracoes";
import Comparador from "../pages/Comparador";
import Ligas from "../pages/Ligas";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="continentes" element={<Continentes />} />
          <Route path="paises" element={<Paises />} />

          <Route path="times" element={<Times />} />
          <Route path="times/:id" element={<TimeDetalhes />} />

          <Route path="competicoes" element={<Competicoes />} />
          <Route path="competicoes/:id" element={<CompeticaoDetalhes />} />
          <Route path="comparador" element={<Comparador />} />
          <Route path="ligas" element={<Ligas/>} />

          <Route path="historial-competicoes"
            element={<HistorialCompeticoes />}
          />

          {/* NOVA PÁGINA */}
          <Route path="edicoes" element={<Edicoes />} />

          <Route path="rankings" element={<Rankings />} />
          <Route path="estatisticas" element={<Estatisticas />} />
          <Route path="configuracoes" element={<Configuracoes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;