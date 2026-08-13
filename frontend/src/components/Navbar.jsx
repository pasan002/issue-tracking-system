import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Shield, Bug } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="glass-card" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 24px',
      borderRadius: '0 0 var(--radius-md) var(--radius-md)',
      borderTop: 'none',
      marginBottom: '24px',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
          padding: '8px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 4px 12px var(--color-primary-glow)'
        }}>
          <Bug size={20} />
        </div>
        <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '0.5px' }}>
          APEX<span style={{ color: 'var(--color-primary)' }}>TRACK</span>
        </span>
      </div>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)'
            }}>
              <User size={16} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>{user.username}</span>
              <span style={{ 
                fontSize: '11px', 
                color: 'var(--text-muted)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px' 
              }}>
                <Shield size={10} /> {user.role}
              </span>
            </div>
          </div>

          <button 
            onClick={logout} 
            className="btn btn-secondary" 
            style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
