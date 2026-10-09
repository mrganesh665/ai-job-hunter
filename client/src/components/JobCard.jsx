import React from 'react';
import MatchGauge from './MatchGauge';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Check, 
  X, 
  Send, 
  RotateCcw, 
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Sparkles,
  Mail,
  HelpCircle,
  Award,
  Video
} from 'lucide-react';

export default function JobCard({ 
  job, 
  onApprove, 
  onApply, 
  onSkip, 
  onRestore, 
  onViewDetails,
  onOpenTab
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'matched':
        return <span className="status-badge matched">AI Matched</span>;
      case 'approved':
        return <span className="status-badge approved">Approved</span>;
      case 'applied':
        return <span className="status-badge applied">✓ Applied</span>;
      case 'interviewing':
        return <span className="status-badge interviewing">🎙️ Interviewing</span>;
      case 'offer':
        return <span className="status-badge offer">🏆 Offer Received!</span>;
      case 'skipped':
        return <span className="status-badge skipped">Skipped</span>;
      case 'failed':
        return <span className="status-badge failed">Disqualified</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  return (
    <div className={`job-card-item status-${job.status}`}>
      <div className="card-top-header">
        <div className="job-info-col">
          <div className="job-status-row">
            {getStatusBadge(job.status)}
            {job.source && <span className="source-tag">{job.source}</span>}
            {job.appliedAt && (
              <span className="applied-date-pill">
                Applied {new Date(job.appliedAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <h3 className="job-title" onClick={() => onViewDetails(job, 'overview')}>
            {job.title}
          </h3>
          <div className="job-metadata-row">
            <span className="meta-item company-name">
              <Building2 size={14} />
              {job.company}
            </span>
            <span className="meta-item location">
              <MapPin size={14} />
              {job.location}
            </span>
            {job.experience && (
              <span className="meta-item experience">
                <Briefcase size={14} />
                {job.experience}
              </span>
            )}
            {job.salary && (
              <span className="meta-item salary">
                <DollarSign size={14} />
                {job.salary}
              </span>
            )}
          </div>
        </div>

        {/* ATS Radial Gauge */}
        <div 
          className="job-gauge-col" 
          onClick={() => onViewDetails(job, 'overview')} 
          title="Click for full ATS breakdown"
        >
          <MatchGauge score={job.matchScore} size={54} strokeWidth={5} />
        </div>
      </div>

      {/* AI Match Summary */}
      {job.summary && (
        <div className="job-ai-summary">
          <span className="ai-label">AI Review:</span>
          <p className="summary-text">{job.summary}</p>
        </div>
      )}

      {/* Skills breakdown */}
      <div className="skills-cloud-row">
        {job.matchedSkills && job.matchedSkills.length > 0 && (
          <div className="skills-group">
            <span className="skills-group-title matched-title">
              <Check size={12} /> Matched ({job.matchedSkills.length})
            </span>
            <div className="chips-list">
              {job.matchedSkills.slice(0, 5).map((skill) => (
                <span key={skill} className="skill-chip matched">
                  {skill}
                </span>
              ))}
              {job.matchedSkills.length > 5 && (
                <span className="skill-chip more">+{job.matchedSkills.length - 5}</span>
              )}
            </div>
          </div>
        )}

        {job.missingSkills && job.missingSkills.length > 0 && (
          <div className="skills-group">
            <span className="skills-group-title missing-title">
              <AlertCircle size={12} /> Missing ({job.missingSkills.length})
            </span>
            <div className="chips-list">
              {job.missingSkills.slice(0, 3).map((skill) => (
                <span key={skill} className="skill-chip missing">
                  {skill}
                </span>
              ))}
              {job.missingSkills.length > 3 && (
                <span className="skill-chip more missing">+{job.missingSkills.length - 3}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Speed Accelerator Tools Row (Tailor, Outreach, Prep) */}
      <div className="accelerator-tools-bar">
        <span className="accelerator-label">Fast Track:</span>
        <button
          className="btn-pill-tool tailor"
          onClick={() => onViewDetails(job, 'tailor')}
          title="Generate custom tailored resume bullets"
        >
          <Sparkles size={12} />
          <span>⚡ Boost Resume</span>
        </button>
        <button
          className="btn-pill-tool outreach"
          onClick={() => onViewDetails(job, 'outreach')}
          title="Generate LinkedIn InMail and Cold Email to hiring manager"
        >
          <Mail size={12} />
          <span>📨 Recruiter InMail</span>
        </button>
        <button
          className="btn-pill-tool interview"
          onClick={() => onViewDetails(job, 'interview')}
          title="Predict interview questions & talking points"
        >
          <HelpCircle size={12} />
          <span>🎯 Interview Prep</span>
        </button>
      </div>

      {/* Card Action Footer */}
      <div className="card-actions-footer">
        <div className="action-left">
          <button 
            className="btn-link-action" 
            onClick={() => onViewDetails(job, 'overview')}
          >
            <span>Deep Dive</span>
            <ChevronRight size={14} />
          </button>
          {job.url && (
            <a 
              href={job.url} 
              target="_blank" 
              rel="noreferrer" 
              className="btn-link-action"
              title="Open source listing"
            >
              <span>Source</span>
              <ExternalLink size={13} />
            </a>
          )}
        </div>

        <div className="action-buttons-group">
          {job.status === 'matched' && (
            <>
              <button 
                className="btn-card-action approve"
                onClick={() => onApprove(job.id)}
                title="Approve job for application"
              >
                <Check size={14} />
                <span>Approve</span>
              </button>
              <button 
                className="btn-card-action skip"
                onClick={() => onSkip(job.id)}
                title="Skip this listing"
              >
                <X size={14} />
                <span>Skip</span>
              </button>
            </>
          )}

          {job.status === 'approved' && (
            <>
              <button 
                className="btn-card-action apply"
                onClick={() => onApply(job.id)}
                title="Submit application now"
              >
                <Send size={14} />
                <span>Apply Now</span>
              </button>
              <button 
                className="btn-card-action skip"
                onClick={() => onSkip(job.id)}
              >
                <X size={14} />
                <span>Skip</span>
              </button>
            </>
          )}

          {job.status === 'applied' && (
            <div className="applied-actions-group">
              <span className="applied-check">✓ Applied</span>
              <button
                className="btn-card-action mini-stage"
                onClick={() => onViewDetails(job, 'interview')}
                title="Prepare for interviews"
              >
                <Video size={13} />
                <span>Prep Interview</span>
              </button>
            </div>
          )}

          {(job.status === 'skipped' || job.status === 'failed') && (
            <button 
              className="btn-card-action restore"
              onClick={() => onRestore(job.id)}
              title="Move back to matched queue"
            >
              <RotateCcw size={14} />
              <span>Restore</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
