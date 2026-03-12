import { useEffect, useState } from 'react';

const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : 'http://localhost:8000/api';
const endpoint = `${apiBaseUrl}/activities/`;

function normalizeCollection(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
}

function formatUserValue(userValue) {
  if (typeof userValue === 'string' || typeof userValue === 'number') {
    return userValue;
  }

  if (userValue && typeof userValue === 'object') {
    return userValue.name ?? userValue.email ?? JSON.stringify(userValue);
  }

  return 'Unknown user';
}

function Activities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadActivities() {
      console.log('[Activities] REST endpoint:', endpoint);

      try {
        const response = await fetch(endpoint, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        console.log('[Activities] fetched data:', payload);
        setActivities(normalizeCollection(payload));
      } catch (loadError) {
        if (loadError.name === 'AbortError') {
          return;
        }

        console.error('[Activities] fetch error:', loadError);
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadActivities();

    return () => controller.abort();
  }, []);

  return (
    <section className="data-panel rounded-4 shadow-sm p-4">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
        <div>
          <h2 className="h3 section-title">Activities</h2>
          <p className="section-copy mb-0">Workout sessions and logged movement pulled from the REST API.</p>
        </div>
        <span className="endpoint-badge">{endpoint}</span>
      </div>

      {loading ? <div className="empty-state">Loading activities...</div> : null}
      {error ? <div className="alert alert-danger mb-0">Unable to load activities: {error}</div> : null}

      {!loading && !error && activities.length === 0 ? (
        <div className="empty-state">No activities were returned by the API.</div>
      ) : null}

      {!loading && !error && activities.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Activity</th>
                <th>User</th>
                <th>Duration</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id ?? `${activity.type}-${activity.date}`}>
                  <td className="fw-semibold">{activity.type ?? 'Unnamed activity'}</td>
                  <td>{formatUserValue(activity.user)}</td>
                  <td>{activity.duration ? `${activity.duration} min` : 'N/A'}</td>
                  <td>{activity.date ?? 'No date'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

export default Activities;