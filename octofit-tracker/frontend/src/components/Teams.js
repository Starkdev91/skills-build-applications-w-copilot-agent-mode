import { useEffect, useState } from 'react';

const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : 'http://localhost:8000/api';
const endpoint = `${apiBaseUrl}/teams/`;

function normalizeCollection(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
}

function memberCount(members) {
  return Array.isArray(members) ? members.length : 0;
}

function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTeams() {
      console.log('[Teams] REST endpoint:', endpoint);

      try {
        const response = await fetch(endpoint, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        console.log('[Teams] fetched data:', payload);
        setTeams(normalizeCollection(payload));
      } catch (loadError) {
        if (loadError.name === 'AbortError') {
          return;
        }

        console.error('[Teams] fetch error:', loadError);
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadTeams();

    return () => controller.abort();
  }, []);

  return (
    <section className="data-panel rounded-4 shadow-sm p-4">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
        <div>
          <h2 className="h3 section-title">Teams</h2>
          <p className="section-copy mb-0">Team rosters and group structure from the backend.</p>
        </div>
        <span className="endpoint-badge">{endpoint}</span>
      </div>

      {loading ? <div className="empty-state">Loading teams...</div> : null}
      {error ? <div className="alert alert-danger mb-0">Unable to load teams: {error}</div> : null}

      {!loading && !error && teams.length === 0 ? (
        <div className="empty-state">No teams were returned by the API.</div>
      ) : null}

      {!loading && !error && teams.length > 0 ? (
        <div className="row g-3">
          {teams.map((team) => (
            <div className="col-md-6 col-xl-4" key={team.id ?? team.name}>
              <article className="workout-card rounded-4 p-4 h-100">
                <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                  <h3 className="h5 mb-0">{team.name ?? 'Unnamed team'}</h3>
                  <span className="badge text-bg-dark">{memberCount(team.members)} members</span>
                </div>
                <div className="text-secondary small">
                  {Array.isArray(team.members) && team.members.length > 0
                    ? `Members: ${team.members.join(', ')}`
                    : 'No members returned in this response.'}
                </div>
              </article>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default Teams;