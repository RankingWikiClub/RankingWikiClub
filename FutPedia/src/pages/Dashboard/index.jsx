import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h1>🌐 Bem-vindo ao FutPédia</h1>
      <p>Sistema Mundial de Estatísticas do Futebol</p>

      <div className="dashboard-cards">
        <Link to="/continentes" className="dashboard-card">
          <div className="icon">🌎</div>
          <h2>8</h2>
          <p>Continentes</p>
        </Link>

        <Link to="/paises" className="dashboard-card">
          <div className="icon">🚩</div>
          <h2>3</h2>
          <p>Países</p>
        </Link>

        <Link to="/ligas" className="dashboard-card">
          <div className="icon">🏆</div>
          <h2>33</h2>
          <p>Ligas</p>
        </Link>

        <Link to="/times" className="dashboard-card">
          <div className="icon">⚽</div>
          <h2>31</h2>
          <p>Times</p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;