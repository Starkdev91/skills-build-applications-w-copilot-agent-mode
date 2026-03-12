import { useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';

import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const apiRootUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/`
  : 'http://localhost:8000/api/';
const logoUrl = `${process.env.PUBLIC_URL}/octofitapp-small.png`;

const navigationItems = [
  { label: 'Users', path: '/users' },
  { label: 'Teams', path: '/teams' },
  { label: 'Activities', path: '/activities' },
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'Workouts', path: '/workouts' },
];

function navLinkClassName({ isActive }) {
  return `nav-link octofit-nav-link${isActive ? ' active' : ''}`;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg octofit-navbar sticky-top">
        <div className="container py-2">
          <NavLink className="navbar-brand brand-lockup text-white" to="/users">
            <img alt="OctoFit logo" className="brand-mark" src={logoUrl} />
            <span className="brand-copy">
              <span className="brand-eyebrow">Fitness Command Center</span>
              <span className="brand-title">OctoFit Tracker</span>
            </span>
          </NavLink>
          <button
            aria-controls="octofit-navigation"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            className="navbar-toggler"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className={`collapse navbar-collapse${menuOpen ? ' show' : ''}`} id="octofit-navigation">
            <ul className="navbar-nav ms-auto gap-lg-2">
              {navigationItems.map((item) => (
                <li className="nav-item" key={item.path}>
                  <NavLink className={navLinkClassName} onClick={() => setMenuOpen(false)} to={item.path}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <main className="container py-4 py-lg-5">
        <section className="hero-panel rounded-4 p-4 p-lg-5 mb-4 shadow-sm">
          <div className="row align-items-center g-4">
            <div className="col-lg-8 text-start">
              <p className="text-uppercase small fw-semibold tracking-wide mb-2 text-secondary">
                Connected React Frontend
              </p>
              <h1 className="display-6 fw-bold mb-3">Live OctoFit dashboards backed by the Django REST API</h1>
              <p className="lead text-secondary mb-0">
                Use the navigation to browse users, teams, activities, leaderboard standings, and workouts fetched from the backend.
              </p>
              <div className="hero-actions d-flex flex-wrap gap-3 mt-4">
                <NavLink className="btn btn-primary btn-lg" to="/activities">
                  Explore Activities
                </NavLink>
                <a className="btn btn-outline-dark btn-lg" href={apiRootUrl} rel="noreferrer" target="_blank">
                  Open API Root
                </a>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="stat-card rounded-4 p-4 h-100">
                <div className="small text-uppercase fw-semibold text-secondary mb-2">Backend Source</div>
                <div className="fw-semibold">Codespace-aware API routing</div>
                <div className="text-secondary small mt-2">
                  Components automatically use the forwarded HTTPS backend in Codespaces and localhost during local development.
                </div>
                <a className="api-root-link mt-3 d-inline-flex align-items-center" href={apiRootUrl} rel="noreferrer" target="_blank">
                  {apiRootUrl}
                </a>
              </div>
            </div>
          </div>
        </section>

        <Routes>
          <Route element={<Navigate replace to="/users" />} path="/" />
          <Route element={<Users />} path="/users" />
          <Route element={<Teams />} path="/teams" />
          <Route element={<Activities />} path="/activities" />
          <Route element={<Leaderboard />} path="/leaderboard" />
          <Route element={<Workouts />} path="/workouts" />
          <Route element={<Navigate replace to="/users" />} path="*" />
        </Routes>
      </main>
    </div>
  );
}

export default App;
