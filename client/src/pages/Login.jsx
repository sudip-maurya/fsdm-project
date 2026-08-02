import { useCallback, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { InputGroup, Form } from 'react-bootstrap';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import GoogleSignIn from '../components/GoogleSignIn';
import {
  BookOpen,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  FolderKanban,
  FileCheck2,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/login', formData);
      login(res.data.user, res.data.token);

      if (res.data.user.role === 'student') navigate('/student/dashboard');
      else if (res.data.user.role === 'teacher') navigate('/teacher/dashboard');
      else if (res.data.user.role === 'admin') navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleCredential = useCallback(async (credential) => {
    setError('');
    const res = await API.post('/auth/google', { credential });
    login(res.data.user, res.data.token);

    if (res.data.user.role === 'student') navigate('/student/dashboard');
    else if (res.data.user.role === 'teacher') navigate('/teacher/dashboard');
    else if (res.data.user.role === 'admin') navigate('/admin/dashboard');
  }, [login, navigate]);

  return (
    <div className="split-auth-container">
      {/* ===== LEFT SIDE: SPLIT HERO & FEATURE CARDS ===== */}
      <div className="split-auth-left">
        <div>
          <Link to="/" className="split-auth-brand">
            <BookOpen size={28} /> FSDM Repository
          </Link>

          <div style={{ marginTop: 48, maxWidth: 520 }}>
            <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 12 }}>
              Academic Project & Capstone Workspace
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.88)', lineHeight: 1.6, margin: 0 }}>
              Streamline your project submissions, faculty reviews, version tracking, and academic repository access.
            </p>
          </div>

          <div className="split-auth-features">
            {/* Feature 1 */}
            <div className="split-feature-card">
              <div className="split-feature-icon">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 2px', fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>
                  Secure Login
                </h4>
                <p style={{ margin: 0, fontSize: 13, color: 'rgba(255, 255, 255, 0.8)' }}>
                  Role-based authentication tailored for Students, Faculty, and Administrators.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="split-feature-card">
              <div className="split-feature-icon">
                <FolderKanban size={20} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 2px', fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>
                  Project Repository
                </h4>
                <p style={{ margin: 0, fontSize: 13, color: 'rgba(255, 255, 255, 0.8)' }}>
                  Searchable archive of capstone projects, research documentations, and source code.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="split-feature-card">
              <div className="split-feature-icon">
                <FileCheck2 size={20} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 2px', fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>
                  Easy Project Management
                </h4>
                <p style={{ margin: 0, fontSize: 13, color: 'rgba(255, 255, 255, 0.8)' }}>
                  Automated versioning, file report submissions, and real-time evaluation feedback.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.7)' }}>
          © 2026 FSDM Repository · Enterprise Academic Platform
        </div>
      </div>

      {/* ===== RIGHT SIDE: GLASSMORPHISM LOGIN CARD ===== */}
      <div className="split-auth-right">
        <div className="auth-glass-card fade-in-up">
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
              }}
            >
              <BookOpen size={26} />
            </div>
            <h2 style={{ fontWeight: 800, margin: 0, fontSize: 24, color: '#0F172A' }}>
              Welcome Back
            </h2>
            <p style={{ color: '#64748B', marginTop: 4, marginBottom: 0, fontSize: 14 }}>
              Sign in to access your FSDM workspace.
            </p>
          </div>

          {error && (
            <div className="auth-alert auth-alert-error">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label className="form-label-custom">Email Address</label>
              <InputGroup className="auth-input-group auth-input-lg">
                <InputGroup.Text className="input-group-text">
                  <Mail color="#94A3B8" size={18} />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="form-label-custom" style={{ margin: 0 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: 13, fontWeight: 600, color: '#2563EB', textDecoration: 'none' }}>
                  Forgot Password?
                </Link>
              </div>
              <InputGroup className="auth-input-group auth-input-lg">
                <InputGroup.Text className="input-group-text">
                  <Lock color="#94A3B8" size={18} />
                </InputGroup.Text>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </InputGroup>
            </div>

            <button type="submit" className="auth-submit-btn">
              Sign In <ArrowRight size={18} style={{ display: 'inline', marginLeft: 6 }} />
            </button>
          </Form>

          <div className="auth-divider"><span>OR</span></div>
          <GoogleSignIn onCredential={handleGoogleCredential} onError={setError} />

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#64748B' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: 700, color: '#2563EB' }}>
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
