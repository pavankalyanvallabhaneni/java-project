import React, { useState, useEffect } from 'react';
import { candidateService } from '../../api/candidateService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { 
  User, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  Plus, 
  Trash2, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Linkedin, 
  Github, 
  Globe,
  IndianRupee,
  Clock
} from 'lucide-react';

const CandidateProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Basic Form State
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [preferredLocations, setPreferredLocations] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('0');
  const [expectedSalaryMin, setExpectedSalaryMin] = useState('');
  const [expectedSalaryMax, setExpectedSalaryMax] = useState('');
  const [noticePeriodDays, setNoticePeriodDays] = useState('30');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Modals state
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({ skillName: '', proficiencyLevel: 'Intermediate', yearsOfExperience: 1 });

  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [newEdu, setNewEdu] = useState({ institution: '', degree: '', fieldOfStudy: '', startYear: 2020, endYear: 2024, percentageOrCgpa: '' });

  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [newExp, setNewExp] = useState({ companyName: '', designation: '', startDate: '', endDate: '', isCurrent: false, description: '' });

  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await candidateService.getProfile();
      if (res.data) {
        setProfile(res.data);
        setHeadline(res.data.headline || '');
        setBio(res.data.bio || '');
        setCurrentLocation(res.data.currentLocation || '');
        setPreferredLocations(res.data.preferredLocations || '');
        setYearsOfExperience(res.data.yearsOfExperience?.toString() || '0');
        setExpectedSalaryMin(res.data.expectedSalaryMin?.toString() || '');
        setExpectedSalaryMax(res.data.expectedSalaryMax?.toString() || '');
        setNoticePeriodDays(res.data.noticePeriodDays?.toString() || '30');
        setLinkedinUrl(res.data.linkedinUrl || '');
        setGithubUrl(res.data.githubUrl || '');
        setPortfolioUrl(res.data.portfolioUrl || '');
      }
    } catch (err) {
      console.error('Failed to load candidate profile:', err);
      setAlert({ type: 'danger', message: 'Failed to load profile details.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setAlert({ type: '', message: '' });
      const payload = {
        headline,
        bio,
        currentLocation,
        preferredLocations,
        yearsOfExperience: Number(yearsOfExperience) || 0,
        expectedSalaryMin: expectedSalaryMin ? Number(expectedSalaryMin) : null,
        expectedSalaryMax: expectedSalaryMax ? Number(expectedSalaryMax) : null,
        noticePeriodDays: Number(noticePeriodDays) || 30,
        linkedinUrl,
        githubUrl,
        portfolioUrl,
      };

      const res = await candidateService.updateProfile(payload);
      if (res.data) {
        setProfile(res.data);
        setAlert({ type: 'success', message: 'Your candidate profile has been updated successfully.' });
      }
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.skillName) return;
    try {
      const res = await candidateService.addSkill(newSkill);
      if (res.data) setProfile(res.data);
      setIsSkillModalOpen(false);
      setNewSkill({ skillName: '', proficiencyLevel: 'Intermediate', yearsOfExperience: 1 });
      setAlert({ type: 'success', message: 'Skill added to your profile.' });
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to add skill.' });
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await candidateService.deleteSkill(id);
      setProfile((prev) => ({
        ...prev,
        skills: prev.skills.filter((s) => s.id !== id),
      }));
      setAlert({ type: 'success', message: 'Skill removed.' });
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to remove skill.' });
    }
  };

  const handleAddEducation = async (e) => {
    e.preventDefault();
    if (!newEdu.institution || !newEdu.degree) return;
    try {
      const res = await candidateService.addEducation(newEdu);
      if (res.data) setProfile(res.data);
      setIsEduModalOpen(false);
      setNewEdu({ institution: '', degree: '', fieldOfStudy: '', startYear: 2020, endYear: 2024, percentageOrCgpa: '' });
      setAlert({ type: 'success', message: 'Education record added.' });
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to add education record.' });
    }
  };

  const handleDeleteEducation = async (id) => {
    try {
      await candidateService.deleteEducation(id);
      setProfile((prev) => ({
        ...prev,
        educationList: prev.educationList.filter((e) => e.id !== id),
      }));
      setAlert({ type: 'success', message: 'Education record deleted.' });
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to delete education record.' });
    }
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    if (!newExp.companyName || !newExp.designation || !newExp.startDate) return;
    try {
      const res = await candidateService.addExperience(newExp);
      if (res.data) setProfile(res.data);
      setIsExpModalOpen(false);
      setNewExp({ companyName: '', designation: '', startDate: '', endDate: '', isCurrent: false, description: '' });
      setAlert({ type: 'success', message: 'Work experience added.' });
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to add work experience.' });
    }
  };

  const handleDeleteExperience = async (id) => {
    try {
      await candidateService.deleteExperience(id);
      setProfile((prev) => ({
        ...prev,
        experienceList: prev.experienceList.filter((exp) => exp.id !== id),
      }));
      setAlert({ type: 'success', message: 'Experience record deleted.' });
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to delete experience.' });
    }
  };

  const handleUploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setAlert({ type: 'danger', message: 'Only PDF format resumes are accepted.' });
      return;
    }

    try {
      setUploadingResume(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await candidateService.uploadResume(formData);
      if (res.data) {
        setProfile((prev) => ({
          ...prev,
          resumes: [res.data, ...(prev.resumes || [])],
        }));
        setAlert({ type: 'success', message: 'Resume uploaded successfully.' });
      }
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Failed to upload resume.' });
    } finally {
      setUploadingResume(false);
    }
  };

  const handleDeleteResume = async (id) => {
    try {
      await candidateService.deleteResume(id);
      setProfile((prev) => ({
        ...prev,
        resumes: prev.resumes.filter((r) => r.id !== id),
      }));
      setAlert({ type: 'success', message: 'Resume deleted.' });
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to delete resume.' });
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <LoadingSpinner text="Loading candidate profile..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-dark-charcoal)', marginBottom: '0.25rem' }}>
          Candidate Profile & Credentials
        </h1>
        <p style={{ color: 'var(--color-warm-grey)', fontSize: '0.925rem' }}>
          Complete your professional background to stand out to verified recruiters across India
        </p>
      </div>

      {alert.message && (
        <div className={`alert alert-${alert.type}`} style={{ marginBottom: '1.5rem' }}>
          {alert.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{alert.message}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Left Column: Core Bio & Career Preferences Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <form onSubmit={handleUpdateProfile} className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--color-white)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-charcoal)', marginBottom: '1.25rem' }}>
              Personal & Career Summary
            </h3>

            <div className="form-group">
              <label className="form-label">Professional Headline</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Senior Java Full Stack Engineer | Spring Boot, React, Cloud"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Executive Bio / About Me</label>
              <textarea
                rows="4"
                className="form-control"
                placeholder="Describe your background, domains, key accomplishments, and technology stacks..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Current City</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Bengaluru"
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Cities</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Bengaluru, Remote"
                  value={preferredLocations}
                  onChange={(e) => setPreferredLocations(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Experience (Years)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  className="form-control"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notice Period (Days)</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={noticePeriodDays}
                  onChange={(e) => setNoticePeriodDays(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Expected CTC Min (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 1500000"
                  className="form-control"
                  value={expectedSalaryMin}
                  onChange={(e) => setExpectedSalaryMin(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Expected CTC Max (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 2200000"
                  className="form-control"
                  value={expectedSalaryMax}
                  onChange={(e) => setExpectedSalaryMax(e.target.value)}
                />
              </div>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-dark-charcoal)', marginTop: '0.75rem', marginBottom: '0.75rem' }}>
              Online Links & Portfolios
            </h4>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Linkedin size={14} /> LinkedIn URL
              </label>
              <input
                type="url"
                className="form-control"
                placeholder="https://linkedin.com/in/username"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Github size={14} /> GitHub URL
              </label>
              <input
                type="url"
                className="form-control"
                placeholder="https://github.com/username"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Globe size={14} /> Portfolio / Personal Website
              </label>
              <input
                type="url"
                className="form-control"
                placeholder="https://myportfolio.dev"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ width: '100%', padding: '0.75rem' }}
            >
              {saving ? 'Saving Changes...' : 'Save Profile Details'}
            </button>
          </form>

          {/* Resume Management */}
          <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--color-white)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-charcoal)' }}>
                PDF Resumes
              </h3>
              <label
                htmlFor="profileResumeUpload"
                className="btn btn-secondary btn-sm"
                style={{ cursor: 'pointer' }}
              >
                <Upload size={14} /> {uploadingResume ? 'Uploading...' : 'Upload PDF'}
              </label>
              <input
                type="file"
                id="profileResumeUpload"
                accept=".pdf,application/pdf"
                onChange={handleUploadResume}
                disabled={uploadingResume}
                style={{ display: 'none' }}
              />
            </div>

            {(!profile?.resumes || profile.resumes.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: 'var(--color-warm-ivory)', borderRadius: 'var(--radius-md)' }}>
                <FileText size={32} style={{ color: 'var(--color-warm-grey)', margin: '0 auto 0.5rem', opacity: 0.5 }} />
                <p style={{ fontSize: '0.875rem', color: 'var(--color-warm-grey)' }}>No resume uploaded yet. Upload a PDF resume to apply to jobs.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {profile.resumes.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-soft-border)',
                      backgroundColor: 'var(--color-warm-ivory)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <FileText size={20} style={{ color: 'var(--color-deep-maroon)' }} />
                      <div>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-dark-charcoal)' }}>{r.fileName}</p>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-warm-grey)' }}>
                          {(r.fileSizeBytes / 1024).toFixed(0)} KB &bull; {new Date(r.uploadedAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteResume(r.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--color-error-red)', cursor: 'pointer', padding: '4px' }}
                      title="Delete Resume"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Skills, Education, Work Experience */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Skills Section */}
          <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--color-white)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-charcoal)' }}>
                Skills & Competencies
              </h3>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsSkillModalOpen(true)}
              >
                <Plus size={14} /> Add Skill
              </button>
            </div>

            {(!profile?.skills || profile.skills.length === 0) ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-warm-grey)' }}>No skills added yet.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {profile.skills.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--color-warm-ivory)',
                      border: '1px solid var(--color-soft-border)',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      color: 'var(--color-deep-maroon)'
                    }}
                  >
                    <span>{s.skillName} ({s.proficiencyLevel})</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(s.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-warm-grey)', padding: '0 2px' }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Work Experience Section */}
          <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--color-white)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-charcoal)' }}>
                Work Experience
              </h3>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsExpModalOpen(true)}
              >
                <Plus size={14} /> Add Experience
              </button>
            </div>

            {(!profile?.experienceList || profile.experienceList.length === 0) ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-warm-grey)' }}>No experience records added.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {profile.experienceList.map((exp) => (
                  <div
                    key={exp.id}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-warm-ivory)',
                      border: '1px solid var(--color-soft-border)',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-dark-charcoal)' }}>
                          {exp.designation}
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-deep-maroon)', fontWeight: 600 }}>
                          {exp.companyName}
                        </p>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-warm-grey)' }}>
                          {exp.startDate} &mdash; {exp.isCurrent ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteExperience(exp.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--color-error-red)', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {exp.description && (
                      <p style={{ fontSize: '0.825rem', color: 'var(--color-dark-charcoal)', marginTop: '0.5rem', lineHeight: 1.5 }}>
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Education Section */}
          <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--color-white)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-charcoal)' }}>
                Education & Academics
              </h3>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsEduModalOpen(true)}
              >
                <Plus size={14} /> Add Education
              </button>
            </div>

            {(!profile?.educationList || profile.educationList.length === 0) ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-warm-grey)' }}>No academic records added.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {profile.educationList.map((edu) => (
                  <div
                    key={edu.id}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-warm-ivory)',
                      border: '1px solid var(--color-soft-border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-dark-charcoal)' }}>
                        {edu.degree}
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-deep-maroon)', fontWeight: 600 }}>
                        {edu.institution}
                      </p>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-warm-grey)' }}>
                        {edu.startYear} - {edu.endYear} {edu.percentageOrCgpa ? `&bull; ${edu.percentageOrCgpa}` : ''}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteEducation(edu.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--color-error-red)', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Skill Modal */}
      {isSkillModalOpen && (
        <Modal
          isOpen={isSkillModalOpen}
          onClose={() => setIsSkillModalOpen(false)}
          title="Add Skill to Profile"
          maxWidth="450px"
        >
          <form onSubmit={handleAddSkill}>
            <div className="form-group">
              <label className="form-label">Skill Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Java, Docker, Kubernetes, Next.js"
                value={newSkill.skillName}
                onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Proficiency Level</label>
              <select
                className="form-select"
                value={newSkill.proficiencyLevel}
                onChange={(e) => setNewSkill({ ...newSkill, proficiencyLevel: e.target.value })}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Years of Experience</label>
              <input
                type="number"
                step="0.5"
                min="0"
                className="form-control"
                value={newSkill.yearsOfExperience}
                onChange={(e) => setNewSkill({ ...newSkill, yearsOfExperience: Number(e.target.value) })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsSkillModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm">Add Skill</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Education Modal */}
      {isEduModalOpen && (
        <Modal
          isOpen={isEduModalOpen}
          onClose={() => setIsEduModalOpen(false)}
          title="Add Academic Degree"
          maxWidth="480px"
        >
          <form onSubmit={handleAddEducation}>
            <div className="form-group">
              <label className="form-label">Institution / College / University *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. IIT Bombay, VTU, Delhi University"
                value={newEdu.institution}
                onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Degree *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. B.Tech in Computer Science"
                value={newEdu.degree}
                onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Start Year</label>
                <input
                  type="number"
                  className="form-control"
                  value={newEdu.startYear}
                  onChange={(e) => setNewEdu({ ...newEdu, startYear: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Year (or Expected)</label>
                <input
                  type="number"
                  className="form-control"
                  value={newEdu.endYear}
                  onChange={(e) => setNewEdu({ ...newEdu, endYear: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">CGPA or Percentage</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 8.5 CGPA or 82%"
                value={newEdu.percentageOrCgpa}
                onChange={(e) => setNewEdu({ ...newEdu, percentageOrCgpa: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsEduModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm">Save Degree</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Experience Modal */}
      {isExpModalOpen && (
        <Modal
          isOpen={isExpModalOpen}
          onClose={() => setIsExpModalOpen(false)}
          title="Add Work Experience"
          maxWidth="500px"
        >
          <form onSubmit={handleAddExperience}>
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Infosys, Wipro, Flipkart"
                value={newExp.companyName}
                onChange={(e) => setNewExp({ ...newExp, companyName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Designation / Role *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Software Development Engineer II"
                value={newExp.designation}
                onChange={(e) => setNewExp({ ...newExp, designation: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={newExp.startDate}
                  onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={newExp.endDate}
                  onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
                  disabled={newExp.isCurrent}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input
                  type="checkbox"
                  checked={newExp.isCurrent}
                  onChange={(e) => setNewExp({ ...newExp, isCurrent: e.target.checked })}
                  style={{ accentColor: 'var(--color-deep-maroon)' }}
                />
                <span>I currently work here</span>
              </label>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Key Responsibilities / Impact</label>
              <textarea
                rows="3"
                className="form-control"
                placeholder="Briefly describe what you built, technologies used, and outcomes achieved..."
                value={newExp.description}
                onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsExpModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm">Add Record</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CandidateProfilePage;
