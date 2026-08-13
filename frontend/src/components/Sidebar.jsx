import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, KanbanSquare, Plus } from 'lucide-react';

const Sidebar = ({ onCreateIssueClick }) => {
  return (
    <aside style={{
      width: '240px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      flexShrink: 0
    }}>
      {/* Create Issue Action */}
      <button 
        onClick={onCreateIssueClick} 
        className="btn btn-primary" 
        style={{
          width: '100%',
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          borderRadius: 'var(--radius-md)',
          fontSize: '14px'
        }}
      >
        <Plus size={18} />
        <span>Create Issue</span>
      </button>

      {/* Navigation */}
      <div className="glass-card" style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '12px',
        gap: '4px'
      }}>
        <NavLink 
          to="/" 
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            backgroundColor: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
            color: isActive ? 'var(--color-primary)' : 'var(--text-muted)',
            transition: 'all var(--transition-fast)'
          })}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/issues" 
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            backgroundColor: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
            color: isActive ? 'var(--color-primary)' : 'var(--text-muted)',
            transition: 'all var(--transition-fast)'
          })}
        >
          <KanbanSquare size={18} />
          <span>Issues Board</span>
        </NavLink>
      </div>

      {/* Workspace Footer Info */}
      <div className="glass-card" style={{
        padding: '16px',
        fontSize: '12px',
        color: 'var(--text-muted)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>MERN assignment</div>
        <div>Software Engineering Team</div>
        <div>v1.0.0</div>
      </div>
    </aside>
  );
};

export default Sidebar;
