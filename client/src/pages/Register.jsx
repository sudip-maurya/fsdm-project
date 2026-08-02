import { useCallback, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import GoogleSignIn from '../components/GoogleSignIn';
import {
  User,
  Hash,
  Mail,
  Lock,
  Building2,
  Eye,
  EyeOff,
  Info,
  CheckCircle2,
  XCircle,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  FolderGit2,
  Search,
  History,
  BookOpen,
} from 'lucide-react';
import './Register.premium.css';

const DEPARTMENTS = ['IT', 'CS', 'DS', 'BCA'];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    rollNo: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name') {
      // allow only letters and spaces
      if (/^[A-Za-z\s]*$/.test(value)) {
        setFormData({ ...formData, name: value });
      }
      return;
    }

    if (name === 'rollNo') {
      // allow only digits
      if (/^[0-9]*$/.test(value)) {
        setFormData({ ...formData, rollNo: value });
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/auth/register', formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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

  // Password strength meter calculation (frontend UI helper)
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '#e2e8f0' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: '#ef4444' };
    if (score === 2) return { score: 2, label: 'Fair', color: '#f59e0b' };
    if (score === 3) return { score: 3, label: 'Good', color: '#3b82f6' };
    return { score: 4, label: 'Strong', color: '#10b981' };
  };

  const pwdStrength = getPasswordStrength(formData.password);

  return (
    <div className="reg-auth-page">
      {/* Background Floating Blurred Circles */}
      <div className="reg-bg-shape reg-bg-shape-one" aria-hidden="true" />
      <div className="reg-bg-shape reg-bg-shape-two" aria-hidden="true" />

      {/* Left/Showcase Panel */}
      <div className="reg-showcase">
        <Link to="/" className="reg-brand" aria-label="Open Repository Home">
          <span className="reg-brand-mark">
            <BookOpen size={20} />
          </span>
          <span>Open Repository</span>
        </Link>

        <div className="reg-showcase-content">
          <span className="reg-eyebrow">
            <GraduationCap size={14} /> ACADEMIC ECOSYSTEM
          </span>
          <h1>Manage Your Academic Projects in One Centralized Place</h1>
          <p className="reg-showcase-copy">
            Create your student account to securely submit capstone projects, collaborate with faculty supervisors, and access thousands of verified academic resources.
          </p>

          <div className="reg-benefits-list">
            <div className="reg-benefit-item">
              <div className="reg-benefit-icon">
                <ShieldCheck size={18} />
              </div>
              <span className="reg-benefit-text">Secure Academic Authentication</span>
            </div>

            <div className="reg-benefit-item">
              <div className="reg-benefit-icon">
                <FolderGit2 size={18} />
              </div>
              <span className="reg-benefit-text">Faculty-Approved Project Submissions</span>
            </div>

            <div className="reg-benefit-item">
              <div className="reg-benefit-icon">
                <BookOpen size={18} />
              </div>
              <span className="reg-benefit-text">Unlimited Repository Access</span>
            </div>

            <div className="reg-benefit-item">
              <div className="reg-benefit-icon">
                <Search size={18} />
              </div>
              <span className="reg-benefit-text">Fast Multi-Filter Project Discovery</span>
            </div>

            <div className="reg-benefit-item">
              <div className="reg-benefit-icon">
                <History size={18} />
              </div>
              <span className="reg-benefit-text">Version Control & History Tracking</span>
            </div>
          </div>
        </div>

        <div className="reg-showcase-footer">
          <span>© 2026 Open Repository</span>
          <a href="/#about">Privacy Policy</a>
          <a href="/#about">Terms of Service</a>
        </div>
      </div>

      {/* Right/Registration Form Panel */}
      <div className="reg-panel">
        <div className="reg-card">
          <div className="reg-card-header">
            <div className="reg-card-badge-icon">
              <GraduationCap size={24} />
            </div>
            <h2>Welcome to Open Repository</h2>
            <p>
              Create your student account and securely manage academic projects, reports and documentation.
            </p>
          </div>

          {error && (
            <div className="reg-alert reg-alert-error">
              <XCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="reg-alert reg-alert-success">
              <CheckCircle2 size={18} />
              <span>Registration successful. Redirecting to login...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="reg-form">
            {/* Full Name */}
            <div className="reg-field">
              <label className="reg-field-label" htmlFor="name">Full Name</label>
              <div className="reg-input-group">
                <span className="reg-input-icon">
                  <User size={18} />
                </span>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="reg-input-control"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Roll Number */}
            <div className="reg-field">
              <label className="reg-field-label" htmlFor="rollNo">Roll Number</label>
              <div className="reg-input-group">
                <span className="reg-input-icon">
                  <Hash size={18} />
                </span>
                <input
                  id="rollNo"
                  type="text"
                  name="rollNo"
                  className="reg-input-control"
                  placeholder="Enter your roll number"
                  value={formData.rollNo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="reg-field">
              <label className="reg-field-label" htmlFor="email">Email Address</label>
              <div className="reg-input-group">
                <span className="reg-input-icon">
                  <Mail size={18} />
                </span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="reg-input-control"
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="reg-field">
              <label className="reg-field-label" htmlFor="password">Password</label>
              <div className="reg-input-group">
                <span className="reg-input-icon">
                  <Lock size={18} />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="reg-input-control"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="reg-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  role="button"
                  tabIndex={0}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>

              {/* Password Strength Meter */}
              {formData.password && (
                <div className="reg-strength-meter">
                  <div className="reg-strength-bars">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className="reg-strength-bar"
                        style={{
                          background: step <= pwdStrength.score ? pwdStrength.color : '#e2e8f0',
                        }}
                      />
                    ))}
                  </div>
                  <div className="reg-strength-text">
                    <span>Password strength</span>
                    <span style={{ color: pwdStrength.color, fontWeight: 700 }}>{pwdStrength.label}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Department */}
            <div className="reg-field">
              <label className="reg-field-label" htmlFor="department">Department</label>
              <div className="reg-input-group">
                <span className="reg-input-icon">
                  <Building2 size={18} />
                </span>
                <select
                  id="department"
                  name="department"
                  className="reg-input-control reg-select-control"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select Department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="reg-submit-btn">
              <span>Create Account</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Divider */}
          <div className="reg-divider">
            <span>OR</span>
          </div>

          <GoogleSignIn onCredential={handleGoogleCredential} onError={setError} />

          {/* Login Link */}
          <div className="reg-footer-link">
            Already have an account?{' '}
            <Link to="/login">
              Sign In →
            </Link>
          </div>

          {/* Teacher Account Info Box */}
          <div className="reg-teacher-notice">
            <Info size={18} className="reg-teacher-notice-icon" />
            <div>
              <strong>Teacher & Faculty Accounts</strong>
              <span>
                Teacher registrations are managed by department administrators. Please contact your department head for access credentials.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;