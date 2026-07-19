import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { ROLE_LABELS, ROLES } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';
import Spinner from '../../components/common/Spinner';
import '../../styles/LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const [selectedRole, setSelectedRole] = useState(null);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Default credentials mapping for user convenience
  const defaultCredentials = {
    [ROLES.POLICE]: 'police01',
    [ROLES.INSURANCE]: 'insurance01',
    [ROLES.VICTIM]: 'victim01'
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setUserId(defaultCredentials[role] || '');
    setPassword('');
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!userId.trim()) {
      setFormError('User ID or Badge number is required.');
      return;
    }
    if (!password) {
      setFormError('Password is required.');
      return;
    }

    setSubmitting(true);
    try {
      const loggedUser = await login(userId.trim(), password);
      toast(`Successfully logged in as ${loggedUser.name}`, 'success');
      navigate(ROUTES[loggedUser.role].DASHBOARD);
    } catch (err) {
      setFormError(err.message || 'Authentication failed. Please try again.');
      toast('Login failed. Please check credentials.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo" aria-hidden="true">⬡</div>
          <h1 className="login-title">Sentry</h1>
          <p className="login-subtitle">Accident Detection &amp; Alert System</p>
          <p className="login-desc">
            Automated incident detection, severity classification, and emergency response coordination.
          </p>
        </div>

        {!selectedRole ? (
          <div className="role-selector-section">
            <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-4)', textAlign: 'center' }}>
              Select Secure Portal
            </h2>
            <div className="role-card-grid">
              <button 
                className="role-card" 
                onClick={() => handleRoleSelect(ROLES.POLICE)}
                aria-label="Access Law Enforcement Portal"
              >
                <div className="role-icon police">🚓</div>
                <div>
                  <div className="role-title">{ROLE_LABELS[ROLES.POLICE]}</div>
                  <div className="role-desc">Incident control, emergency response, and FIR database.</div>
                </div>
              </button>

              <button 
                className="role-card" 
                onClick={() => handleRoleSelect(ROLES.INSURANCE)}
                aria-label="Access Insurance Claims Portal"
              >
                <div className="role-icon insurance">🏢</div>
                <div>
                  <div className="role-title">{ROLE_LABELS[ROLES.INSURANCE]}</div>
                  <div className="role-desc">Claims assessment, telemetry verification, and compensation.</div>
                </div>
              </button>

              <button 
                className="role-card" 
                onClick={() => handleRoleSelect(ROLES.VICTIM)}
                aria-label="Access Citizen Portal"
              >
                <div className="role-icon victim">👤</div>
                <div>
                  <div className="role-title">{ROLE_LABELS[ROLES.VICTIM]}</div>
                  <div className="role-desc">Case timelines, camera footage playback, and appeals.</div>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setSelectedRole(null)}
                style={{ padding: '4px 8px' }}
                aria-label="Back to role selection"
              >
                ← Back
              </button>
              <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-heading)' }}>
                {ROLE_LABELS[selectedRole]} Sign In
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {formError && (
                <div 
                  style={{ 
                    padding: 'var(--space-3) var(--space-4)', 
                    background: 'var(--color-accent-red-muted)', 
                    border: '1px solid var(--color-accent-red)', 
                    color: 'var(--color-accent-red)', 
                    borderRadius: 'var(--radius-md)', 
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--weight-medium)'
                  }}
                  role="alert"
                >
                  {formError}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="userId">
                  {selectedRole === ROLES.POLICE ? 'Badge Number / ID' : selectedRole === ROLES.INSURANCE ? 'Employee ID' : 'User ID / Phone'}
                </label>
                <input 
                  type="text" 
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder={selectedRole === ROLES.POLICE ? 'e.g. police01' : 'Enter User ID'}
                  autoFocus
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Security Password</label>
                <input 
                  type="password" 
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={submitting}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-lg" 
                disabled={submitting}
                style={{ width: '100%', marginTop: 'var(--space-2)' }}
              >
                {submitting ? (
                  <>
                    <Spinner size="sm" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            <div className="demo-credentials">
              <strong>Demo Credentials:</strong>
              <div style={{ marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span>ID: <code style={{ color: 'var(--color-accent-amber)' }}>{defaultCredentials[selectedRole]}</code></span>
                <span>Password: <code style={{ color: 'var(--color-accent-amber)' }}>demo</code></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
