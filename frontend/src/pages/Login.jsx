import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Bug, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  // Clear errors when entering page
  useEffect(() => {
    setError(null);
  }, []);

  // Redirect if logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    const success = await login(email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent), radial-gradient(circle at bottom left, rgba(168, 85, 247, 0.05), transparent), var(--bg-app)',
      padding: '24px'
    }}>
      <div className="glass-card scale-in" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '40px 32px',
        backgroundColor: '#0f111a',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Brand Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            padding: '12px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 8px 24px var(--color-primary-glow)'
          }}>
            <Bug size={28} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            APEX<span style={{ color: 'var(--color-primary)' }}>TRACK</span>
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Sign in to access your issues dashboard
          </p>
        </div>

        {/* Error Callout */}
        {error && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'var(--priority-high)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            fontSize: '13px'
          }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="form-input"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary" 
            style={{
              padding: '12px',
              fontSize: '14px',
              marginBottom: '20px'
            }}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <LogIn size={16} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Register Redirect */}
        <div style={{
          textAlign: 'center',
          fontSize: '13px',
          color: 'var(--text-muted)'
        }}>
          Don't have an account?{' '}
          <Link to="/register" style={{
            color: 'var(--color-primary)',
            fontWeight: '600',
            textDecoration: 'underline'
          }}>
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
