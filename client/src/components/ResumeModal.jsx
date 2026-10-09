import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Check, 
  Plus, 
  Sparkles, 
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function ResumeModal({
  resume,
  onClose,
  onUpdateResume,
  onUploadFile
}) {
  const [formData, setFormData] = useState({
    name: resume?.name || '',
    title: resume?.title || '',
    email: resume?.email || '',
    location: resume?.location || '',
    experienceYears: resume?.experienceYears || 5,
    summary: resume?.summary || '',
    rawText: resume?.rawText || '',
    skills: resume?.skills ? [...resume.skills] : []
  });

  const [newSkillInput, setNewSkillInput] = useState('');
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'raw' | 'upload'
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [autoRematch, setAutoRematch] = useState(true);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (trimmed && !formData.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed]
      }));
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove)
    }));
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setUploadMessage(null);
    try {
      const res = await onUploadFile(file);
      setUploadMessage({ type: 'success', text: res.message || 'Resume uploaded and processed successfully!' });
      if (res.resume) {
        setFormData({
          name: res.resume.name || formData.name,
          title: res.resume.title || formData.title,
          email: res.resume.email || formData.email,
          location: res.resume.location || formData.location,
          experienceYears: res.resume.experienceYears || formData.experienceYears,
          summary: res.resume.summary || formData.summary,
          rawText: res.resume.rawText || formData.rawText,
          skills: res.resume.skills || formData.skills
        });
      }
    } catch (err) {
      setUploadMessage({ type: 'error', text: err.message || 'Failed to upload resume file' });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdateResume(formData, autoRematch);
      onClose();
    } catch (err) {
      alert(`Save error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window resume-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <FileText size={18} />
            </div>
            <div>
              <h2>Candidate ATS Resume Profile</h2>
              <p className="modal-subtitle">
                Used by the AI engine to score job listings and detect skill gaps
              </p>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="modal-nav-tabs">
          <button
            className={`modal-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile & Skills ({formData.skills.length})
          </button>
          <button
            className={`modal-tab ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload Resume (PDF / TXT)
          </button>
          <button
            className={`modal-tab ${activeTab === 'raw' ? 'active' : ''}`}
            onClick={() => setActiveTab('raw')}
          >
            Raw Resume Text
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {activeTab === 'upload' && (
            <div className="upload-view-content">
              <div
                className={`dropzone-box ${uploading ? 'loading' : ''}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.md"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                />
                <div className="dropzone-icon">
                  {uploading ? (
                    <Loader2 size={36} className="spin-icon text-indigo" />
                  ) : (
                    <Upload size={36} className="text-indigo" />
                  )}
                </div>
                <h3>{uploading ? 'Extracting & Parsing Document...' : 'Drag & Drop Resume File Here'}</h3>
                <p className="dropzone-sub">
                  Supports <strong>.PDF</strong> and <strong>.TXT</strong> documents (up to 10MB)
                </p>
                <button
                  type="button"
                  className="btn-browse-file"
                  disabled={uploading}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Browse Files
                </button>
              </div>

              {uploadMessage && (
                <div className={`upload-status-alert ${uploadMessage.type}`}>
                  {uploadMessage.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                  <span>{uploadMessage.text}</span>
                </div>
              )}

              <div className="upload-guide-card">
                <h4>What happens when you upload?</h4>
                <ul>
                  <li>Text and work history are parsed using our document extraction pipeline.</li>
                  <li>Technical competencies, frameworks, and tools are cataloged into ATS vectors.</li>
                  <li>All tracked jobs are immediately re-scored against your updated credentials.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-form-grid">
              <div className="form-row two-col">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Mercer"
                  />
                </div>
                <div className="form-group">
                  <label>Target Professional Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Senior Full-Stack Engineer"
                  />
                </div>
              </div>

              <div className="form-row two-col">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. alex@example.dev"
                  />
                </div>
                <div className="form-group">
                  <label>Location & Work Preference</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. San Francisco, CA / Remote"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Professional Bio / Summary</label>
                <textarea
                  rows={3}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Concise overview of your technical background..."
                />
              </div>

              {/* Skills Tags Manager */}
              <div className="form-group">
                <div className="skills-label-row">
                  <label>Identified Technical Skills ({formData.skills.length})</label>
                  <span className="skills-sub">Used for exact keyword matching</span>
                </div>

                <div className="skills-chip-editor">
                  {formData.skills.map((skill) => (
                    <span key={skill} className="skill-edit-tag">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="btn-remove-skill"
                        title={`Remove ${skill}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>

                <form onSubmit={handleAddSkill} className="add-skill-bar">
                  <input
                    type="text"
                    placeholder="Add a new skill (e.g. Rust, PyTorch, GraphQL)..."
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                  />
                  <button type="submit" className="btn-add-tag">
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'raw' && (
            <div className="raw-text-content">
              <label className="text-sm text-muted">
                Paste or edit the complete plain text of your resume. The AI engine searches this for experience and role keywords:
              </label>
              <textarea
                rows={14}
                className="raw-textarea"
                value={formData.rawText}
                onChange={(e) => setFormData({ ...formData, rawText: e.target.value })}
                placeholder="Paste full resume text here..."
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <div className="rematch-checkbox-wrap">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={autoRematch}
                onChange={(e) => setAutoRematch(e.target.checked)}
              />
              <span>Auto re-match all jobs after saving</span>
            </label>
          </div>

          <div className="footer-right">
            <button className="btn-modal-close" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn-modal-action primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="spin-icon" />
                  <span>Saving & Matching...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Save ATS Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
