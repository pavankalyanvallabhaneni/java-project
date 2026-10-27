import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { 
  Briefcase, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown, 
  CheckCheck,
  Shield,
  Building2,
  FileText,
  Calendar,
  Bookmark
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isCandidate, isRecruiter, isAdmin } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const notifRef = useRef(null);
  const userRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setNotifDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isRecruiter) return '/recruiter/dashboard';
    if (isCandidate) return '/candidate/dashboard';
    return '/';
  };

  return (
    <header className="navbar-container" style={{
      backgroundColor: 'var(--color-white)',
      borderBottom: '1px solid var(--color-soft-border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'var(--color-deep-maroon)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-saffron)',
            boxShadow: '0 2px 6px rgba(112, 28, 53, 0.3)'
          }}>
            <Briefcase size={22} strokeWidth={2.4} />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.45rem',
              fontWeight: 800,
              color: 'var(--color-deep-maroon)',
              letterSpacing: '-0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              Bharat<span style={{ color: 'var(--color-saffron)' }}>Hire</span>
            </span>
            <span style={{
              display: 'block',
              fontSize: '0.68rem',
              fontWeight: 600,
              color: 'var(--color-warm-grey)',
              marginTop: '-3px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              India Talent Portal
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', md: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          <Link to="/jobs" style={{
            fontWeight: 600,
            fontSize: '0.93rem',
            color: location.pathname === '/jobs' ? 'var(--color-deep-maroon)' : 'var(--color-dark-charcoal)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            Browse Jobs
          </Link>

          {isCandidate && (
            <>
              <Link to="/candidate/dashboard" style={{
                fontWeight: 600,
                fontSize: '0.93rem',
                color: location.pathname.startsWith('/candidate/dashboard') ? 'var(--color-deep-maroon)' : 'var(--color-dark-charcoal)'
              }}>
                Overview
              </Link>
              <Link to="/candidate/applications" style={{
                fontWeight: 600,
                fontSize: '0.93rem',
                color: location.pathname.startsWith('/candidate/applications') ? 'var(--color-deep-maroon)' : 'var(--color-dark-charcoal)'
              }}>
                Applications
              </Link>
              <Link to="/candidate/saved" style={{
                fontWeight: 600,
                fontSize: '0.93rem',
                color: location.pathname.startsWith('/candidate/saved') ? 'var(--color-deep-maroon)' : 'var(--color-dark-charcoal)'
              }}>
                Bookmarks
              </Link>
              <Link to="/candidate/interviews" style={{
                fontWeight: 600,
                fontSize: '0.93rem',
                color: location.pathname.startsWith('/candidate/interviews') ? 'var(--color-deep-maroon)' : 'var(--color-dark-charcoal)'
              }}>
                Interviews
              </Link>
            </>
          )}

          {isRecruiter && (
            <>
              <Link to="/recruiter/dashboard" style={{
                fontWeight: 600,
                fontSize: '0.93rem',
                color: location.pathname === '/recruiter/dashboard' ? 'var(--color-deep-maroon)' : 'var(--color-dark-charcoal)'
              }}>
                Dashboard
              </Link>
              <Link to="/recruiter/jobs" style={{
                fontWeight: 600,
                fontSize: '0.93rem',
                color: location.pathname === '/recruiter/jobs' ? 'var(--color-deep-maroon)' : 'var(--color-dark-charcoal)'
              }}>
                My Postings
              </Link>
              <Link to="/recruiter/applicants" style={{
                fontWeight: 600,
                fontSize: '0.93rem',
                color: location.pathname === '/recruiter/applicants' ? 'var(--color-deep-maroon)' : 'var(--color-dark-charcoal)'
              }}>
                Candidates
              </Link>
              <Link to="/recruiter/interviews" style={{
                fontWeight: 600,
                fontSize: '0.93rem',
                color: location.pathname === '/recruiter/interviews' ? 'var(--color-deep-maroon)' : 'var(--color-dark-charcoal)'
              }}>
                Interviews
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link to="/admin/dashboard" style={{
                fontWeight: 600,
                fontSize: '0.93rem',
                color: location.pathname === '/admin/dashboard' ? 'var(--color-deep-maroon)' : 'var(--color-dark-charcoal)'
              }}>
                Platform Hub
              </Link>
              <Link to="/admin/users" style={{
                fontWeight: 600,
                fontSize: '0.93rem',
                color: location.pathname === '/admin/users' ? 'var(--color-deep-maroon)' : 'var(--color-dark-charcoal)'
              }}>
                Users
              </Link>
              <Link to="/admin/companies" style={{
                fontWeight: 600,
                fontSize: '0.93rem',
                color: location.pathname === '/admin/companies' ? 'var(--color-deep-maroon)' : 'var(--color-dark-charcoal)'
              }}>
                Companies
              </Link>
              <Link to="/admin/reports" style={{
                fontWeight: 600,
                fontSize: '0.93rem',
                color: location.pathname === '/admin/reports' ? 'var(--color-deep-maroon)' : 'var(--color-dark-charcoal)'
              }}>
                Job Reports
              </Link>
            </>
          )}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <div ref={notifRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  aria-label="Notifications"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    color: 'var(--color-dark-charcoal)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-cream)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Bell size={21} />
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      backgroundColor: 'var(--color-error-red)',
                      color: 'var(--color-white)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Drawer */}
                {notifDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '360px',
                    maxWidth: '90vw',
                    backgroundColor: 'var(--color-white)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--color-soft-border)',
                    overflow: 'hidden',
                    zIndex: 100
                  }}>
                    <div style={{
                      padding: '0.85rem 1rem',
                      backgroundColor: 'var(--color-warm-ivory)',
                      borderBottom: '1px solid var(--color-soft-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Notifications</span>
                        {unreadCount > 0 && (
                          <span className="badge badge-saffron" style={{ fontSize: '0.72rem' }}>
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllAsRead}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-deep-maroon)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          <CheckCheck size={14} /> Mark all read
                        </button>
                      )}
                    </div>

                    <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-warm-grey)' }}>
                          <Bell size={28} style={{ opacity: 0.3, margin: '0 auto 0.5rem' }} />
                          <p style={{ fontSize: '0.875rem' }}>No notifications yet</p>
                        </div>
                      ) : (
                        notifications.slice(0, 10).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => !n.isRead && markAsRead(n.id)}
                            style={{
                              padding: '0.85rem 1rem',
                              borderBottom: '1px solid var(--color-soft-border)',
                              backgroundColor: n.isRead ? 'var(--color-white)' : 'rgba(233, 162, 59, 0.08)',
                              cursor: n.isRead ? 'default' : 'pointer',
                              transition: 'background-color 0.15s'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                              <p style={{ fontWeight: n.isRead ? 600 : 700, fontSize: '0.875rem', color: 'var(--color-dark-charcoal)' }}>
                                {n.title}
                              </p>
                              {!n.isRead && (
                                <span style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  backgroundColor: 'var(--color-saffron)',
                                  flexShrink: 0,
                                  marginTop: '4px'
                                }} />
                              )}
                            </div>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--color-warm-grey)', marginBottom: '4px', lineHeight: 1.4 }}>
                              {n.message}
                            </p>
                            <span style={{ fontSize: '0.72rem', color: 'var(--color-warm-grey-light)' }}>
                              {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div ref={userRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.4rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-soft-border)',
                    backgroundColor: 'var(--color-warm-ivory)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-deep-maroon)',
                    color: 'var(--color-white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div style={{ textAlign: 'left', display: 'none', lg: 'block' }} className="user-text-pill">
                    <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-dark-charcoal)', lineHeight: 1.1 }}>
                      {user?.fullName?.split(' ')[0]}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-burgundy)', fontWeight: 600 }}>
                      {isAdmin ? 'Admin' : isRecruiter ? 'Recruiter' : 'Candidate'}
                    </span>
                  </div>
                  <ChevronDown size={14} style={{ color: 'var(--color-warm-grey)' }} />
                </button>

                {userDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '230px',
                    backgroundColor: 'var(--color-white)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--color-soft-border)',
                    overflow: 'hidden',
                    zIndex: 100
                  }}>
                    <div style={{
                      padding: '1rem',
                      borderBottom: '1px solid var(--color-soft-border)',
                      backgroundColor: 'var(--color-warm-ivory)'
                    }}>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-dark-charcoal)' }}>{user?.fullName}</p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--color-warm-grey)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
                      <span className="badge badge-maroon" style={{ marginTop: '0.4rem', fontSize: '0.7rem' }}>
                        {isAdmin ? 'Administrator' : isRecruiter ? 'Employer / Recruiter' : 'Job Seeker'}
                      </span>
                    </div>

                    <div style={{ padding: '0.5rem' }}>
                      <Link
                        to={getDashboardLink()}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.6rem 0.8rem',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: 'var(--color-dark-charcoal)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-cream)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <User size={16} /> My Dashboard
                      </Link>

                      {isCandidate && (
                        <Link
                          to="/candidate/profile"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.6rem 0.8rem',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: 'var(--color-dark-charcoal)'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-cream)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <FileText size={16} /> Profile & Resume
                        </Link>
                      )}

                      {isRecruiter && (
                        <Link
                          to="/recruiter/company"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.6rem 0.8rem',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: 'var(--color-dark-charcoal)'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-cream)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <Building2 size={16} /> Company Details
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.6rem 0.8rem',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: 'var(--color-error-red)',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          marginTop: '0.25rem'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-error-red-light)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}

          {/* Recruiter CTA button */}
          {!isAdmin && (!isAuthenticated || isRecruiter) && (
            <Link
              to={isRecruiter ? '/recruiter/jobs/new' : '/register?role=RECRUITER'}
              className="btn btn-accent btn-sm"
              style={{ display: 'none', sm: 'inline-flex' }}
            >
              Post a Job
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              border: '1px solid var(--color-soft-border)',
              borderRadius: 'var(--radius-md)',
              background: 'none',
              cursor: 'pointer',
              color: 'var(--color-dark-charcoal)'
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--color-white)',
          borderTop: '1px solid var(--color-soft-border)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <Link to="/jobs" style={{ fontWeight: 600, padding: '0.5rem 0' }}>Browse Jobs</Link>
          
          {isAuthenticated && (
            <>
              <Link to={getDashboardLink()} style={{ fontWeight: 600, padding: '0.5rem 0' }}>Dashboard</Link>
              {isCandidate && (
                <>
                  <Link to="/candidate/profile" style={{ fontWeight: 600, padding: '0.5rem 0' }}>My Profile</Link>
                  <Link to="/candidate/applications" style={{ fontWeight: 600, padding: '0.5rem 0' }}>My Applications</Link>
                  <Link to="/candidate/saved" style={{ fontWeight: 600, padding: '0.5rem 0' }}>Saved Jobs</Link>
                  <Link to="/candidate/interviews" style={{ fontWeight: 600, padding: '0.5rem 0' }}>Scheduled Interviews</Link>
                </>
              )}
              {isRecruiter && (
                <>
                  <Link to="/recruiter/jobs/new" style={{ fontWeight: 600, padding: '0.5rem 0' }}>Post a New Job</Link>
                  <Link to="/recruiter/jobs" style={{ fontWeight: 600, padding: '0.5rem 0' }}>My Job Postings</Link>
                  <Link to="/recruiter/applicants" style={{ fontWeight: 600, padding: '0.5rem 0' }}>Applicants</Link>
                  <Link to="/recruiter/interviews" style={{ fontWeight: 600, padding: '0.5rem 0' }}>Interviews</Link>
                  <Link to="/recruiter/company" style={{ fontWeight: 600, padding: '0.5rem 0' }}>Company Profile</Link>
                </>
              )}
              {isAdmin && (
                <>
                  <Link to="/admin/users" style={{ fontWeight: 600, padding: '0.5rem 0' }}>User Accounts</Link>
                  <Link to="/admin/companies" style={{ fontWeight: 600, padding: '0.5rem 0' }}>Companies</Link>
                  <Link to="/admin/reports" style={{ fontWeight: 600, padding: '0.5rem 0' }}>Job Reports</Link>
                  <Link to="/admin/audit-logs" style={{ fontWeight: 600, padding: '0.5rem 0' }}>Audit Logs</Link>
                </>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start', marginTop: '0.5rem' }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </>
          )}

          {!isAuthenticated && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm" style={{ flex: 1 }}>Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ flex: 1 }}>Register</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
