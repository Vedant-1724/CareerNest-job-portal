import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineSearch, HiOutlineBriefcase, HiOutlineUserGroup, HiOutlineLightningBolt } from 'react-icons/hi';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="page-wrapper fade-in">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Find Your Dream <span className="highlight">Career</span><br />
            Start Here
          </h1>
          <p>
            CareerNest connects talented professionals with top companies.
            Browse thousands of jobs and internships tailored to your skills.
          </p>
          <div className="hero-actions">
            <Link to="/jobs" className="btn btn-primary btn-lg">
              <HiOutlineSearch size={20} /> Browse Jobs
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-secondary btn-lg">
                Get Started Free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container" style={{ padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, marginBottom: '12px' }}>
            Why <span style={{ color: 'var(--primary-light)' }}>CareerNest</span>?
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            Everything you need to launch your career or find the perfect candidate.
          </p>
        </div>

        <div className="stats-grid" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
            <div style={{ background: 'var(--primary-glow)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--primary-light)' }}>
              <HiOutlineBriefcase size={28} />
            </div>
            <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: '8px' }}>Smart Job Search</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              Filter by keyword, location, salary, and experience to find your perfect match.
            </p>
          </div>
          <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
            <div style={{ background: 'var(--accent-glow)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--accent-light)' }}>
              <HiOutlineUserGroup size={28} />
            </div>
            <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: '8px' }}>Recruiter Tools</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              Post jobs, manage applicants, and find the right talent for your team.
            </p>
          </div>
          <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
            <div style={{ background: 'var(--success-bg)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--success)' }}>
              <HiOutlineLightningBolt size={28} />
            </div>
            <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: '8px' }}>Track Progress</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              Monitor your applications in real-time: Applied, Shortlisted, Accepted.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '60px 24px', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginBottom: '12px' }}>
          Ready to get started?
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Join thousands of professionals using CareerNest.
        </p>
        <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
      </section>
    </div>
  );
}
