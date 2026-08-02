import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { ShieldCheck, Mail, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await API.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed');
    }
  };

  return (
    <div className="auth-bg">
      <div
        className="auth-card auth-card-sm"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <ShieldCheck size={44} color="#2563EB" strokeWidth={1.5} style={{ marginBottom: 12 }} />
          <h2 className="auth-title">Reset Your Password</h2>
          <p className="auth-subtitle">
            Enter your registered email address and we'll send you a secure password reset link.
          </p>
        </div>

        {error && (
          <div className="auth-alert auth-alert-error">
            <XCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="auth-alert auth-alert-success">
            <CheckCircle2 size={18} />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 24 }}>
            <label className="form-label-custom" htmlFor="fp-email">Email Address</label>
            <div className="input-group auth-input-group auth-input-lg">
              <span className="input-group-text">
                <Mail size={18} color="#6B7280" />
              </span>
              <input
                id="fp-email"
                type="email"
                name="email"
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn">
            Send Reset Link
          </button>
        </form>

        <Link to="/login" className="auth-back-link">
          <ArrowLeft size={15} />
          <span>Back to Login</span>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
