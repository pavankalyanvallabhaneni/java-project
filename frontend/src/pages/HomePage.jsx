import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  Users, 
  ArrowRight, 
  CheckCircle2,
  Sparkles,
  Award
} from 'lucide-react';
import { jobService } from '../api/jobService';
import JobCard from '../components/jobs/JobCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [jobsRes, catsRes] = await Promise.all([
          jobService.getFeaturedJobs(),
          jobService.getCategories(),
        ]);
        if (jobsRes.data) setFeaturedJobs(jobsRes.data);
        if (catsRes.data) setCategories(catsRes.data);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('keyword', keyword.trim());
    if (location.trim()) params.append('location', location.trim());
    if (category.trim()) params.append('category', category.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  const topCities = [
    { name: 'Bengaluru', title: 'Silicon Valley of India', count: '1,420+ Openings' },
    { name: 'Hyderabad', title: 'Cyberabad Tech Corridor', count: '980+ Openings' },
    { name: 'Pune', title: 'Automotive & IT Heartland', count: '740+ Openings' },
    { name: 'Mumbai', title: 'Financial & FinTech Capital', count: '1,120+ Openings' },
    { name: 'Delhi NCR', title: 'Enterprises & Fast Unicorns', count: '890+ Openings' },
    { name: 'Remote', title: 'Pan-India Work from Home', count: '650+ Openings' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-warm-ivory) 0%, var(--color-cream) 100%)',
        borderBottom: '1px solid var(--color-soft-border)',
        padding: '4rem 0 4.5rem'
      }}>
        <div className="container">
          <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
            {/* Pill Announcement */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--color-white)',
              border: '1px solid var(--color-soft-border)',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.825rem',
              fontWeight: 600,
              color: 'var(--color-deep-maroon)',
              marginBottom: '1.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <Sparkles size={16} style={{ color: 'var(--color-saffron)' }} />
              Connecting Top Indian Tech & Enterprise Talent with Tier-1 Employers
            </div>

            <h1 style={{
              fontSize: 'clamp(2.1rem, 4.5vw, 3.4rem)',
              fontWeight: 800,
              color: 'var(--color-dark-charcoal)',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
              letterSpacing: '-0.8px'
            }}>
              Accelerate Your Career with <br />
              <span style={{ color: 'var(--color-deep-maroon)' }}>Bharat</span>
              <span style={{ color: 'var(--color-saffron)' }}>Hire</span>
            </h1>

            <p style={{
              fontSize: '1.1rem',
              color: 'var(--color-warm-grey)',
              maxWidth: '680px',
              margin: '0 auto 2.25rem',
              lineHeight: 1.6
            }}>
              Directly apply to verified vacancies at leading Indian enterprises, MNCs, and high-growth unicorns with transparent CTCs and direct recruiter updates.
            </p>

            {/* Live Search Card */}
            <form
              onSubmit={handleSearchSubmit}
              style={{
                backgroundColor: 'var(--color-white)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--color-soft-border)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto',
                gap: '0.75rem',
                alignItems: 'center'
              }}
            >
              {/* Keyword */}
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-warm-grey)' }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Job title, Java, DevOps, React..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  style={{ paddingLeft: '38px', border: '1px solid transparent', backgroundColor: 'var(--color-warm-ivory)' }}
                />
              </div>

              {/* Location */}
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-warm-grey)' }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="City (Bengaluru, Pune, Remote)..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ paddingLeft: '38px', border: '1px solid transparent', backgroundColor: 'var(--color-warm-ivory)' }}
                />
              </div>

              {/* Category */}
              <div>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ border: '1px solid transparent', backgroundColor: 'var(--color-warm-ivory)' }}
                >
                  <option value="">All Specializations</option>
                  {categories.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.6rem', fontSize: '0.98rem' }}
              >
                Search Jobs
              </button>
            </form>

            {/* Quick popular searches */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '1.25rem',
              fontSize: '0.825rem',
              color: 'var(--color-warm-grey)'
            }}>
              <span style={{ fontWeight: 600 }}>Popular Searches:</span>
              {['Java 21', 'Spring Boot', 'React.js', 'AWS DevOps', 'Python AI', 'Bengaluru'].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (item === 'Bengaluru') navigate('/jobs?location=Bengaluru');
                    else navigate(`/jobs?keyword=${encodeURIComponent(item)}`);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-deep-maroon)',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '0.825rem'
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="container">
        <div style={{
          backgroundColor: 'var(--color-white)',
          border: '1px solid var(--color-soft-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem 1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '2rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-deep-maroon)', marginBottom: '0.2rem' }}>
              15,000+
            </h3>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-warm-grey)' }}>
              Active Verified Vacancies
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-deep-maroon)', marginBottom: '0.2rem' }}>
              1,200+
            </h3>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-warm-grey)' }}>
              Verified Indian Enterprises
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-deep-maroon)', marginBottom: '0.2rem' }}>
              ₹16.5 LPA
            </h3>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-warm-grey)' }}>
              Average Tech Package
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-deep-maroon)', marginBottom: '0.2rem' }}>
              100%
            </h3>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-warm-grey)' }}>
              Transparent Status Tracking
            </p>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-saffron)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <TrendingUp size={16} /> Fresh Openings
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-dark-charcoal)' }}>
              Featured Opportunities
            </h2>
            <p style={{ color: 'var(--color-warm-grey)', fontSize: '0.925rem' }}>
              Hand-picked high-impact roles from verified leaders across India
            </p>
          </div>
          <Link to="/jobs" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Explore All Jobs <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching featured openings..." />
        ) : featuredJobs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--color-warm-grey)' }}>No active featured jobs right now. Check the main job directory.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* Indian Tech Hubs Spotlight */}
      <section style={{ backgroundColor: 'var(--color-cream)', padding: '3.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 2.5rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-dark-charcoal)', marginBottom: '0.5rem' }}>
              Explore Jobs by Indian Tech Hubs
            </h2>
            <p style={{ color: 'var(--color-warm-grey)', fontSize: '0.95rem' }}>
              Find roles situated in India's fastest-growing startup ecosystems and IT corridors
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem'
          }}>
            {topCities.map((city, idx) => (
              <Link
                key={idx}
                to={`/jobs?location=${encodeURIComponent(city.name)}`}
                className="card card-hover"
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.25rem'
                }}
              >
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-warm-ivory)',
                  border: '1px solid var(--color-soft-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-deep-maroon)'
                }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-dark-charcoal)', marginBottom: '2px' }}>
                    {city.name}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-warm-grey)', marginBottom: '4px' }}>
                    {city.title}
                  </p>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-deep-maroon)' }}>
                    {city.count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recruiter Call To Action */}
      <section className="container">
        <div style={{
          backgroundColor: 'var(--color-deep-maroon)',
          borderRadius: 'var(--radius-xl)',
          padding: '3rem 2.5rem',
          color: 'var(--color-white)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          alignItems: 'center',
          gap: '2.5rem',
          boxShadow: 'var(--shadow-xl)'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(233, 162, 59, 0.2)',
              color: 'var(--color-saffron)',
              padding: '0.3rem 0.8rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '1rem'
            }}>
              <Award size={15} /> FOR INDIAN RECRUITERS & HIRING TEAMS
            </div>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--color-white)', lineHeight: 1.25, marginBottom: '1rem' }}>
              Hire Pre-Screened Indian Engineering & Enterprise Talent
            </h2>
            <p style={{ color: 'var(--color-cream)', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '1.5rem', opacity: 0.9 }}>
              Post vacancies in minutes, manage candidate stages seamlessly, download PDF resumes with single click, and schedule virtual interviews without hassle.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Link to="/register?role=RECRUITER" className="btn btn-accent btn-lg">
                Create Employer Account
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg" style={{ borderColor: 'var(--color-cream)', color: 'var(--color-white)' }}>
                Recruiter Sign In
              </Link>
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <CheckCircle2 size={22} style={{ color: 'var(--color-saffron)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ color: 'var(--color-white)', fontSize: '0.95rem', fontWeight: 700 }}>Direct Applicant Communication</h4>
                <p style={{ color: 'var(--color-cream)', fontSize: '0.825rem', opacity: 0.85 }}>No third-party agency middlemen or inflated recruitment markups.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <CheckCircle2 size={22} style={{ color: 'var(--color-saffron)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ color: 'var(--color-white)', fontSize: '0.95rem', fontWeight: 700 }}>Built-in Interview Rounds Scheduler</h4>
                <p style={{ color: 'var(--color-cream)', fontSize: '0.825rem', opacity: 0.85 }}>Organize technical rounds, HR evaluations, and meeting links in one timeline.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <CheckCircle2 size={22} style={{ color: 'var(--color-saffron)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ color: 'var(--color-white)', fontSize: '0.95rem', fontWeight: 700 }}>Audit & Safety Verification</h4>
                <p style={{ color: 'var(--color-cream)', fontSize: '0.825rem', opacity: 0.85 }}>Verified employer badge boosts candidate response rate by 3.8x.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
