import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  getJobs, 
  getStats, 
  getResume, 
  getActivities, 
  approveJob, 
  applyJob, 
  skipJob, 
  restoreJob, 
  deleteJob, 
  addJob, 
  rematchAllJobs, 
  updateResume, 
  uploadResumeFile, 
  resetStore,
  discoverLiveJobs
} from './api';

import Navbar from './components/Navbar';
import StatsRow from './components/StatsRow';
import FilterBar from './components/FilterBar';
import JobCard from './components/JobCard';
import JobDetailModal from './components/JobDetailModal';
import ResumeModal from './components/ResumeModal';
import AddJobModal from './components/AddJobModal';
import ActivityDrawer from './components/ActivityDrawer';
import DiscoverJobsModal from './components/DiscoverJobsModal';

import './App.css';

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [resume, setResume] = useState(null);
  const [activities, setActivities] = useState([]);

  // Filters
  const [statusFilter, setStatusFilter] = useState('matched');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [minScore, setMinScore] = useState(0);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [rematching, setRematching] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Modals & Drawers
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalInitialTab, setModalInitialTab] = useState('overview');

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  const handleDiscoverLiveJobs = async (query) => {
    try {
      const res = await discoverLiveJobs(query);
      showToast(res.message || 'Live tech jobs fetched & scored!', 'success');
      await loadData(true);
      return res;
    } catch (err) {
      showToast(`Discovery error: ${err.message}`, 'error');
      throw err;
    }
  };

  // Load jobs and stats
  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [jobsData, statsData, resumeData, activitiesData] = await Promise.all([
        getJobs({
          status: statusFilter,
          search: searchQuery,
          role: roleFilter,
          minScore: minScore > 0 ? minScore : undefined
        }),
        getStats(),
        getResume(),
        getActivities()
      ]);

      setJobs(jobsData.jobs || []);
      setStats(statsData);
      setResume(resumeData);
      setActivities(activitiesData.activities || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load application data:', err);
      if (!silent) {
        showToast(`Failed to connect to API: ${err.message}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery, roleFilter, minScore]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Periodic background refresh
  useEffect(() => {
    const timer = setInterval(() => {
      loadData(true);
    }, 12000);
    return () => clearInterval(timer);
  }, [loadData]);

  // Actions
  const handleApprove = async (id) => {
    try {
      await approveJob(id);
      showToast('Job approved and moved to application queue!', 'success');
      loadData(true);
    } catch (err) {
      showToast(`Approval failed: ${err.message}`, 'error');
    }
  };

  const handleApply = async (id) => {
    try {
      await applyJob(id);
      // Trigger festive celebration
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
      showToast('🚀 Application recorded successfully!', 'success');
      loadData(true);
    } catch (err) {
      showToast(`Application error: ${err.message}`, 'error');
    }
  };

  const handleSkip = async (id) => {
    try {
      await skipJob(id);
      showToast('Job listing skipped', 'info');
      loadData(true);
    } catch (err) {
      showToast(`Error skipping job: ${err.message}`, 'error');
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreJob(id);
      showToast('Job restored back to matched pipeline', 'info');
      loadData(true);
    } catch (err) {
      showToast(`Error restoring job: ${err.message}`, 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteJob(id);
      showToast('Job removed from tracking database', 'info');
      loadData(true);
    } catch (err) {
      showToast(`Error deleting job: ${err.message}`, 'error');
    }
  };

  const handleAddJob = async (jobData) => {
    try {
      const res = await addJob(jobData);
      showToast(`Job "${res.job?.title}" created with ATS score ${res.job?.matchScore}%!`, 'success');
      loadData(true);
      return res;
    } catch (err) {
      showToast(`Failed to add job: ${err.message}`, 'error');
      throw err;
    }
  };

  const handleRematchAll = async () => {
    setRematching(true);
    try {
      await rematchAllJobs();
      showToast('Recalculated ATS match scores across all active jobs!', 'success');
      await loadData(true);
    } catch (err) {
      showToast(`Rematch error: ${err.message}`, 'error');
    } finally {
      setRematching(false);
    }
  };

  const handleUpdateResume = async (profileData, autoRematch) => {
    try {
      await updateResume(profileData, autoRematch);
      showToast('Candidate ATS resume profile updated successfully!', 'success');
      await loadData(true);
    } catch (err) {
      showToast(`Profile update error: ${err.message}`, 'error');
      throw err;
    }
  };

  const handleUploadResumeFile = async (file) => {
    try {
      const res = await uploadResumeFile(file);
      showToast(res.message || 'Resume uploaded and scored!', 'success');
      await loadData(true);
      return res;
    } catch (err) {
      showToast(`Upload failed: ${err.message}`, 'error');
      throw err;
    }
  };

  const handleResetStore = async () => {
    if (window.confirm('Restore sample jobs and default candidate profile?')) {
      try {
        await resetStore();
        showToast('Sample dataset restored', 'info');
        loadData(true);
      } catch (err) {
        showToast(`Reset failed: ${err.message}`, 'error');
      }
    }
  };

  return (
    <div className="app-root">
      {/* Top Navbar */}
      <Navbar
        resume={resume}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenAddJob={() => setIsAddJobOpen(true)}
        onOpenDiscover={() => setIsDiscoverOpen(true)}
        onOpenActivity={() => setIsActivityOpen(true)}
        onRematchAll={handleRematchAll}
        onResetStore={handleResetStore}
        rematching={rematching}
        activityCount={activities.length}
        lastUpdated={lastUpdated}
      />

      <main className="main-content">
        {/* KPI Summary Cards */}
        <StatsRow
          stats={stats}
          currentFilter={statusFilter}
          onSelectFilter={(tab) => setStatusFilter(tab)}
        />

        {/* Filter & Search Bar */}
        <FilterBar
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          roleFilter={roleFilter}
          onRoleChange={setRoleFilter}
          minScore={minScore}
          onMinScoreChange={setMinScore}
          stats={stats}
          totalResults={jobs.length}
        />

        {/* Job Listings Stream */}
        <section className="jobs-stream-section">
          {loading ? (
            <div className="skeleton-list">
              <div className="skeleton-card" />
              <div className="skeleton-card" />
              <div className="skeleton-card" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="empty-state-card">
              <div className="empty-emoji">🎯</div>
              <h3>No jobs found matching your criteria</h3>
              <p>
                {searchQuery || minScore > 0
                  ? 'Try broadening your search query or lowering the minimum ATS score filter.'
                  : `There are currently no listings in the "${statusFilter}" status.`}
              </p>
              <div className="empty-actions">
                <button
                  className="btn-empty-action"
                  onClick={() => setIsDiscoverOpen(true)}
                  style={{ background: 'linear-gradient(135deg, #0891b2, #6366f1)' }}
                >
                  Discover Live Postings
                </button>
                <button
                  className="btn-empty-secondary"
                  onClick={() => setIsAddJobOpen(true)}
                >
                  Track Custom Job
                </button>
              </div>
            </div>
          ) : (
            <div className="jobs-grid">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApprove={handleApprove}
                  onApply={handleApply}
                  onSkip={handleSkip}
                  onRestore={handleRestore}
                  onViewDetails={(j, tab = 'overview') => {
                    setSelectedJob(j);
                    setModalInitialTab(tab);
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Job Details Modal with Copilot */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          initialTab={modalInitialTab}
          onClose={() => setSelectedJob(null)}
          onApprove={handleApprove}
          onApply={handleApply}
          onSkip={handleSkip}
          onRestore={handleRestore}
          onDelete={handleDelete}
          onRefresh={() => loadData(true)}
        />
      )}

      {/* Live Job Discovery Modal */}
      {isDiscoverOpen && (
        <DiscoverJobsModal
          onClose={() => setIsDiscoverOpen(false)}
          onDiscover={handleDiscoverLiveJobs}
        />
      )}

      {/* Resume Profile & Upload Modal */}
      {isResumeOpen && (
        <ResumeModal
          resume={resume}
          onClose={() => setIsResumeOpen(false)}
          onUpdateResume={handleUpdateResume}
          onUploadFile={handleUploadResumeFile}
        />
      )}

      {/* Add Custom Job Modal */}
      {isAddJobOpen && (
        <AddJobModal
          onClose={() => setIsAddJobOpen(false)}
          onAddJob={handleAddJob}
        />
      )}

      {/* Activity Timeline Drawer */}
      <ActivityDrawer
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
        activities={activities}
        onClearActivities={async () => {
          await fetch('/api/activity', { method: 'DELETE' });
          setActivities([]);
          showToast('Activity history cleared', 'info');
        }}
      />

      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
