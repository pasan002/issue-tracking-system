import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const CreateIssueForm = ({ onCancel, onSuccess }) => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Bug');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Open');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Fetch users for assignee list
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Title and Description are required.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch('http://localhost:5000/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          type,
          priority,
          status,
          assignee: assignee || null,
          dueDate: dueDate || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create issue');
      }

      // Success
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {error && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: 'var(--priority-high)',
          borderRadius: 'var(--radius-md)',
          fontSize: '13px'
        }}>
          {error}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Issue Title *</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Summarize the bug or task..." 
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Description *</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Describe the steps to reproduce or implementation details..." 
          className="form-input"
          style={{ minHeight: '120px', resize: 'vertical' }}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="form-group">
          <label className="form-label">Issue Type</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)} 
            className="form-input"
            style={{ appearance: 'none', backgroundPosition: 'right 16px center' }}
          >
            <option value="Bug">Bug 🐛</option>
            <option value="Task">Task ✅</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Priority</label>
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)} 
            className="form-input"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)} 
            className="form-input"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Assignee</label>
          <select 
            value={assignee} 
            onChange={(e) => setAssignee(e.target.value)} 
            className="form-input"
          >
            <option value="">Unassigned</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>{u.username} ({u.role})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Due Date</label>
        <input 
          type="date" 
          value={dueDate} 
          onChange={(e) => setDueDate(e.target.value)} 
          className="form-input"
        />
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ minWidth: '120px' }}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : 'Create Issue'}
        </button>
      </div>
    </form>
  );
};

export default CreateIssueForm;
