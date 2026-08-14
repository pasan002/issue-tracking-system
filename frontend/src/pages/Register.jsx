import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Bug, UserPlus } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Developer');
  const { register, user, loading, error, setError } = useAuth();
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
    if (!username || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const success = await register(username, email, password, role);
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
        maxWidth: '440px',
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
          marginBottom: '28px'
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
            CREATE <span style={{ color: 'var(--color-primary)' }}>ACCOUNT</span>
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Join the software workspace to track team issues
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

        {/* Register Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="pasan_dev"
              className="form-input"
              required
            />
          </div>

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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-input"
              >
                <option value="Developer">Developer</option>
                <option value="Admin">Admin</option>
                <option value="Tester">Tester</option>
                <option value="User">User</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary" 
            style={{
              padding: '12px',
              fontSize: '14px',
              marginTop: '12px',
              marginBottom: '20px'
            }}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <UserPlus size={16} />
                <span>Register</span>
              </>
            )}
          </button>
        </form>

        {/* Login Redirect */}
        <div style={{
          textAlign: 'center',
          fontSize: '13px',
          color: 'var(--text-muted)'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{
            color: 'var(--color-primary)',
            fontWeight: '600',
            textDecoration: 'underline'
          }}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
