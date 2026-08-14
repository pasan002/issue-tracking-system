import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Folder, 
  AlertOctagon, 
  Clock, 
  CheckCircle2, 
  Activity, 
  Loader2, 
  MessageSquare, 
  PlusCircle, 
  Bug, 
  FileText
} from 'lucide-react';

const Dashboard = ({ refreshTrigger }) => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStats();
  }, [token, refreshTrigger]);

  if (loading) {
    return (
      <div style={{
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)'
      }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  if (!stats) return <div style={{ padding: '24px', textAlign: 'center' }}>Failed to load metrics.</div>;

  const { counts, recentActivities } = stats;

  // Calculate percentages
  const getPercentage = (value) => {
    if (!counts.total) return 0;
    return Math.round((value / counts.total) * 100);
  };

  const getActivityIcon = (actionText) => {
    const text = actionText.toLowerCase();
    if (text.includes('created')) return <PlusCircle size={14} style={{ color: 'var(--color-primary)' }} />;
    if (text.includes('status')) return <Clock size={14} style={{ color: 'var(--status-progress)' }} />;
    if (text.includes('assigned')) return <CheckCircle2 size={14} style={{ color: 'var(--status-resolved)' }} />;
    if (text.includes('comment')) return <MessageSquare size={14} style={{ color: 'var(--color-accent)' }} />;
    return <Activity size={14} style={{ color: 'var(--text-muted)' }} />;
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Welcome banner */}
      <div className="glass-card" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.05)), var(--bg-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>
          Welcome back, {user?.username} 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Here is what is happening in the workspace today. You have {counts.open + counts.inProgress} active issues to resolve.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="dashboard-grid">
        {/* Metric 1 */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'rgba(99, 102, 241, 0.12)',
            color: 'var(--color-primary)',
            padding: '12px',
            borderRadius: '12px'
          }}>
            <Folder size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>TOTAL ISSUES</div>
            <div style={{ fontSize: '24px', fontWeight: '800', marginTop: '2px' }}>{counts.total}</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'rgba(59, 130, 246, 0.12)',
            color: 'var(--status-open)',
            padding: '12px',
            borderRadius: '12px'
          }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>OPEN ISSUES</div>
            <div style={{ fontSize: '24px', fontWeight: '800', marginTop: '2px', color: 'var(--status-open)' }}>{counts.open}</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'rgba(245, 158, 11, 0.12)',
            color: 'var(--status-progress)',
            padding: '12px',
            borderRadius: '12px'
          }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>IN PROGRESS</div>
            <div style={{ fontSize: '24px', fontWeight: '800', marginTop: '2px', color: 'var(--status-progress)' }}>{counts.inProgress}</div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            color: 'var(--priority-high)',
            padding: '12px',
            borderRadius: '12px'
          }}>
            <AlertOctagon size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>HIGH PRIORITY</div>
            <div style={{ fontSize: '24px', fontWeight: '800', marginTop: '2px', color: 'var(--priority-high)' }}>{counts.highPriority}</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Distributions & Activities */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 4fr', gap: '24px' }}>
        
        {/* Left Side: Breakdowns */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Issue Types Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '20px' }}>Issue Distribution</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Bug size={14} style={{ color: 'var(--priority-high)' }} />
                    Bugs
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>{counts.bugs} ({getPercentage(counts.bugs)}%)</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${getPercentage(counts.bugs)}%`, background: 'var(--priority-high)', borderRadius: '10px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={14} style={{ color: 'var(--color-primary)' }} />
                    Tasks
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>{counts.tasks} ({getPercentage(counts.tasks)}%)</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${getPercentage(counts.tasks)}%`, background: 'var(--color-primary)', borderRadius: '10px' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '20px' }}>Workflow Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Open', count: counts.open, color: 'var(--status-open)' },
                { label: 'In Progress', count: counts.inProgress, color: 'var(--status-progress)' },
                { label: 'Resolved', count: counts.resolved, color: 'var(--status-resolved)' },
                { label: 'Closed', count: counts.closed, color: 'var(--status-closed)' }
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '90px', fontSize: '13px', fontWeight: '600' }}>{item.label}</span>
                  <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${getPercentage(item.count)}%`, backgroundColor: item.color, borderRadius: '10px' }} />
                  </div>
                  <span style={{ width: '40px', textAlign: 'right', fontSize: '13px', color: 'var(--text-muted)' }}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Recent Activity Timeline */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} style={{ color: 'var(--color-primary)' }} />
            Recent Activity Feed
          </h3>

          <div 
            className="hide-scrollbar"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              overflowY: 'auto',
              maxHeight: '340px',
              flex: 1
            }}
          >
            {recentActivities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '14px' }}>
                No activity recorded yet.
              </div>
            ) : (
              recentActivities.map((act) => (
                <div key={act._id} style={{
                  display: 'flex',
                  gap: '12px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.03)'
                }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    {getActivityIcon(act.action)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-main)' }}>
                      {act.action}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                      {act.issue ? (
                        <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                          Issue: {act.issue.title}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--priority-high)' }}>[Deleted Issue]</span>
                      )}
                      <span>•</span>
                      <span>{new Date(act.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
