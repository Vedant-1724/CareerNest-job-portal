import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { jobAPI } from '../../api/services';
import { HiOutlineLocationMarker, HiOutlineClock, HiOutlineCurrencyDollar, HiOutlineSearch } from 'react-icons/hi';

const JOB_TYPES = ['', 'FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'FREELANCE'];
const JOB_CATEGORIES = ['', 'INFORMATION_TECHNOLOGY', 'FINANCE', 'MARKETING', 'SALES', 'ENGINEERING', 'DESIGN', 'HUMAN_RESOURCES', 'OPERATIONS', 'HEALTHCARE', 'EDUCATION', 'LEGAL', 'OTHER'];

function formatLabel(str) {
  return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function formatSalary(min, max) {
  if (!min && !max) return null;
  const fmt = (n) => `$${(n / 1000).toFixed(0)}K`;
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max)}`;
}

export default function JobListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const page = parseInt(searchParams.get('page') || '0');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = { page, size: 9 };
      if (keyword) params.keyword = keyword;
      if (location) params.location = location;
      if (type) params.type = type;
      if (category) params.category = category;

      const { data } = keyword || location || type || category
        ? await jobAPI.search(params)
        : await jobAPI.getAll(params);

      setJobs(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, [page, searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (keyword) params.keyword = keyword;
    if (location) params.location = location;
    if (type) params.type = type;
    if (category) params.category = category;
    params.page = '0';
    setSearchParams(params);
  };

  const setPage = (p) => {
    const params = Object.fromEntries(searchParams);
    params.page = String(p);
    setSearchParams(params);
  };

  return (
    <div className="page-wrapper fade-in">
      <div className="container" style={{ paddingTop: '32px', paddingBottom: '48px' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, marginBottom: '8px' }}>
          Browse Jobs
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Discover opportunities that match your skills and aspirations
        </p>

        {/* Search */}
        <form className="search-bar" onSubmit={handleSearch}>
          <HiOutlineSearch size={20} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <input placeholder="Job title, keyword..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          <input placeholder="Location..." value={location} onChange={(e) => setLocation(e.target.value)} style={{ maxWidth: '200px' }} />
          <button className="btn btn-primary" type="submit">Search</button>
        </form>

        {/* Filters */}
        <div className="filter-bar">
          <select className="form-select" value={type} onChange={(e) => { setType(e.target.value); }} style={{ width: 'auto', minWidth: '140px' }}>
            <option value="">All Types</option>
            {JOB_TYPES.filter(Boolean).map(t => <option key={t} value={t}>{formatLabel(t)}</option>)}
          </select>
          <select className="form-select" value={category} onChange={(e) => { setCategory(e.target.value); }} style={{ width: 'auto', minWidth: '180px' }}>
            <option value="">All Categories</option>
            {JOB_CATEGORIES.filter(Boolean).map(c => <option key={c} value={c}>{formatLabel(c)}</option>)}
          </select>
          {(type || category) && (
            <button className="btn btn-secondary btn-sm" onClick={() => { setType(''); setCategory(''); setSearchParams({}); }}>
              Clear Filters
            </button>
          )}
        </div>

        {/* Job Cards */}
        {loading ? (
          <div className="loading-page"><div className="spinner" /></div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <h3>No jobs found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="jobs-grid">
              {jobs.map((job) => (
                <Link to={`/jobs/${job.id}`} key={job.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="glass-card job-card">
                    <div className="job-card-header">
                      <div className="job-card-company">
                        <div className="job-card-company-logo">
                          {job.companyName?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <h3>{job.title}</h3>
                          <div className="job-card-company-name">{job.companyName}</div>
                        </div>
                      </div>
                    </div>
                    <div className="job-card-meta">
                      {job.location && <span className="job-card-meta-item"><HiOutlineLocationMarker /> {job.location}</span>}
                      <span className="job-card-meta-item"><HiOutlineClock /> {formatLabel(job.type)}</span>
                      {formatSalary(job.salaryMin, job.salaryMax) && (
                        <span className="job-card-salary"><HiOutlineCurrencyDollar /> {formatSalary(job.salaryMin, job.salaryMax)}</span>
                      )}
                    </div>
                    <div className="job-card-tags">
                      <span className="badge badge-primary">{formatLabel(job.category)}</span>
                      {job.experienceLevel && <span className="badge badge-info">{job.experienceLevel}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} className={page === i ? 'active' : ''} onClick={() => setPage(i)}>{i + 1}</button>
                ))}
                <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
