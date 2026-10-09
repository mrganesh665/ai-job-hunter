import React from 'react';
import { 
  Briefcase, 
  Target, 
  CheckCircle2, 
  Send, 
  Archive, 
  TrendingUp,
  Percent
} from 'lucide-react';

export default function StatsRow({ stats, currentFilter, onSelectFilter }) {
  if (!stats) return null;

  const cards = [
    {
      id: 'all',
      label: 'Total Discovered',
      value: stats.total,
      sub: 'All active scraped listings',
      icon: Briefcase,
      color: '#818cf8',
      bgGlow: 'rgba(129, 140, 248, 0.12)'
    },
    {
      id: 'matched',
      label: 'AI Scored & Ready',
      value: stats.matched,
      sub: 'Awaiting human review',
      icon: Target,
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
      highlight: stats.matched > 0
    },
    {
      id: 'approved',
      label: 'Approved Queue',
      value: stats.approved,
      sub: 'Ready for auto-application',
      icon: CheckCircle2,
      color: '#38bdf8',
      bgGlow: 'rgba(56, 189, 248, 0.12)',
      highlight: stats.approved > 0
    },
    {
      id: 'applied',
      label: 'Applied',
      value: stats.applied,
      sub: 'Applications dispatched',
      icon: Send,
      color: '#c084fc',
      bgGlow: 'rgba(192, 132, 252, 0.12)'
    },
    {
      id: 'interviewing',
      label: 'Interviewing',
      value: stats.interviewing || 0,
      sub: 'Active interview stages',
      icon: Target,
      color: '#06b6d4',
      bgGlow: 'rgba(6, 182, 212, 0.15)',
      highlight: (stats.interviewing || 0) > 0
    },
    {
      id: 'offer',
      label: 'Job Offers',
      value: stats.offer || 0,
      sub: 'Celebration milestone 🏆',
      icon: CheckCircle2,
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
      highlight: (stats.offer || 0) > 0
    },
    {
      id: 'skipped',
      label: 'Archived / Skip',
      value: stats.skipped + (stats.failed || 0),
      sub: `${stats.failed || 0} disqualified`,
      icon: Archive,
      color: '#94a3b8',
      bgGlow: 'rgba(148, 163, 184, 0.1)'
    }
  ];

  return (
    <div className="stats-container">
      <div className="stats-grid">
        {cards.map((card) => {
          const Icon = card.icon;
          const isActive = currentFilter === card.id;

          return (
            <div
              key={card.id}
              className={`stat-card ${isActive ? 'active-filter' : ''} ${card.highlight ? 'has-pending' : ''}`}
              onClick={() => onSelectFilter(card.id)}
              role="button"
              tabIndex={0}
            >
              <div className="stat-card-header">
                <div 
                  className="stat-icon-wrapper"
                  style={{ color: card.color, backgroundColor: card.bgGlow }}
                >
                  <Icon size={18} />
                </div>
                {card.highlight && (
                  <span className="stat-pill-indicator">Action Ready</span>
                )}
              </div>
              <div className="stat-value-group">
                <span className="stat-number">{card.value}</span>
                <span className="stat-label">{card.label}</span>
              </div>
              <div className="stat-sub">{card.sub}</div>
              <div 
                className="stat-bar-accent" 
                style={{ backgroundColor: card.color }} 
              />
            </div>
          );
        })}

        {/* Global Average Match Score Banner Widget */}
        <div className="stat-card avg-score-card">
          <div className="stat-card-header">
            <div 
              className="stat-icon-wrapper" 
              style={{ color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.15)' }}
            >
              <TrendingUp size={18} />
            </div>
            <span className="stat-pill-indicator gold">Avg Match</span>
          </div>
          <div className="stat-value-group">
            <div className="avg-score-display">
              <span className="stat-number">{stats.avgScore || 0}</span>
              <span className="stat-unit">%</span>
            </div>
            <span className="stat-label">Resume Relevance</span>
          </div>
          <div className="stat-sub">Across all tracked tech roles</div>
          <div 
            className="stat-bar-accent" 
            style={{ backgroundColor: '#f59e0b' }} 
          />
        </div>
      </div>
    </div>
  );
}
