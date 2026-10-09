import React, { useState } from 'react';
import { X, Globe, Sparkles, Loader2, ArrowRight } from 'lucide-react';

const POPULAR_QUERIES = [
  'React',
  'Full Stack',
  'Frontend',
  'Node.js',
  'Python',
  'AI Engineer',
  'DevOps',
  'TypeScript'
];

export default function DiscoverJobsModal({ onClose, onDiscover }) {
  const [query, setQuery] = useState('React');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      await onDiscover(query.trim());
      onClose();
    } catch (err) {
      alert(`Error fetching live jobs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window discover-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4' }}>
              <Globe size={18} />
            </div>
            <div>
              <h2>Live Job Discovery & ATS Scoring</h2>
              <p className="modal-subtitle">
                Scrapes fresh listings from RemoteOK & tech boards and scores them against your resume
              </p>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Target Role / Tech Stack Keyword</label>
              <div className="input-with-icon">
                <Globe size={16} className="input-icon" />
                <input
                  type="text"
                  placeholder="e.g. React, Full Stack, Python, Node, AI..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="quick-roles-section">
              <span className="text-dim text-sm">Quick presets:</span>
              <div className="chips-list">
                {POPULAR_QUERIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className={`skill-chip ${query.toLowerCase() === q.toLowerCase() ? 'matched' : 'more'}`}
                    onClick={() => setQuery(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="discovery-benefit-banner">
              <Sparkles size={18} className="text-cyan flex-shrink-0" />
              <div>
                <strong>Why live discovery gets you hired faster:</strong>
                <p>
                  Applying within the first 2 hours of a role being posted boosts your interview callback rate by <strong>4x</strong> before the applicant floodgates open.
                </p>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-modal-close" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-modal-action primary"
              disabled={loading}
              style={{ background: 'linear-gradient(135deg, #0891b2, #6366f1)' }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spin-icon" />
                  <span>Scanning & Scoring...</span>
                </>
              ) : (
                <>
                  <Globe size={16} />
                  <span>Discover & Auto-Score</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
