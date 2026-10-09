import React, { useState } from 'react';
import { X, PlusCircle, Sparkles, Loader2, Building2, MapPin, Briefcase, DollarSign, Link2 } from 'lucide-react';

export default function AddJobModal({ onClose, onAddJob }) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: 'Remote',
    experience: '3-5 years',
    salary: '$140,000 - $170,000',
    role: 'Full-Stack Engineer',
    url: '',
    description: ''
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Job Title is required');
      return;
    }

    setSaving(true);
    try {
      await onAddJob(formData);
      onClose();
    } catch (err) {
      alert(`Error saving job: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window add-job-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <PlusCircle size={18} />
            </div>
            <div>
              <h2>Track New Job Listing</h2>
              <p className="modal-subtitle">
                The AI ATS engine will instantly score this role against your resume
              </p>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row two-col">
              <div className="form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Engineer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Company Name</label>
                <div className="input-with-icon">
                  <Building2 size={15} className="input-icon" />
                  <input
                    type="text"
                    placeholder="e.g. Airbnb, OpenAI, Startup"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="form-row three-col">
              <div className="form-group">
                <label>Location</label>
                <div className="input-with-icon">
                  <MapPin size={15} className="input-icon" />
                  <input
                    type="text"
                    placeholder="e.g. Remote / New York"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Experience</label>
                <div className="input-with-icon">
                  <Briefcase size={15} className="input-icon" />
                  <input
                    type="text"
                    placeholder="e.g. 4+ years"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Salary Range</label>
                <div className="input-with-icon">
                  <DollarSign size={15} className="input-icon" />
                  <input
                    type="text"
                    placeholder="e.g. $150k - $180k"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="form-row two-col">
              <div className="form-group">
                <label>Primary Role Category</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="Full-Stack Engineer">Full-Stack Engineer</option>
                  <option value="Frontend Engineer">Frontend Engineer</option>
                  <option value="Backend Engineer">Backend Engineer</option>
                  <option value="AI / ML Engineer">AI / ML Engineer</option>
                  <option value="DevOps / Cloud">DevOps / Cloud</option>
                </select>
              </div>

              <div className="form-group">
                <label>Job Listing URL</label>
                <div className="input-with-icon">
                  <Link2 size={15} className="input-icon" />
                  <input
                    type="url"
                    placeholder="https://company.com/careers/job-123"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Job Description & Technical Requirements</label>
              <textarea
                rows={5}
                placeholder="Paste the full job description or key requirements here. Our ATS engine will scan for matching and missing tech skills..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-modal-close" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-modal-action primary" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={16} className="spin-icon" />
                  <span>Scoring with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Save & Score Listing</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
