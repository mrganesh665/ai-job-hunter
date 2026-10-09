import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import { 
  Bot, 
  FileText, 
  PlusCircle, 
  History, 
  RotateCcw, 
  Sparkles, 
  Zap, 
  Globe 
} from 'lucide-react';

export default function Navbar({ 
  resume, 
  onOpenResume, 
  onOpenAddJob, 
  onOpenDiscover,
  onOpenActivity, 
  onRematchAll, 
  onResetStore,
  rematching,
  activityCount,
  lastUpdated
}) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="brand-logo">
          <div className="brand-icon-wrap">
            <Zap className="brand-icon" size={20} />
          </div>
          <div className="brand-titles">
            <div className="brand-name">
              AI Job Hunter
              <span className="brand-badge">PRO</span>
            </div>
            <div className="brand-sub">Autonomous ATS Career Copilot</div>
          </div>
        </div>

        <div className="live-status-pill">
          <span className="live-pulse" />
          <span className="live-text">
            Live Stream {lastUpdated ? `· ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
          </span>
        </div>
      </div>

      <div className="navbar-right">
        {/* Interactive Theme Switcher */}
        <ThemeSwitcher />

        {/* Candidate Resume Pill */}
        <button 
          className="btn-nav-resume" 
          onClick={onOpenResume} 
          title="Click to view or upload candidate resume"
        >
          <div className="avatar-chip">
            <FileText size={15} />
          </div>
          <div className="resume-meta">
            <span className="candidate-name">{resume?.name || 'Candidate Resume'}</span>
            <span className="candidate-skills-count">
              {resume?.skills?.length || 0} Skills Parsed
            </span>
          </div>
          <span className="badge-edit">Edit ATS</span>
        </button>

        {/* Action: Live Job Discovery */}
        <button 
          className="btn-nav-action live-discover" 
          onClick={onOpenDiscover}
          title="Scrape and auto-score fresh live jobs from tech boards"
        >
          <Globe size={16} />
          <span>Discover Live</span>
        </button>

        {/* Action: Add Custom Job */}
        <button 
          className="btn-nav-action primary" 
          onClick={onOpenAddJob}
          title="Add a custom job description for instant ATS scoring"
        >
          <PlusCircle size={16} />
          <span>New Job</span>
        </button>

        {/* Action: Rematch All */}
        <button 
          className={`btn-nav-action secondary ${rematching ? 'loading' : ''}`} 
          onClick={onRematchAll}
          disabled={rematching}
          title="Re-calculate AI ATS match scores for all jobs against current resume"
        >
          <Sparkles size={16} className={rematching ? 'spin-icon' : ''} />
          <span>{rematching ? 'Matching...' : 'Re-Match'}</span>
        </button>

        {/* Action: Activity Feed */}
        <button 
          className="btn-nav-action icon-only" 
          onClick={onOpenActivity} 
          title="View recent application and scoring activity"
        >
          <History size={18} />
          {activityCount > 0 && (
            <span className="nav-badge-dot">{activityCount > 9 ? '9+' : activityCount}</span>
          )}
        </button>

        {/* Action: Reset sample dataset */}
        <button 
          className="btn-nav-action icon-only text-muted" 
          onClick={onResetStore} 
          title="Restore sample tech jobs dataset"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </header>
  );
}
