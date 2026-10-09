import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const TABS = [
  { id: 'all', label: 'All Jobs' },
  { id: 'matched', label: 'Matched' },
  { id: 'approved', label: 'Approved' },
  { id: 'applied', label: 'Applied' },
  { id: 'interviewing', label: 'Interviewing 🎙️' },
  { id: 'offer', label: 'Offers 🏆' },
  { id: 'skipped', label: 'Skipped' },
  { id: 'failed', label: 'Failed' }
];

const ROLES = [
  { id: 'all', label: 'All Roles' },
  { id: 'Full-Stack', label: 'Full-Stack' },
  { id: 'Frontend', label: 'Frontend' },
  { id: 'Backend', label: 'Backend' },
  { id: 'AI', label: 'AI / ML Engineer' },
  { id: 'DevOps', label: 'DevOps / Cloud' }
];

export default function FilterBar({
  statusFilter,
  onStatusChange,
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleChange,
  minScore,
  onMinScoreChange,
  stats,
  totalResults
}) {
  const hasActiveFilters = searchQuery || roleFilter !== 'all' || minScore > 0;

  const handleClear = () => {
    onSearchChange('');
    onRoleChange('all');
    onMinScoreChange(0);
  };

  return (
    <div className="filter-panel">
      {/* Top line: Tabs */}
      <div className="filter-tabs-row">
        <div className="filter-tabs">
          {TABS.map((tab) => {
            let count = 0;
            if (stats) {
              if (tab.id === 'all') count = stats.total;
              else count = stats[tab.id] || 0;
            }

            return (
              <button
                key={tab.id}
                className={`tab-btn ${statusFilter === tab.id ? 'active' : ''}`}
                onClick={() => onStatusChange(tab.id)}
              >
                <span>{tab.label}</span>
                {count > 0 && <span className="tab-badge">{count}</span>}
              </button>
            );
          })}
        </div>

        <div className="results-count-badge">
          Showing <strong>{totalResults}</strong> job{totalResults === 1 ? '' : 's'}
        </div>
      </div>

      {/* Controls row: Search, Role filter, Min score slider */}
      <div className="filter-controls-row">
        {/* Search */}
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by title, company, or skills (e.g. React, Python)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => onSearchChange('')}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Role Select */}
        <div className="select-wrap">
          <select
            value={roleFilter}
            onChange={(e) => onRoleChange(e.target.value)}
            className="filter-select"
          >
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Min Score Slider */}
        <div className="slider-wrap" title={`Filter jobs with match score >= ${minScore}%`}>
          <div className="slider-label">
            <SlidersHorizontal size={14} />
            <span>Min ATS:</span>
            <span className="slider-val">{minScore}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="90"
            step="5"
            value={minScore}
            onChange={(e) => onMinScoreChange(Number(e.target.value))}
            className="score-range-input"
          />
        </div>

        {/* Clear Filters Reset */}
        {hasActiveFilters && (
          <button className="btn-clear-filters" onClick={handleClear} title="Reset all filters">
            <X size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
