import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { jobAPI, companyAPI, applicationAPI } from '../../api/services';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';

function formatLabel(str) {
  if (!str) return '';
  return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const STATUS_BADGE = {
  APPLIED: 'badge-info', REVIEWED: 'badge-primary', SHORTLISTED: 'badge-warning', ACCEPTED: 'badge-success', REJECTED: 'badge-error',
};

const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'FREELANCE'];
const JOB_CATEGORIES = ['INFORMATION_TECHNOLOGY', 'FINANCE', 'MARKETING', 'SALES', 'ENGINEERING', 'DESIGN', 'HUMAN_RESOURCES', 'OPERATIONS', 'HEALTHCARE', 'EDUCATION', 'LEGAL', 'OTHER'];

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [message, setMessage] = useState('');

  const emptyJob = { title: '', description: '', location: '', type: 'FULL_TIME', category: 'INFORMATION_TECHNOLOGY', salaryMin: '', salaryMax: '', experienceLevel: '', requirements: '', companyId: '', deadline: '' };
  const emptyCompany = { name: '', description: '', website: '', location: '', industry: '', companySize: '' };
  const [jobForm, setJobForm] = useState(emptyJob);
  const [companyForm, setCompanyForm] = useState(emptyCompany);
  const [editingJobId, setEditingJobId] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobRes, companyRes] = await Promise.all([
        jobAPI.getMyJobs({ page: 0, size: 100 }),
        companyAPI.getMyCompanies(),
      ]);
      setJobs(jobRes.data.content || []);
      setCompanies(companyRes.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      await companyAPI.create(companyForm);
      setShowCompanyForm(false);
      setCompanyForm(emptyCompany);
      setMessage('Company created!');
      fetchData();
    } catch (err) { setMessage(err.response?.data?.message || 'Failed'); }
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    const payload = { ...jobForm, companyId: Number(jobForm.companyId), salaryMin: jobForm.salaryMin ? Number(jobForm.salaryMin) : null, salaryMax: jobForm.salaryMax ? Number(jobForm.salaryMax) : null, deadline: jobForm.deadline || null };
    try {
      if (editingJobId) {
        await jobAPI.update(editingJobId, payload);
        setMessage('Job updated!');
      } else {
        await jobAPI.create(payload);
        setMessage('Job posted!');
      }
      setShowJobForm(false);
      setJobForm(emptyJob);
      setEditingJobId(null);
      fetchData();
    } catch (err) { setMessage(err.response?.data?.message || 'Failed'); }
  };

  const handleDeleteJob = async (id) => {
    if (!confirm('Delete this job?')) return;
    try { await jobAPI.delete(id); fetchData(); setMessage('Job deleted'); } catch (err) { setMessage('Failed to delete'); }
  };

  const viewApplicants = async (jobId) => {
    setSelectedJob(jobId);
    setTab('applicants');
    try {
      const { data } = await applicationAPI.getJobApplications(jobId, { page: 0, size: 100 });
      setApplicants(data.content || []);
    } catch (err) { console.error(err); }
  };

  const updateAppStatus = async (appId, status) => {
    try {
      await applicationAPI.updateStatus(appId, status);
      viewApplicants(selectedJob);
      setMessage(`Application ${status.toLowerCase()}`);
    } catch (err) { setMessage('Failed to update status'); }
  };

  const editJob = (job) => {
    setJobForm({ title: job.title, description: job.description, location: job.location || '', type: job.type, category: job.category, salaryMin: job.salaryMin || '', salaryMax: job.salaryMax || '', experienceLevel: job.experienceLevel || '', requirements: job.requirements || '', companyId: job.companyId, deadline: '' });
    setEditingJobId(job.id);
    setShowJobForm(true);
  };

  if (loading) return <div className="page-wrapper"><div className="loading-page"><div className="spinner" /></div></div>;

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>{user?.firstName} {user?.lastName}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Recruiter</div>
        </div>
        <nav className="sidebar-nav">
          <button className={`sidebar-link ${tab === 'jobs' ? 'active' : ''}`} onClick={() => setTab('jobs')}>My Jobs</button>
          <button className={`sidebar-link ${tab === 'applicants' ? 'active' : ''}`} onClick={() => setTab('applicants')}>Applicants</button>
          <button className={`sidebar-link ${tab === 'companies' ? 'active' : ''}`} onClick={() => setTab('companies')}>My Companies</button>
        </nav>
      </aside>

      <main className="dashboard-content fade-in">
        {message && (
          <div style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', background: 'var(--success-bg)', color: 'var(--success)', fontSize: '14px' }}>
            {message} <button onClick={() => setMessage('')} style={{ float: 'right', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button>
          </div>
        )}

        {/* Jobs Tab */}
        {tab === 'jobs' && !showJobForm && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>Job Postings</h2>
              <button className="btn btn-primary" onClick={() => { setJobForm(emptyJob); setEditingJobId(null); setShowJobForm(true); }}>
                <HiOutlinePlus /> Post Job
              </button>
            </div>
            {companies.length === 0 && (
              <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', borderColor: 'var(--warning)' }}>
                <p style={{ color: 'var(--warning)' }}>⚠ Create a company first before posting jobs.</p>
                <button className="btn btn-outline btn-sm" style={{ marginTop: '8px' }} onClick={() => setTab('companies')}>Create Company</button>
              </div>
            )}
            {jobs.length === 0 ? (
              <div className="empty-state"><h3>No jobs posted yet</h3></div>
            ) : (
              <div className="glass-card" style={{ overflow: 'auto' }}>
                <table className="data-table">
                  <thead><tr><th>Title</th><th>Company</th><th>Type</th><th>Applicants</th><th>Actions</th></tr></thead>
                  <tbody>
                    {jobs.map(job => (
                      <tr key={job.id}>
                        <td style={{ fontWeight: 600 }}>{job.title}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{job.companyName}</td>
                        <td><span className="badge badge-primary">{formatLabel(job.type)}</span></td>
                        <td>{job.applicationCount}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => viewApplicants(job.id)} title="View Applicants"><HiOutlineEye /></button>
                            <button className="btn btn-secondary btn-sm" onClick={() => editJob(job)} title="Edit"><HiOutlinePencil /></button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteJob(job.id)} title="Delete"><HiOutlineTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Job Form */}
        {tab === 'jobs' && showJobForm && (
          <>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: '24px' }}>{editingJobId ? 'Edit Job' : 'Post New Job'}</h2>
            <div className="glass-card" style={{ padding: '32px', maxWidth: '700px' }}>
              <form onSubmit={handleSaveJob} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Job Title *</label>
                  <input className="form-input" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Company *</label>
                  <select className="form-select" value={jobForm.companyId} onChange={e => setJobForm({...jobForm, companyId: e.target.value})} required>
                    <option value="">Select Company</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Type *</label>
                    <select className="form-select" value={jobForm.type} onChange={e => setJobForm({...jobForm, type: e.target.value})}>
                      {JOB_TYPES.map(t => <option key={t} value={t}>{formatLabel(t)}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select className="form-select" value={jobForm.category} onChange={e => setJobForm({...jobForm, category: e.target.value})}>
                      {JOB_CATEGORIES.map(c => <option key={c} value={c}>{formatLabel(c)}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input className="form-input" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} placeholder="e.g. New York, NY" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group"><label className="form-label">Min Salary ($)</label><input className="form-input" type="number" value={jobForm.salaryMin} onChange={e => setJobForm({...jobForm, salaryMin: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Max Salary ($)</label><input className="form-input" type="number" value={jobForm.salaryMax} onChange={e => setJobForm({...jobForm, salaryMax: e.target.value})} /></div>
                </div>
                <div className="form-group"><label className="form-label">Experience Level</label><input className="form-input" value={jobForm.experienceLevel} onChange={e => setJobForm({...jobForm, experienceLevel: e.target.value})} placeholder="e.g. Entry Level, 3+ years" /></div>
                <div className="form-group"><label className="form-label">Description *</label><textarea className="form-textarea" value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} required style={{ minHeight: '150px' }} /></div>
                <div className="form-group"><label className="form-label">Requirements</label><textarea className="form-textarea" value={jobForm.requirements} onChange={e => setJobForm({...jobForm, requirements: e.target.value})} /></div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-primary" type="submit">{editingJobId ? 'Save Changes' : 'Post Job'}</button>
                  <button className="btn btn-secondary" type="button" onClick={() => setShowJobForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </>
        )}

        {/* Applicants Tab */}
        {tab === 'applicants' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>Applicants</h2>
              {!selectedJob && <p style={{ color: 'var(--text-secondary)' }}>Select a job from the Jobs tab to view applicants</p>}
            </div>
            {applicants.length === 0 ? (
              <div className="empty-state"><h3>No applicants yet</h3><p>Select a job from the Jobs tab to view applicants</p></div>
            ) : (
              <div className="glass-card" style={{ overflow: 'auto' }}>
                <table className="data-table">
                  <thead><tr><th>Applicant</th><th>Email</th><th>Status</th><th>Applied On</th><th>Actions</th></tr></thead>
                  <tbody>
                    {applicants.map(app => (
                      <tr key={app.id}>
                        <td style={{ fontWeight: 600 }}>{app.userName}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{app.userEmail}</td>
                        <td><span className={`badge ${STATUS_BADGE[app.status]}`}>{formatLabel(app.status)}</span></td>
                        <td style={{ color: 'var(--text-tertiary)' }}>{new Date(app.appliedAt).toLocaleDateString()}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            <button className="btn btn-sm" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }} onClick={() => updateAppStatus(app.id, 'SHORTLISTED')}>Shortlist</button>
                            <button className="btn btn-sm" style={{ background: 'var(--success-bg)', color: 'var(--success)' }} onClick={() => updateAppStatus(app.id, 'ACCEPTED')}>Accept</button>
                            <button className="btn btn-sm" style={{ background: 'var(--error-bg)', color: 'var(--error)' }} onClick={() => updateAppStatus(app.id, 'REJECTED')}>Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Companies Tab */}
        {tab === 'companies' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>My Companies</h2>
              <button className="btn btn-primary" onClick={() => setShowCompanyForm(true)}><HiOutlinePlus /> Add Company</button>
            </div>
            {showCompanyForm && (
              <div className="glass-card" style={{ padding: '32px', marginBottom: '24px', maxWidth: '600px' }}>
                <form onSubmit={handleCreateCompany} className="auth-form">
                  <div className="form-group"><label className="form-label">Company Name *</label><input className="form-input" value={companyForm.name} onChange={e => setCompanyForm({...companyForm, name: e.target.value})} required /></div>
                  <div className="form-group"><label className="form-label">Industry</label><input className="form-input" value={companyForm.industry} onChange={e => setCompanyForm({...companyForm, industry: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Location</label><input className="form-input" value={companyForm.location} onChange={e => setCompanyForm({...companyForm, location: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Website</label><input className="form-input" value={companyForm.website} onChange={e => setCompanyForm({...companyForm, website: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={companyForm.description} onChange={e => setCompanyForm({...companyForm, description: e.target.value})} /></div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary" type="submit">Create Company</button>
                    <button className="btn btn-secondary" type="button" onClick={() => setShowCompanyForm(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
            <div className="jobs-grid">
              {companies.map(c => (
                <div className="glass-card" style={{ padding: '24px' }} key={c.id}>
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: '8px' }}>{c.name}</h3>
                  {c.industry && <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>{c.industry}</p>}
                  {c.location && <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)', marginTop: '4px' }}>{c.location}</p>}
                  <div style={{ marginTop: '12px', fontSize: 'var(--font-size-sm)', color: 'var(--primary-light)' }}>{c.jobCount} job{c.jobCount !== 1 ? 's' : ''} posted</div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
