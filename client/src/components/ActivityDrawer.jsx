import React from 'react';
import { 
  X, 
  History, 
  Send, 
  Check, 
  Sparkles, 
  FileText, 
  Trash2, 
  PlusCircle, 
  AlertCircle 
} from 'lucide-react';

export default function ActivityDrawer({
  isOpen,
  onClose,
  activities,
  onClearActivities
}) {
  if (!isOpen) return null;

  const getActivityIcon = (type) => {
    switch (type) {
      case 'applied':
        return <Send size={14} className="text-purple" />;
      case 'approved':
        return <Check size={14} className="text-emerald" />;
      case 'new_job':
        return <PlusCircle size={14} className="text-indigo" />;
      case 'rematch':
        return <Sparkles size={14} className="text-cyan" />;
      case 'resume':
        return <FileText size={14} className="text-amber" />;
      default:
        return <History size={14} className="text-dim" />;
    }
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-wrap">
            <History size={18} className="text-indigo" />
            <h3>Pipeline Activity Stream</h3>
          </div>
          <button className="btn-close-drawer" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {activities.length === 0 ? (
            <div className="drawer-empty-state">
              <History size={36} className="text-dim" />
              <p>No recent activity logged yet.</p>
            </div>
          ) : (
            <div className="timeline-list">
              {activities.map((item) => (
                <div key={item.id} className="timeline-item">
                  <div className={`timeline-icon-wrap type-${item.type}`}>
                    {getActivityIcon(item.type)}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title-row">
                      <span className="timeline-title">{item.title}</span>
                      <span className="timeline-time">
                        {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    {item.description && (
                      <p className="timeline-desc">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {activities.length > 0 && (
          <div className="drawer-footer">
            <button className="btn-clear-activity" onClick={onClearActivities}>
              <Trash2 size={14} />
              <span>Clear Activity Log</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
