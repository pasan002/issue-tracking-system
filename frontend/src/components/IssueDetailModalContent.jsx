import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Loader2, 
  Trash2, 
  User, 
  Calendar, 
  Tag, 
  AlertTriangle, 
  Send,
  MessageSquare,
  History,
  ShieldAlert
} from 'lucide-react';

const IssueDetailModalContent = ({ issueId, onClose, onRefresh }) => {
  const { token, user } = useAuth();
  
  // Data State
  const [issue, setIssue] = useState(null);
  const [activities, setActivities] = useState([]);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);

  // UI State
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Fetch issue details & activities
  const fetchIssueDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/issues/${issueId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setIssue(data.issue);
        setActivities(data.activities);
      } else {
        setError('Failed to load issue details');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/comments/issue/${issueId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  // Fetch users for assignee selector
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

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchIssueDetails(), fetchComments(), fetchUsers()]);
      setLoading(false);
    };
    if (token && issueId) loadAll();
  }, [token, issueId]);

  // Update Status / Assignee
  const handleFieldChange = async (fieldName, value) => {
    if (!issue) return;
    try {
      setUpdating(true);
      const updatedFields = {
        title: issue.title,
        description: issue.description,
        type: issue.type,
        priority: issue.priority,
        status: issue.status,
        assignee: issue.assignee?._id || null,
        dueDate: issue.dueDate,
        [fieldName]: value === '' ? null : value
      };

      const res = await fetch(`http://localhost:5000/api/issues/${issueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });

      if (res.ok) {
        const updatedIssue = await res.json();
        setIssue(updatedIssue);
        // Refresh details to fetch new activities
        await fetchIssueDetails();
        onRefresh();
      } else {
        const data = await res.json();
        alert(data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  // Add Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setCommenting(true);
      const res = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          issueId,
          text: commentText.trim()
        }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments(prev => [...prev, newComment]);
        setCommentText('');
        // Refresh activities to show comment log
        await fetchIssueDetails();
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCommenting(false);
    }
  };

  // Delete Issue
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this issue? This cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/issues/${issueId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        onRefresh();
        onClose();
      } else {
        const data = await res.json();
        alert(data.message || 'Delete failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  if (error || !issue) {
    return <div style={{ color: 'var(--priority-high)', textAlign: 'center' }}>{error || 'Issue not found.'}</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Type & Header info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="badge" style={{
          backgroundColor: issue.type === 'Bug' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(99, 102, 241, 0.12)',
          color: issue.type === 'Bug' ? 'var(--priority-high)' : 'var(--color-primary)'
        }}>
          {issue.type === 'Bug' ? 'Bug 🐛' : 'Task ✅'}
        </span>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Created: {new Date(issue.createdAt).toLocaleDateString()} by <b>{issue.creator?.username}</b>
        </span>
      </div>

      {/* Description */}
      <div className="glass-card" style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
        <h4 className="form-label" style={{ marginBottom: '8px' }}>Description</h4>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
          {issue.description}
        </p>
      </div>

      {/* Settings Grid (Status, Assignee, Priority, Due Date) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        padding: '16px',
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)'
      }}>
        {/* Status */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Status</label>
          <select 
            value={issue.status} 
            onChange={(e) => handleFieldChange('status', e.target.value)}
            disabled={updating}
            className="form-input"
            style={{ padding: '8px 12px' }}
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Assignee */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Assignee</label>
          <select 
            value={issue.assignee?._id || ''} 
            onChange={(e) => handleFieldChange('assignee', e.target.value)}
            disabled={updating}
            className="form-input"
            style={{ padding: '8px 12px' }}
          >
            <option value="">Unassigned</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>{u.username}</option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Priority</label>
          <select 
            value={issue.priority} 
            onChange={(e) => handleFieldChange('priority', e.target.value)}
            disabled={updating}
            className="form-input"
            style={{ padding: '8px 12px' }}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Due Date */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Due Date</label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: issue.dueDate ? 'var(--text-main)' : 'var(--text-muted)',
            padding: '10px 12px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <Calendar size={14} />
            <span>{issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : 'No due date set'}</span>
          </div>
        </div>
      </div>

      {/* Tabs / Multi-section: Comments & Activities */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
        
        {/* Comments Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MessageSquare size={14} />
            COMMENTS ({comments.length})
          </h4>

          {/* Comment history list */}
          <div className="hide-scrollbar" style={{
            maxHeight: '200px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '4px',
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: 'var(--radius-sm)'
          }}>
            {comments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                No comments yet. Type below to add.
              </div>
            ) : (
              comments.map(c => (
                <div key={c._id} style={{
                  padding: '10px 12px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                    <span style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{c.user?.username}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-main)' }}>{c.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Comment input form */}
          <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              value={commentText} 
              onChange={(e) => setCommentText(e.target.value)} 
              placeholder="Add a comment..." 
              className="form-input"
              style={{ flex: 1, padding: '8px 12px', fontSize: '13px' }}
              disabled={commenting}
            />
            <button 
              type="submit" 
              disabled={commenting || !commentText.trim()} 
              className="btn btn-primary" 
              style={{ padding: '8px 12px' }}
            >
              {commenting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </form>
        </div>

        {/* History Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <History size={14} />
            ACTIVITY TIMELINE
          </h4>

          <div className="hide-scrollbar" style={{
            maxHeight: '250px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '8px',
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: 'var(--radius-sm)'
          }}>
            {activities.map((a, i) => (
              <div key={a._id} style={{
                display: 'flex',
                gap: '10px',
                position: 'relative'
              }}>
                {/* Timeline connector line */}
                {i < activities.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '7px',
                    bottom: '-16px',
                    width: '1px',
                    backgroundColor: 'rgba(255,255,255,0.06)'
                  }} />
                )}
                
                {/* Bullet dot */}
                <div style={{
                  width: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-popover)',
                  border: '2px solid var(--color-primary)',
                  flexShrink: 0,
                  zIndex: 2,
                  marginTop: '2px'
                }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-main)', lineHeight: '1.4' }}>
                    {a.action}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {new Date(a.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Dangerous Operations / Footer actions (Delete button) */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '12px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-color)'
      }}>
        {/* Only Admin or the Creator can delete issues */}
        {user?.role === 'Admin' || user?.username === issue.creator?.username ? (
          <button onClick={handleDelete} className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 12px' }}>
            <Trash2 size={14} />
            <span>Delete Issue</span>
          </button>
        ) : (
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldAlert size={12} /> Delete restricted to creator/admin
          </span>
        )}

        <button onClick={onClose} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
          Close Details
        </button>
      </div>

    </div>
  );
};

export default IssueDetailModalContent;
