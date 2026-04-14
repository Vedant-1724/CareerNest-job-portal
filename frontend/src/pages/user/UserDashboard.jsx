import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { applicationAPI, userAPI, resumeAPI } from '../../api/services';
import { HiOutlineBriefcase, HiOutlineDocumentText, HiOutlineUser, HiOutlineCloudUpload } from 'react-icons/hi';

function formatLabel(str) {
  if (!str) return '';
  return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const STATUS_BADGE = {
  APPLIED: 'badge-info',
  REVIEWED: 'badge-primary',
  SHORTLISTED: 'badge-warning',
  ACCEPTED: 'badge-success',
  REJECTED: 'badge-error',
};

export default function UserDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', phone: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appRes, profileRes] = await Promise.all([
        applicationAPI.getMyApplications({ page: 0, size: 50 }),
        userAPI.getProfile(),
      ]);
      setApplications(appRes.data.content || []);
      setProfile(profileRes.data);
      setProfileForm({
        firstName: profileRes.data.firstName || '',
        lastName: profileRes.data.lastName || '',
        phone: profileRes.data.phone || '',
        bio: profileRes.data.bio || '',
      });
      try {
        const resumeRes = await resumeAPI.getMy();
        setResume(resumeRes.data);
      } catch (e) { /* no resume yet */ }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await resumeAPI.upload(file);
      setResume(data);
      setMessage('Resume uploaded successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await userAPI.updateProfile(profileForm);
      setProfile(data);
      setMessage('Profile updated!');
    } catch (err) {
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-wrapper"><div className="loading-page"><div className="spinner" /></div></div>;

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>{user?.firstName} {user?.lastName}</div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>{user?.email}</div>
        </div>
        <nav className="sidebar-nav">
          <button className={`sidebar-link ${tab === 'applications' ? 'active' : ''}`} onClick={() => setTab('applications')}>
            <HiOutlineBriefcase size={18} /> My Applications
          </button>
          <button className={`sidebar-link ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
            <HiOutlineUser size={18} /> Profile
          </button>
          <button className={`sidebar-link ${tab === 'resume' ? 'active' : ''}`} onClick={() => setTab('resume')}>
            <HiOutlineDocumentText size={18} /> Resume
          </button>
        </nav>
      </aside>

      <main className="dashboard-content fade-in">
        {message && (
          <div style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', background: 'var(--success-bg)', color: 'var(--success)', fontSize: '14px' }}>
            {message}
            <button onClick={() => setMessage('')} style={{ float: 'right', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button>
          </div>
        )}

        {/* Applications Tab */}
        {tab === 'applications' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>My Applications</h2>
              <Link to="/jobs" className="btn btn-primary btn-sm">Browse Jobs</Link>
            </div>

            <div className="stats-grid" style={{ marginBottom: '32px' }}>
              {['APPLIED', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'].map(status => (
                <div className="glass-card stat-card" key={status}>
                  <div className="stat-value">{applications.filter(a => a.status === status).length}</div>
                  <div className="stat-label">{formatLabel(status)}</div>
                </div>
              ))}
            </div>

            {applications.length === 0 ? (
              <div className="empty-state">
                <h3>No applications yet</h3>
                <p>Start by browsing available jobs</p>
                <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '16px' }}>Browse Jobs</Link>
              </div>
            ) : (
              <div className="glass-card" style={{ overflow: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Company</th>
                      <th>Status</th>
                      <th>Applied On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.id}>
                        <td><Link to={`/jobs/${app.jobId}`} style={{ fontWeight: 600 }}>{app.jobTitle}</Link></td>
                        <td style={{ color: 'var(--text-secondary)' }}>{app.companyName}</td>
                        <td><span className={`badge ${STATUS_BADGE[app.status] || 'badge-info'}`}>{formatLabel(app.status)}</span></td>
                        <td style={{ color: 'var(--text-tertiary)' }}>{new Date(app.appliedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Profile Tab */}
        {tab === 'profile' && (
          <>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: '24px' }}>Edit Profile</h2>
            <div className="glass-card" style={{ padding: '32px', maxWidth: '600px' }}>
              <form onSubmit={handleSaveProfile} className="auth-form">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input className="form-input" value={profileForm.firstName} onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input className="form-input" value={profileForm.lastName} onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={profileForm.phone} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea className="form-textarea" value={profileForm.bio} onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})} placeholder="Tell us about yourself..." />
                </div>
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </>
        )}

        {/* Resume Tab */}
        {tab === 'resume' && (
          <>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: '24px' }}>My Resume</h2>
            <div className="glass-card" style={{ padding: '32px', maxWidth: '500px' }}>
              {resume ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <HiOutlineDocumentText size={32} style={{ color: 'var(--primary-light)' }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{resume.fileName}</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                        {(resume.fileSize / 1024).toFixed(1)} KB · Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>No resume uploaded yet</p>
              )}
              <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
                <HiOutlineCloudUpload size={18} /> {uploading ? 'Uploading...' : (resume ? 'Replace Resume' : 'Upload Resume (PDF)')}
                <input type="file" accept=".pdf" onChange={handleUploadResume} style={{ display: 'none' }} disabled={uploading} />
              </label>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
