import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Loader2, 
  Search, 
  Filter, 
  Kanban, 
  Grid, 
  Calendar, 
  User, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight,
  Bug,
  FileText
} from 'lucide-react';
import Modal from '../components/Modal';
import IssueDetailModalContent from '../components/IssueDetailModalContent';

const IssueList = ({ refreshTrigger, setRefreshTrigger }) => {
  const { token } = useAuth();
  
  // Data State
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('');
  
  // View State (Kanban vs Grid)
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'grid'
  
  // Pagination State
  const [page, setPage] = useState(1);
  const limit = viewMode === 'kanban' ? 50 : 10; // Fetch all for Kanban, smaller pages for list

  // Modal State
  const [selectedIssueId, setSelectedIssueId] = useState(null);

  // Fetch issues
  const fetchIssuesList = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page,
        limit,
        q: search,
        type: selectedType,
        priority: selectedPriority,
        assignee: selectedAssignee,
      });

      const res = await fetch(`http://localhost:5000/api/issues?${queryParams.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setIssues(data.issues);
        setPagination({
          page: data.page,
          pages: data.pages,
          total: data.total
        });
      }
    } catch (err) {
      console.error('Error fetching issues:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users for assignee selector filter
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/users', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    if (token) fetchUsers();
  }, [token]);

  // Refetch when search, filters, pagination page, or global updates change
  useEffect(() => {
    if (token) {
      fetchIssuesList();
    }
  }, [token, search, selectedType, selectedPriority, selectedAssignee, page, viewMode, refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'var(--priority-high)';
    if (priority === 'Medium') return 'var(--priority-medium)';
    return 'var(--priority-low)';
  };

  // -------------------------------------------------------------
  // RENDER KANBAN VIEW
  // -------------------------------------------------------------
  const renderKanban = () => {
    const columns = [
      { id: 'Open', title: 'Open', color: 'var(--status-open)' },
      { id: 'In Progress', title: 'In Progress', color: 'var(--status-progress)' },
      { id: 'Resolved', title: 'Resolved', color: 'var(--status-resolved)' },
      { id: 'Closed', title: 'Closed', color: 'var(--status-closed)' },
    ];

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        overflowX: 'auto',
        paddingBottom: '20px',
        alignItems: 'flex-start'
      }}>
        {columns.map(col => {
          const colIssues = issues.filter(issue => issue.status === col.id);

          return (
            <div key={col.id} className="glass-card" style={{
              padding: '16px',
              backgroundColor: 'rgba(22, 26, 41, 0.4)',
              minHeight: '480px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {/* Column Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '8px',
                borderBottom: `2px solid ${col.color}`
              }}>
                <span style={{ fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {col.title}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: 'var(--text-muted)'
                }}>
                  {colIssues.length}
                </span>
              </div>

              {/* Column Cards */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                overflowY: 'auto',
                maxHeight: '450px'
              }} className="hide-scrollbar">
                {colIssues.length === 0 ? (
                  <div style={{
                    padding: '24px 0',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '12px',
                    border: '1px dashed var(--border-color)',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    No issues
                  </div>
                ) : (
                  colIssues.map(issue => (
                    <div 
                      key={issue._id}
                      onClick={() => setSelectedIssueId(issue._id)}
                      className="glass-card glass-card-interactive"
                      style={{
                        padding: '14px',
                        borderLeft: `4px solid ${getPriorityColor(issue.priority)}`,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: '700', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {issue.title}
                        </h4>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {/* Type Badge */}
                        <span style={{
                          fontSize: '10px',
                          fontWeight: '600',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: issue.type === 'Bug' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(99, 102, 241, 0.08)',
                          color: issue.type === 'Bug' ? 'var(--priority-high)' : 'var(--color-primary)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}>
                          {issue.type === 'Bug' ? <Bug size={10} /> : <FileText size={10} />}
                          {issue.type}
                        </span>

                        {/* Priority Badge */}
                        <span style={{
                          fontSize: '10px',
                          fontWeight: '600',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--border-color)',
                          color: getPriorityColor(issue.priority),
                        }}>
                          {issue.priority}
                        </span>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                        paddingTop: '6px',
                        borderTop: '1px solid rgba(255,255,255,0.02)'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <User size={12} />
                          <span>{issue.assignee ? issue.assignee.username : 'Unassigned'}</span>
                        </span>
                        
                        {issue.dueDate && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={12} />
                            <span>{new Date(issue.dueDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // -------------------------------------------------------------
  // RENDER GRID LIST VIEW
  // -------------------------------------------------------------
  const renderGrid = () => {
    if (issues.length === 0) {
      return (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No issues found matching the selected filters.
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {issues.map(issue => (
          <div 
            key={issue._id}
            onClick={() => setSelectedIssueId(issue._id)}
            className="glass-card glass-card-interactive"
            style={{
              padding: '16px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
              <div style={{
                width: '6px',
                alignSelf: 'stretch',
                borderRadius: '10px',
                backgroundColor: getPriorityColor(issue.priority)
              }} />

              <div style={{ minWidth: 0 }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {issue.title}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span style={{ color: issue.type === 'Bug' ? 'var(--priority-high)' : 'var(--color-primary)', fontWeight: '600' }}>
                    {issue.type}
                  </span>
                  <span>•</span>
                  <span>Assignee: <b>{issue.assignee ? issue.assignee.username : 'Unassigned'}</b></span>
                  <span>•</span>
                  <span>Creator: <b>{issue.creator?.username}</b></span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span className={`badge badge-${issue.status.toLowerCase().replace(' ', '-')}`}>
                {issue.status}
              </span>
              <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>
        ))}

        {/* Pagination Controls */}
        {pagination.pages > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '20px'
          }}>
            <button 
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="btn btn-secondary"
              style={{ padding: '8px 12px' }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Page <b>{page}</b> of {pagination.pages}
            </span>
            <button 
              onClick={() => setPage(prev => Math.min(prev + 1, pagination.pages))}
              disabled={page === pagination.pages}
              className="btn btn-secondary"
              style={{ padding: '8px 12px' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top action header: Filter controls & toggle */}
      <div className="glass-card" style={{
        padding: '16px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
          padding: '8px 14px',
          borderRadius: 'var(--radius-md)',
          width: '260px'
        }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search issues..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ fontSize: '13px', width: '100%' }}
          />
        </div>

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* Type filter */}
          <select 
            value={selectedType}
            onChange={(e) => { setSelectedType(e.target.value); setPage(1); }}
            className="form-input"
            style={{ padding: '8px 12px', fontSize: '13px', minWidth: '110px' }}
          >
            <option value="">All Types</option>
            <option value="Bug">Bug</option>
            <option value="Task">Task</option>
          </select>

          {/* Priority filter */}
          <select 
            value={selectedPriority}
            onChange={(e) => { setSelectedPriority(e.target.value); setPage(1); }}
            className="form-input"
            style={{ padding: '8px 12px', fontSize: '13px', minWidth: '110px' }}
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {/* Assignee filter */}
          <select 
            value={selectedAssignee}
            onChange={(e) => { setSelectedAssignee(e.target.value); setPage(1); }}
            className="form-input"
            style={{ padding: '8px 12px', fontSize: '13px', minWidth: '130px' }}
          >
            <option value="">All Assignees</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>{u.username}</option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle */}
        <div style={{
          display: 'flex',
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '4px',
          gap: '2px'
        }}>
          <button 
            onClick={() => { setViewMode('kanban'); setPage(1); }}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: '600',
              color: viewMode === 'kanban' ? '#fff' : 'var(--text-muted)',
              backgroundColor: viewMode === 'kanban' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              border: viewMode === 'kanban' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent'
            }}
          >
            <Kanban size={14} />
            <span>Kanban</span>
          </button>
          <button 
            onClick={() => { setViewMode('grid'); setPage(1); }}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: '600',
              color: viewMode === 'grid' ? '#fff' : 'var(--text-muted)',
              backgroundColor: viewMode === 'grid' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              border: viewMode === 'grid' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent'
            }}
          >
            <Grid size={14} />
            <span>Grid List</span>
          </button>
        </div>

      </div>

      {/* Main content view rendering */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
          <Loader2 size={36} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
        </div>
      ) : (
        viewMode === 'kanban' ? renderKanban() : renderGrid()
      )}

      {/* Reusable Inspect Issue Details Modal */}
      <Modal
        isOpen={selectedIssueId !== null}
        onClose={() => setSelectedIssueId(null)}
        title="Issue Inspector"
      >
        <IssueDetailModalContent 
          issueId={selectedIssueId} 
          onClose={() => setSelectedIssueId(null)}
          onRefresh={handleRefresh}
        />
      </Modal>

    </div>
  );
};

export default IssueList;
