import { useEffect, useState } from 'react';

const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
  : 'http://localhost:8000/api/leaderboard/';

function normalizeCollection(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
}

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadLeaderboard() {
      console.log('[Leaderboard] REST endpoint:', endpoint);

      try {
        const response = await fetch(endpoint, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        console.log('[Leaderboard] fetched data:', payload);
        const normalized = normalizeCollection(payload).sort(
          (left, right) => (right.points ?? 0) - (left.points ?? 0)
        );
        setLeaderboard(normalized);
      } catch (loadError) {
        if (loadError.name === 'AbortError') {
          return;
        }

        console.error('[Leaderboard] fetch error:', loadError);
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();

    return () => controller.abort();
  }, []);

  return (
    <section className="data-panel rounded-4 shadow-sm p-4">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
        <div>
          <h2 className="h3 section-title">Leaderboard</h2>
          <p className="section-copy mb-0">Team rankings fetched from the backend REST endpoint.</p>
        </div>
        <span className="endpoint-badge">{endpoint}</span>
      </div>

      {loading ? <div className="empty-state">Loading leaderboard...</div> : null}
      {error ? <div className="alert alert-danger mb-0">Unable to load leaderboard: {error}</div> : null}

      {!loading && !error && leaderboard.length === 0 ? (
        <div className="empty-state">No leaderboard entries were returned by the API.</div>
      ) : null}

      {!loading && !error && leaderboard.length > 0 ? (
        <div className="row g-3">
          {leaderboard.map((entry, index) => (
            <div className="col-md-6 col-xl-4" key={entry.id ?? `${entry.team}-${index}`}>
              <article className="workout-card rounded-4 p-4 h-100">
                <div className="small text-uppercase text-secondary fw-semibold mb-2">Rank #{index + 1}</div>
                <h3 className="h4 mb-2">{entry.team ?? 'Unknown team'}</h3>
                <div className="display-6 fw-bold mb-0">{entry.points ?? 0}</div>
                <div className="text-secondary mt-2">Total competition points</div>
              </article>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default Leaderboard;