import React, { useState, useEffect } from 'react';
import { adminService } from '../../api/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { Building2, Search, CheckCircle2, XCircle, Globe, MapPin, AlertCircle, ExternalLink } from 'lucide-react';

const AdminCompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const res = await adminService.getCompanies();
      if (res.data) setCompanies(res.data);
    } catch (err) {
      console.error('Failed to load companies:', err);
      setAlert({ type: 'danger', message: 'Unable to retrieve company records.' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerification = async (company) => {
    const nextVerify = !company.isVerified;
    try {
      setUpdatingId(company.id);
      const res = await adminService.verifyCompany(company.id, nextVerify);
      if (res.data) {
        setCompanies((prev) =>
          prev.map((c) => (c.id === company.id ? { ...c, isVerified: nextVerify } : c))
        );
        setAlert({
          type: 'success',
          message: `${company.name} verification status is now ${nextVerify ? 'VERIFIED' : 'UNVERIFIED'}.`,
        });
      }
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to update company verification.' });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.industry && c.industry.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <LoadingSpinner text="Retrieving registered employers..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-dark-charcoal)', marginBottom: '0.25rem' }}>
          Registered Employers & Verification ({companies.length})
        </h1>
        <p style={{ color: 'var(--color-warm-grey)', fontSize: '0.925rem' }}>
          Review Indian companies and toggle verified badges for trusted recruiting
        </p>
      </div>

      {alert.message && (
        <div className={`alert alert-${alert.type}`} style={{ marginBottom: '1.5rem' }}>
          {alert.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: 'var(--color-white)' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-warm-grey)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search by company name or industry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
        </div>
      </div>

      {/* Companies Table */}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Industry & Size</th>
              <th>Headquarters</th>
              <th>Website</th>
              <th>Verified Status</th>
              <th style={{ textAlign: 'right' }}>Admin Verification</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((c) => (
              <tr key={c.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {c.logoUrl ? (
                      <img
                        src={c.logoUrl}
                        alt={c.name}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          border: '1px solid var(--color-soft-border)',
                          backgroundColor: 'var(--color-cream)'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--color-cream)',
                        color: 'var(--color-deep-maroon)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.9rem'
                      }}>
                        {c.name?.charAt(0) || 'C'}
                      </div>
                    )}
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-dark-charcoal)', display: 'block' }}>
                        {c.name}
                      </span>
                    </div>
                  </div>
                </td>

                <td>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-dark-charcoal)', display: 'block' }}>
                    {c.industry || 'IT & Consulting'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-warm-grey)' }}>
                    {c.companySize || '500+ employees'}
                  </span>
                </td>

                <td>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-dark-charcoal)' }}>
                    {c.headquarters || 'India'}
                  </span>
                </td>

                <td>
                  {c.website ? (
                    <a
                      href={c.website.startsWith('http') ? c.website : `https://${c.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.825rem', color: 'var(--color-deep-maroon)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      Visit <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-warm-grey)' }}>N/A</span>
                  )}
                </td>

                <td>
                  <Badge variant={c.isVerified ? 'green' : 'saffron'} style={{ fontSize: '0.75rem' }}>
                    {c.isVerified ? 'Verified' : 'Unverified'}
                  </Badge>
                </td>

                <td style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => handleToggleVerification(c)}
                    disabled={updatingId === c.id}
                    className={`btn btn-sm ${c.isVerified ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}
                  >
                    {updatingId === c.id ? 'Saving...' : c.isVerified ? 'Revoke Verification' : 'Verify Employer'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCompaniesPage;
