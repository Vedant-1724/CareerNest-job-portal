import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobAPI, applicationAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineLocationMarker, HiOutlineClock, HiOutlineCurrencyDollar, HiOutlineCalendar, HiOutlineUsers, HiArrowLeft } from 'react-icons/hi';

function formatLabel(str) {
  if (!str) return '';
  return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function formatSalary(min, max) {
  const fmt = (n) => `$${Number(n).toLocaleString()}`;
  if (min && max) return `${fmt(min)} - ${fmt(max)} / year`;
  if (min) return `From ${fmt(min)} / year`;
  if (max) return `Up to ${fmt(max)} / year`;
  return 'Not specified';
}

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isUser } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await jobAPI.getById(id);
        setJob(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    setMessage('');
    try {
      await applicationAPI.apply(id, { coverLetter });
      setApplied(true);
      setShowApplyForm(false);
      setMessage('Application submitted successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="page-wrapper"><div className="loading-page"><div className="spinner" /></div></div>;
  if (!job) return <div className="page-wrapper"><div className="empty-state"><h3>Job not found</h3></div></div>;

  return (
    <div className="page-wrapper fade-in">
      <div className="container" style={{ paddingTop: '32px', paddingBottom: '48px', maxWidth: '900px' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '24px' }}>
          <HiArrowLeft /> Back
        </button>

        <div className="glass-card" style={{ padding: '40px' }}>
          {/* Header */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div className="job-card-company-logo" style={{ width: '64px', height: '64px', fontSize: '24px' }}>
              {job.companyName?.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: '4px' }}>{job.title}</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-base)' }}>{job.companyName}</p>
            </div>
            {user && isUser() && !applied && (
              <button className="btn btn-primary btn-lg" onClick={() => setShowApplyForm(!showApplyForm)}>
                Apply Now
              </button>
            )}
            {applied && <span className="badge badge-success" style={{ fontSize: '14px', padding: '8px 16px' }}>✓ Applied</span>}
          </div>

          {message && (
            <div style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', background: applied ? 'var(--success-bg)' : 'var(--error-bg)', color: applied ? 'var(--success)' : 'var(--error)', fontSize: '14px' }}>
              {message}
            </div>
          )}

          {/* Apply Form */}
          {showApplyForm && (
            <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', background: 'var(--surface-2)' }}>
              <h3 style={{ marginBottom: '12px', fontSize: 'var(--font-size-lg)' }}>Submit Application</h3>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Cover Letter (optional)</label>
                <textarea className="form-textarea" placeholder="Tell the recruiter why you're a great fit..." value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-primary" onClick={handleApply} disabled={applying}>
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
                <button className="btn btn-secondary" onClick={() => setShowApplyForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          {/* Meta */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
            {job.location && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}><HiOutlineLocationMarker size={18} /> {job.location}</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}><HiOutlineClock size={18} /> {formatLabel(job.type)}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)' }}><HiOutlineCurrencyDollar size={18} /> {formatSalary(job.salaryMin, job.salaryMax)}</div>
            {job.deadline && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}><HiOutlineCalendar size={18} /> Deadline: {new Date(job.deadline).toLocaleDateString()}</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}><HiOutlineUsers size={18} /> {job.applicationCount} applicant{job.applicationCount !== 1 ? 's' : ''}</div>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <span className="badge badge-primary">{formatLabel(job.category)}</span>
            {job.experienceLevel && <span className="badge badge-info">{job.experienceLevel}</span>}
          </div>

          {/* Description */}
          <div>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: '12px' }}>Description</h2>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{job.description}</div>
          </div>

          {job.requirements && (
            <div style={{ marginTop: '32px' }}>
              <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: '12px' }}>Requirements</h2>
              <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{job.requirements}</div>
            </div>
          )}

          {/* Footer */}
          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)', fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>
            Posted by {job.postedByName} · {new Date(job.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
