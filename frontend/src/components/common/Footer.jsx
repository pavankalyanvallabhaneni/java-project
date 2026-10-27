import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart, MapPin, Mail, Phone, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--color-dark-charcoal)',
      color: 'var(--color-cream)',
      paddingTop: '3.5rem',
      paddingBottom: '2rem',
      marginTop: 'auto',
      borderTop: '3px solid var(--color-deep-maroon)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-deep-maroon)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-saffron)'
              }}>
                <Briefcase size={20} />
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.4rem',
                fontWeight: 800,
                color: 'var(--color-white)'
              }}>
                Bharat<span style={{ color: 'var(--color-saffron)' }}>Hire</span>
              </span>
            </div>
            <p style={{ color: 'var(--color-warm-grey-light)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              India's premier end-to-end recruitment portal connecting skilled professionals with leading enterprises, tech giants, and visionary startups across Bharat.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-saffron)', fontSize: '0.825rem', fontWeight: 600 }}>
              <ShieldCheck size={16} /> 100% Verified Indian Employers
            </div>
          </div>

          {/* Quick Hubs */}
          <div>
            <h4 style={{ color: 'var(--color-white)', fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem' }}>
              Top Tech Cities
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><Link to="/jobs?location=Bengaluru" style={{ color: 'var(--color-warm-grey-light)' }}>Bengaluru (Silicon Valley)</Link></li>
              <li><Link to="/jobs?location=Hyderabad" style={{ color: 'var(--color-warm-grey-light)' }}>Hyderabad (Cyberabad)</Link></li>
              <li><Link to="/jobs?location=Pune" style={{ color: 'var(--color-warm-grey-light)' }}>Pune (Oxford of the East)</Link></li>
              <li><Link to="/jobs?location=Mumbai" style={{ color: 'var(--color-warm-grey-light)' }}>Mumbai & Navi Mumbai</Link></li>
              <li><Link to="/jobs?location=Delhi" style={{ color: 'var(--color-warm-grey-light)' }}>Delhi NCR & Gurugram</Link></li>
              <li><Link to="/jobs?workMode=Remote" style={{ color: 'var(--color-saffron)' }}>Pan-India Remote Jobs</Link></li>
            </ul>
          </div>

          {/* Job Categories */}
          <div>
            <h4 style={{ color: 'var(--color-white)', fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem' }}>
              Trending Domains
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><Link to="/jobs?category=IT %26 Software" style={{ color: 'var(--color-warm-grey-light)' }}>IT & Software Engineering</Link></li>
              <li><Link to="/jobs?category=Data %26 AI" style={{ color: 'var(--color-warm-grey-light)' }}>Data Science, ML & AI</Link></li>
              <li><Link to="/jobs?category=Banking %26 Finance" style={{ color: 'var(--color-warm-grey-light)' }}>Fintech & Banking Services</Link></li>
              <li><Link to="/jobs?category=Product %26 Design" style={{ color: 'var(--color-warm-grey-light)' }}>Product Management & UI/UX</Link></li>
              <li><Link to="/jobs?category=Sales %26 Marketing" style={{ color: 'var(--color-warm-grey-light)' }}>Growth & Corporate Sales</Link></li>
            </ul>
          </div>

          {/* Candidates & Recruiters */}
          <div>
            <h4 style={{ color: 'var(--color-white)', fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem' }}>
              Portals & Support
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><Link to="/candidate/profile" style={{ color: 'var(--color-warm-grey-light)' }}>Candidate Profile & CV</Link></li>
              <li><Link to="/recruiter/jobs/new" style={{ color: 'var(--color-warm-grey-light)' }}>Recruiter: Post Vacancy</Link></li>
              <li><Link to="/admin/dashboard" style={{ color: 'var(--color-warm-grey-light)' }}>Administration Hub</Link></li>
              <li><a href="mailto:support@bharathire.in" style={{ color: 'var(--color-warm-grey-light)', display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> support@bharathire.in</a></li>
              <li><span style={{ color: 'var(--color-warm-grey-light)', display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> +91 (080) 4567 8900</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(230, 217, 201, 0.15)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8125rem',
          color: 'var(--color-warm-grey-light)'
        }}>
          <div>
            &copy; {new Date().getFullYear()} BharatHire Recruitment Technologies Private Limited. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built with dedication for India's talent revolution <Heart size={14} style={{ color: 'var(--color-saffron)', fill: 'var(--color-saffron)' }} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
