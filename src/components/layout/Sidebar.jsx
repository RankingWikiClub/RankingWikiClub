import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaGlobeAmericas,
  FaFlag,
  FaTrophy,
  FaFutbol,
  FaChartBar,
  FaCog,
  FaHistory,
  FaEdit,
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">⚽ FutPédia</div>

      <div className="sidebar-user">
        <div className="avatar">D</div>
        <div>
          <strong>Administrador</strong>
          <small>Online</small>
        </div>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/" end>
          <FaHome /> Dashboard
        </NavLink>

        <NavLink to="/continentes">
          <FaGlobeAmericas /> Continentes
        </NavLink>

        <NavLink to="/paises">
          <FaFlag /> Países
        </NavLink>

        <NavLink to="/times">
          <FaFutbol /> Times
        </NavLink>

        <NavLink to="/competicoes">
          <FaTrophy /> Competições
        </NavLink>

        <NavLink to="/historial-competicoes">
          <FaHistory /> Historial de Competições
        </NavLink>

        {/* NOVA PÁGINA */}
        <NavLink to="/edicoes">
          <FaEdit /> Edições
        </NavLink>

        <NavLink to="/rankings">
          <FaChartBar /> Rankings
        </NavLink>

        <NavLink to="/estatisticas">
          <FaChartBar /> Estatísticas
        </NavLink>

        <NavLink to="/configuracoes">
          <FaCog /> Configurações
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;