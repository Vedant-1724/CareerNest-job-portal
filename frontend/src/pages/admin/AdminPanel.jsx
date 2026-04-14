import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/services';
import { HiOutlineUsers, HiOutlineBriefcase, HiOutlineOfficeBuilding, HiOutlineDocumentText, HiOutlineTrash } from 'react-icons/hi';

function formatLabel(str) {
  if (!str) return '';
  return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function AdminPanel() {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getStats();
      setStats(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await adminAPI.getUsers({ page: 0, size: 100 });
      setUsers(data.content || []);
    } catch (err) { console.error(err); }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await adminAPI.deleteUser(id);
      setMessage('User deleted');
      fetchUsers();
      fetchStats();
    } catch (err) { setMessage('Failed to delete user'); }
  };

  useEffect(() => { if (tab === 'users') fetchUsers(); }, [tab]);

  if (loading) return <div className="page-wrapper"><div className="loading-page"><div className="spinner" /></div></div>;

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>Admin Panel</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Platform Management</div>
        </div>
        <nav className="sidebar-nav">
          <button className={`sidebar-link ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>
            <HiOutlineOfficeBuilding size={18} /> Overview
          </button>
          <button className={`sidebar-link ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
            <HiOutlineUsers size={18} /> Users
          </button>
        </nav>
      </aside>

      <main className="dashboard-content fade-in">
        {message && (
          <div style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', background: 'var(--success-bg)', color: 'var(--success)', fontSize: '14px' }}>
            {message} <button onClick={() => setMessage('')} style={{ float: 'right', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button>
          </div>
        )}

        {tab === 'overview' && stats && (
          <>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: '32px' }}>Platform Overview</h2>
            <div className="stats-grid">
              <div className="glass-card stat-card">
                <div style={{ color: 'var(--primary-light)', marginBottom: '8px' }}><HiOutlineUsers size={24} /></div>
                <div className="stat-value">{stats.totalUsers}</div>
                <div className="stat-label">Total Users</div>
              </div>
              <div className="glass-card stat-card">
                <div style={{ color: 'var(--accent-light)', marginBottom: '8px' }}><HiOutlineBriefcase size={24} /></div>
                <div className="stat-value">{stats.activeJobs}</div>
                <div className="stat-label">Active Jobs</div>
              </div>
              <div className="glass-card stat-card">
                <div style={{ color: 'var(--success)', marginBottom: '8px' }}><HiOutlineDocumentText size={24} /></div>
                <div className="stat-value">{stats.totalApplications}</div>
                <div className="stat-label">Total Applications</div>
              </div>
              <div className="glass-card stat-card">
                <div style={{ color: 'var(--warning)', marginBottom: '8px' }}><HiOutlineOfficeBuilding size={24} /></div>
                <div className="stat-value">{stats.totalCompanies}</div>
                <div className="stat-label">Companies</div>
              </div>
            </div>

            {/* Application Status Breakdown */}
            <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginTop: '48px', marginBottom: '24px' }}>Application Status Breakdown</h3>
            <div className="stats-grid">
              {[
                { label: 'Applied', value: stats.appliedCount, color: 'var(--info)' },
                { label: 'Shortlisted', value: stats.shortlistedCount, color: 'var(--warning)' },
                { label: 'Accepted', value: stats.acceptedCount, color: 'var(--success)' },
                { label: 'Rejected', value: stats.rejectedCount, color: 'var(--error)' },
              ].map(item => (
                <div className="glass-card" style={{ padding: '24px' }} key={item.label}>
                  <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: item.color }}>{item.value}</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginTop: '4px' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'users' && (
          <>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: '24px' }}>User Management</h2>
            <div className="glass-card" style={{ overflow: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Roles</th><th>Joined</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 600 }}>{u.firstName} {u.lastName}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td>{u.roles?.map(r => <span key={r} className="badge badge-primary" style={{ marginRight: '4px' }}>{r.replace('ROLE_', '')}</span>)}</td>
                      <td style={{ color: 'var(--text-tertiary)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(u.id)} title="Delete User">
                          <HiOutlineTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
