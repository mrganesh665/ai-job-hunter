import React, { useState, useEffect } from 'react';
import MatchGauge from './MatchGauge';
import { tailorResume, generateOutreach, getInterviewPrep, updateJobStage } from '../api';
import { 
  X, 
  Building2, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  ExternalLink, 
  Check, 
  Send, 
  Trash2,
  AlertCircle,
  Lightbulb,
  Sparkles,
  Mail,
  MessageSquare,
  Copy,
  CheckCheck,
  HelpCircle,
  FileText,
  TrendingUp,
  Award,
  Loader2
} from 'lucide-react';

export default function JobDetailModal({
  job,
  initialTab = 'overview',
  onClose,
  onApprove,
  onApply,
  onSkip,
  onRestore,
  onDelete,
  onRefresh
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'overview' | 'tailor' | 'outreach' | 'interview'
  const [copiedKey, setCopiedKey] = useState(null);

  // AI Copilot state
  const [tailorData, setTailorData] = useState(null);
  const [outreachData, setOutreachData] = useState(null);
  const [interviewData, setInterviewData] = useState(null);

  const [loadingTailor, setLoadingTailor] = useState(false);
  const [loadingOutreach, setLoadingOutreach] = useState(false);
  const [loadingInterview, setLoadingInterview] = useState(false);

  // Copy helper
  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Load Tailor data on demand
  useEffect(() => {
    if (activeTab === 'tailor' && !tailorData && job?.id) {
      setLoadingTailor(true);
      tailorResume(job.id)
        .then((res) => setTailorData(res))
        .catch((err) => console.error(err))
        .finally(() => setLoadingTailor(false));
    }
  }, [activeTab, tailorData, job?.id]);

  // Load Outreach data on demand
  useEffect(() => {
    if (activeTab === 'outreach' && !outreachData && job?.id) {
      setLoadingOutreach(true);
      generateOutreach(job.id)
        .then((res) => setOutreachData(res))
        .catch((err) => console.error(err))
        .finally(() => setLoadingOutreach(false));
    }
  }, [activeTab, outreachData, job?.id]);

  // Load Interview data on demand
  useEffect(() => {
    if (activeTab === 'interview' && !interviewData && job?.id) {
      setLoadingInterview(true);
      getInterviewPrep(job.id)
        .then((res) => setInterviewData(res))
        .catch((err) => console.error(err))
        .finally(() => setLoadingInterview(false));
    }
  }, [activeTab, interviewData, job?.id]);

  const handleStageChange = async (newStage) => {
    try {
      await updateJobStage(job.id, newStage);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(`Error updating stage: ${err.message}`);
    }
  };

  if (!job) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window job-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className={`status-badge-lg ${job.status}`}>{job.status.toUpperCase()}</span>
            <h2>{job.title}</h2>
            <div className="modal-subtitle">
              <span><Building2 size={15} /> {job.company}</span>
              <span><MapPin size={15} /> {job.location}</span>
              {job.experience && <span><Briefcase size={15} /> {job.experience}</span>}
              {job.salary && <span><DollarSign size={15} /> {job.salary}</span>}
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="modal-nav-tabs">
          <button
            className={`modal-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            ATS Breakdown & Description
          </button>
          <button
            className={`modal-tab ${activeTab === 'tailor' ? 'active' : ''}`}
            onClick={() => setActiveTab('tailor')}
          >
            <Sparkles size={14} className="inline mr-1 text-cyan" />
            ⚡ Boost Resume (ATS Tailor)
          </button>
          <button
            className={`modal-tab ${activeTab === 'outreach' ? 'active' : ''}`}
            onClick={() => setActiveTab('outreach')}
          >
            <Mail size={14} className="inline mr-1 text-purple" />
            📨 Recruiter Cold Outreach
          </button>
          <button
            className={`modal-tab ${activeTab === 'interview' ? 'active' : ''}`}
            onClick={() => setActiveTab('interview')}
          >
            <HelpCircle size={14} className="inline mr-1 text-amber" />
            🎯 Interview Cheat Sheet
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              {/* ATS Score Hero Box */}
              <div className="ats-score-hero-box">
                <div className="ats-hero-left">
                  <MatchGauge score={job.matchScore} size={74} strokeWidth={6} />
                  <div className="ats-hero-meta">
                    <div className="ats-score-title">
                      ATS Match Score: <span className="highlight-score">{job.matchScore}/100</span>
                    </div>
                    <p className="ats-hero-summary">{job.summary}</p>
                  </div>
                </div>
                {job.url && (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-external-link"
                  >
                    <span>Open Listing</span>
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>

              {/* Skills Comparison */}
              <div className="skills-comparison-grid">
                <div className="skills-column matched-col">
                  <div className="column-header">
                    <Check size={16} className="text-emerald" />
                    <h4>Matched Skills ({job.matchedSkills?.length || 0})</h4>
                  </div>
                  <p className="col-desc">Present in your resume and matching role requirements.</p>
                  <div className="chips-container">
                    {job.matchedSkills && job.matchedSkills.length > 0 ? (
                      job.matchedSkills.map((s) => (
                        <span key={s} className="skill-chip matched large">
                          ✓ {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-dim text-sm">No direct skill matches detected.</span>
                    )}
                  </div>
                </div>

                <div className="skills-column missing-col">
                  <div className="column-header">
                    <AlertCircle size={16} className="text-amber" />
                    <h4>Skill Gaps to Address ({job.missingSkills?.length || 0})</h4>
                  </div>
                  <p className="col-desc">Keywords to infuse into your application.</p>
                  <div className="chips-container">
                    {job.missingSkills && job.missingSkills.length > 0 ? (
                      job.missingSkills.map((s) => (
                        <span key={s} className="skill-chip missing large">
                          ⚠ {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-emerald text-sm">Zero missing skills! Perfect ATS alignment.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Strategy tip */}
              <div className="ai-tip-box">
                <Lightbulb size={18} className="tip-icon" />
                <div className="tip-content">
                  <strong>How to land this interview:</strong>
                  <p>
                    Switch to the <strong>"⚡ Boost Resume"</strong> tab above to get custom bullet points tailored for this job, or generate a <strong>LinkedIn Recruiter InMail</strong> to bypass the online queue.
                  </p>
                </div>
              </div>

              {/* Job Description */}
              <div className="job-desc-section">
                <h4>Full Job Description</h4>
                <div className="desc-box">
                  {job.description || 'No detailed description provided.'}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: RESUME TAILOR */}
          {activeTab === 'tailor' && (
            <div className="tab-pane-content">
              {loadingTailor ? (
                <div className="loading-pane">
                  <Loader2 size={32} className="spin-icon text-cyan" />
                  <p>Generating ATS-optimized resume bullet points...</p>
                </div>
              ) : tailorData ? (
                <div className="tailor-results-container">
                  {/* Score Boost Banner */}
                  <div className="score-boost-card">
                    <div className="boost-meta">
                      <div className="boost-badge">
                        <TrendingUp size={16} />
                        <span>ATS Score Potential</span>
                      </div>
                      <div className="boost-numbers">
                        <span className="score-before">{tailorData.originalScore}%</span>
                        <span className="boost-arrow">➔</span>
                        <span className="score-after">{tailorData.boostedScore}%</span>
                        <span className="gain-pill">{tailorData.scoreGain}</span>
                      </div>
                    </div>
                    <p className="boost-desc">
                      By inserting targeted action verbs and matching keywords, your application passes automated screeners into the recruiter shortlist.
                    </p>
                  </div>

                  {/* Tailored Professional Summary */}
                  <div className="copilot-section">
                    <div className="copilot-header">
                      <h4>Tailored Resume Summary</h4>
                      <button
                        className="btn-copy-snippet"
                        onClick={() => handleCopy(tailorData.tailoredSummary, 'summary')}
                      >
                        {copiedKey === 'summary' ? <CheckCheck size={14} className="text-emerald" /> : <Copy size={14} />}
                        <span>{copiedKey === 'summary' ? 'Copied!' : 'Copy Summary'}</span>
                      </button>
                    </div>
                    <div className="snippet-box">{tailorData.tailoredSummary}</div>
                  </div>

                  {/* Tailored Experience Bullet Points */}
                  <div className="copilot-section">
                    <div className="copilot-header">
                      <h4>Optimized Experience Bullets (CAR Framework)</h4>
                      <button
                        className="btn-copy-snippet"
                        onClick={() => handleCopy(tailorData.tailoredBullets.join('\n• '), 'bullets')}
                      >
                        {copiedKey === 'bullets' ? <CheckCheck size={14} className="text-emerald" /> : <Copy size={14} />}
                        <span>{copiedKey === 'bullets' ? 'Copied All' : 'Copy All Bullets'}</span>
                      </button>
                    </div>
                    <div className="bullets-list">
                      {tailorData.tailoredBullets.map((bullet, idx) => (
                        <div key={idx} className="bullet-item">
                          <span className="bullet-dot">•</span>
                          <span className="bullet-text">{bullet}</span>
                          <button
                            className="btn-mini-copy"
                            onClick={() => handleCopy(bullet, `b-${idx}`)}
                            title="Copy this bullet"
                          >
                            {copiedKey === `b-${idx}` ? <CheckCheck size={12} className="text-emerald" /> : <Copy size={12} />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 3: OUTREACH SUITE */}
          {activeTab === 'outreach' && (
            <div className="tab-pane-content">
              {loadingOutreach ? (
                <div className="loading-pane">
                  <Loader2 size={32} className="spin-icon text-purple" />
                  <p>Composing personalized recruiter outreach templates...</p>
                </div>
              ) : outreachData ? (
                <div className="outreach-results-container">
                  {/* LinkedIn InMail */}
                  <div className="copilot-section">
                    <div className="copilot-header">
                      <div className="header-with-badge">
                        <MessageSquare size={16} className="text-cyan" />
                        <h4>LinkedIn Connection Message (under 300 chars)</h4>
                        <span className="badge-tag">High Reply Rate (~30%)</span>
                      </div>
                      <button
                        className="btn-copy-snippet"
                        onClick={() => handleCopy(outreachData.linkedinMessage, 'linkedin')}
                      >
                        {copiedKey === 'linkedin' ? <CheckCheck size={14} className="text-emerald" /> : <Copy size={14} />}
                        <span>{copiedKey === 'linkedin' ? 'Copied!' : 'Copy Note'}</span>
                      </button>
                    </div>
                    <div className="snippet-box">{outreachData.linkedinMessage}</div>
                  </div>

                  {/* Hiring Manager Cold Email */}
                  <div className="copilot-section">
                    <div className="copilot-header">
                      <div className="header-with-badge">
                        <Mail size={16} className="text-purple" />
                        <h4>Hiring Manager Direct Email</h4>
                      </div>
                      <button
                        className="btn-copy-snippet"
                        onClick={() => handleCopy(`${outreachData.emailSubject}\n\n${outreachData.coldEmail}`, 'email')}
                      >
                        {copiedKey === 'email' ? <CheckCheck size={14} className="text-emerald" /> : <Copy size={14} />}
                        <span>{copiedKey === 'email' ? 'Copied!' : 'Copy Email'}</span>
                      </button>
                    </div>
                    <div className="email-subject-line">
                      <span className="text-dim">Subject:</span> <strong>{outreachData.emailSubject}</strong>
                    </div>
                    <div className="snippet-box whitespace-pre">{outreachData.coldEmail}</div>
                  </div>

                  {/* Full Cover Letter */}
                  <div className="copilot-section">
                    <div className="copilot-header">
                      <div className="header-with-badge">
                        <FileText size={16} className="text-amber" />
                        <h4>Tailored Cover Letter</h4>
                      </div>
                      <button
                        className="btn-copy-snippet"
                        onClick={() => handleCopy(outreachData.coverLetter, 'coverLetter')}
                      >
                        {copiedKey === 'coverLetter' ? <CheckCheck size={14} className="text-emerald" /> : <Copy size={14} />}
                        <span>{copiedKey === 'coverLetter' ? 'Copied!' : 'Copy Letter'}</span>
                      </button>
                    </div>
                    <div className="snippet-box whitespace-pre">{outreachData.coverLetter}</div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 4: INTERVIEW CHEAT SHEET */}
          {activeTab === 'interview' && (
            <div className="tab-pane-content">
              {loadingInterview ? (
                <div className="loading-pane">
                  <Loader2 size={32} className="spin-icon text-amber" />
                  <p>Predicting technical & behavioral interview questions...</p>
                </div>
              ) : interviewData ? (
                <div className="interview-results-container">
                  {/* Top Tech Questions */}
                  <div className="copilot-section">
                    <h4>🔥 Top 3 Predicted Technical Interview Questions</h4>
                    <div className="questions-accordion">
                      {interviewData.topTechnicalQuestions.map((q, idx) => (
                        <div key={idx} className="question-card">
                          <div className="q-badge">{q.focusArea}</div>
                          <div className="q-title">Q{idx + 1}: {q.question}</div>
                          <div className="q-points">
                            <strong>Recommended Answer Angle:</strong>
                            <ul>
                              {q.talkingPoints.map((pt, pIdx) => (
                                <li key={pIdx}>{pt}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Behavioral Questions */}
                  <div className="copilot-section">
                    <h4>💡 Behavioral Questions (STAR Method)</h4>
                    {interviewData.behavioralQuestions.map((b, idx) => (
                      <div key={idx} className="behavioral-card">
                        <div className="b-title">"{b.question}"</div>
                        <div className="b-guidance">
                          <strong>STAR Framework Hint:</strong> {b.starGuidance}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reverse Interview Questions */}
                  <div className="copilot-section">
                    <h4>🌟 Questions You Should Ask the Interviewer</h4>
                    <p className="text-dim text-sm mb-2">
                      Asking sharp questions sets you apart from 95% of other applicants.
                    </p>
                    <div className="reverse-questions-box">
                      {interviewData.reverseQuestionsToAsk.map((rq, idx) => (
                        <div key={idx} className="rq-item">
                          <span>{idx + 1}.</span>
                          <p>{rq}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="modal-footer">
          <div className="footer-left">
            {/* Stage Quick Transitions */}
            <div className="stage-selector-wrap">
              <span className="text-dim text-sm">Move Pipeline:</span>
              <button
                className={`btn-stage-chip ${job.status === 'interviewing' ? 'active' : ''}`}
                onClick={() => handleStageChange('interviewing')}
              >
                Interviewing 🎙️
              </button>
              <button
                className={`btn-stage-chip ${job.status === 'offer' ? 'active' : ''}`}
                onClick={() => handleStageChange('offer')}
              >
                Got Offer! 🏆
              </button>
            </div>
          </div>

          <div className="footer-right">
            {job.status === 'matched' && (
              <button
                className="btn-modal-action approve"
                onClick={() => {
                  onApprove(job.id);
                  onClose();
                }}
              >
                <Check size={16} />
                <span>Approve Job</span>
              </button>
            )}

            {job.status === 'approved' && (
              <button
                className="btn-modal-action apply"
                onClick={() => {
                  onApply(job.id);
                  onClose();
                }}
              >
                <Send size={16} />
                <span>Submit Application Now</span>
              </button>
            )}

            <button className="btn-modal-close" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
