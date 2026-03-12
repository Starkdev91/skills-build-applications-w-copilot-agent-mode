import { useEffect, useState } from 'react';

const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : 'http://localhost:8000/api';
const endpoint = `${apiBaseUrl}/users/`;

function normalizeCollection(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
}

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      console.log('[Users] REST endpoint:', endpoint);

      try {
        const response = await fetch(endpoint, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        console.log('[Users] fetched data:', payload);
        setUsers(normalizeCollection(payload));
      } catch (loadError) {
        if (loadError.name === 'AbortError') {
          return;
        }

        console.error('[Users] fetch error:', loadError);
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();

    return () => controller.abort();
  }, []);

  return (
    <section className="data-panel rounded-4 shadow-sm p-4">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
        <div>
          <h2 className="h3 section-title">Users</h2>
          <p className="section-copy mb-0">Athletes and superheroes synced from the Django REST API.</p>
        </div>
        <span className="endpoint-badge">{endpoint}</span>
      </div>

      {loading ? <div className="empty-state">Loading users...</div> : null}
      {error ? <div className="alert alert-danger mb-0">Unable to load users: {error}</div> : null}

      {!loading && !error && users.length === 0 ? (
        <div className="empty-state">No users were returned by the API.</div>
      ) : null}

      {!loading && !error && users.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Team</th>
                <th>Superhero</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id ?? user.email}>
                  <td className="fw-semibold">{user.name ?? 'Unknown user'}</td>
                  <td>{user.email ?? 'No email'}</td>
                  <td>{user.team ?? 'Unassigned'}</td>
                  <td>{user.is_superhero ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

export default Users;