import { useEffect, useState } from 'react';

const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : 'http://localhost:8000/api';
const endpoint = `${apiBaseUrl}/workouts/`;

function normalizeCollection(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
}

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadWorkouts() {
      console.log('[Workouts] REST endpoint:', endpoint);

      try {
        const response = await fetch(endpoint, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        console.log('[Workouts] fetched data:', payload);
        setWorkouts(normalizeCollection(payload));
      } catch (loadError) {
        if (loadError.name === 'AbortError') {
          return;
        }

        console.error('[Workouts] fetch error:', loadError);
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadWorkouts();

    return () => controller.abort();
  }, []);

  return (
    <section className="data-panel rounded-4 shadow-sm p-4">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
        <div>
          <h2 className="h3 section-title">Workouts</h2>
          <p className="section-copy mb-0">Suggested training sessions pulled from the backend API.</p>
        </div>
        <span className="endpoint-badge">{endpoint}</span>
      </div>

      {loading ? <div className="empty-state">Loading workouts...</div> : null}
      {error ? <div className="alert alert-danger mb-0">Unable to load workouts: {error}</div> : null}

      {!loading && !error && workouts.length === 0 ? (
        <div className="empty-state">No workouts were returned by the API.</div>
      ) : null}

      {!loading && !error && workouts.length > 0 ? (
        <div className="row g-3">
          {workouts.map((workout) => (
            <div className="col-md-6 col-xl-4" key={workout.id ?? workout.name}>
              <article className="workout-card rounded-4 p-4 h-100 shadow-sm">
                <div className="small text-uppercase text-secondary fw-semibold mb-2">
                  Suggested for {workout.suggested_for ?? 'all athletes'}
                </div>
                <h3 className="h5 mb-3">{workout.name ?? 'Unnamed workout'}</h3>
                <p className="text-secondary mb-0">{workout.description ?? 'No workout description provided.'}</p>
              </article>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default Workouts;