import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import HistoryDrawer from '../components/HistoryDrawer';
import {
  Upload,
  Edit3,
  History,
  Trash2,
  FolderOpen,
  Search,
  UserCheck,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  BookOpen
} from 'lucide-react';

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [historyProject, setHistoryProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects/my-projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const confirmDelete = async () => {
    try {
      await API.delete(`/projects/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const total = projects.length;
    const approved = projects.filter((p) => p.status === 'Approved').length;
    const pending = projects.filter((p) => p.status === 'Pending').length;
    const needsImp = projects.filter((p) => p.status === 'Needs Improvement').length;
    return { total, approved, pending, needsImp };
  }, [projects]);

  const filteredProjects = projects.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(term) ||
      `v${p.currentVersion}`.toLowerCase().includes(term)
    );
  });

  return (
    <div className="student-dashboard-page">
      <div className="student-container">
        
        {/* ===== HERO WELCOME BANNER ===== */}
        <div className="student-hero fade-in-up">
          <div>
            <div className="student-hero-badge">
              <Sparkles size={14} /> Student Workspace
            </div>
            <h1 className="student-hero-title">Welcome back, {user?.name || 'Student'} 👋</h1>
            <p className="student-hero-subtitle">
              Organize, update, and track your academic project submissions and version history seamlessly.
            </p>
          </div>
          <button className="student-hero-upload-btn" onClick={() => navigate('/student/upload')}>
            <Upload size={18} /> Upload Project
          </button>
        </div>

        {/* ===== STATISTICS CARDS ===== */}
        <div className="student-stats-grid">
          <div className="student-stat-card">
            <div className="student-stat-info">
              <span className="student-stat-label">Total Projects</span>
              <span className="student-stat-value">{stats.total}</span>
            </div>
            <div className="student-stat-icon-wrapper repo-stat-icon-blue">
              <FileText size={24} />
            </div>
          </div>

          <div className="student-stat-card">
            <div className="student-stat-info">
              <span className="student-stat-label">Approved</span>
              <span className="student-stat-value">{stats.approved}</span>
            </div>
            <div className="student-stat-icon-wrapper teacher-stat-green">
              <CheckCircle2 size={24} />
            </div>
          </div>

          <div className="student-stat-card">
            <div className="student-stat-info">
              <span className="student-stat-label">Pending Review</span>
              <span className="student-stat-value">{stats.pending}</span>
            </div>
            <div className="student-stat-icon-wrapper teacher-stat-amber">
              <Clock size={24} />
            </div>
          </div>

          <div className="student-stat-card">
            <div className="student-stat-info">
              <span className="student-stat-label">Needs Improvement</span>
              <span className="student-stat-value">{stats.needsImp}</span>
            </div>
            <div className="student-stat-icon-wrapper teacher-stat-purple">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>

        {/* ===== SEARCH & ACTION BAR ===== */}
        <div className="student-search-row">
          <div className="student-search-group">
            <Search size={18} />
            <input
              className="student-search-input"
              placeholder="Search by project title or version (e.g. v1.0)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ===== CONTENT AREA ===== */}
        {loading ? (
          <div className="repo-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="repo-skeleton-card" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="repo-empty-state">
            <div className="repo-empty-icon">
              <FolderOpen size={30} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>
              No Projects Uploaded Yet
            </h3>
            <p style={{ color: '#64748B', maxWidth: 400, margin: '0 auto 20px', fontSize: '14px' }}>
              Upload your first college project to start managing versions and faculty reviews.
            </p>
            <button className="student-hero-upload-btn" onClick={() => navigate('/student/upload')} style={{ margin: '0 auto', background: '#2563EB', color: '#FFFFFF' }}>
              <Upload size={16} /> Upload Project
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="repo-empty-state" style={{ padding: '40px 20px' }}>
            <p style={{ color: '#64748B', margin: 0, fontSize: '14.5px' }}>No projects match your search query.</p>
          </div>
        ) : (
          <div className="project-grid">
            {filteredProjects.map((p) => (
              <div key={p._id} className="student-project-card">
                <div>
                  {/* Title & Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <h3 className="student-card-title">
                      <BookOpen size={18} style={{ display: 'inline', marginRight: 8, color: '#2563EB' }} />
                      {p.title}
                    </h3>
                    <StatusBadge status={p.status} />
                  </div>

                  {/* Metadata Box */}
                  <div className="student-card-meta-box">
                    <div className="student-meta-row">
                      <strong>🏷 Version:</strong>
                      <span>v{p.currentVersion}</span>
                    </div>
                    <div className="student-meta-row">
                      <strong>📅 Uploaded:</strong>
                      <span>{formatDate(p.createdAt)}</span>
                    </div>
                    <div className="student-meta-row">
                      <strong>📅 Submitted:</strong>
                      <span>{formatDate(p.createdAt)}</span>
                    </div>
                    <div className="student-meta-row">
                      <strong>🔄 Updated:</strong>
                      <span>{formatDate(p.updatedAt)}</span>
                    </div>
                    <div className="student-meta-row">
                      <strong>
                        <UserCheck size={14} style={{ display: 'inline', marginRight: 4, color: '#2563EB' }} /> Guide:
                      </strong>
                      <span>{p.guide || '—'}</span>
                    </div>
                  </div>
                </div>

                <hr style={{ margin: '18px 0 14px', borderColor: '#F1F5F9' }} />

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {(p.status === 'Pending' || p.status === 'Needs Improvement') && (
                    <button
                      className="student-action-btn-edit"
                      onClick={() => navigate(`/student/edit/${p._id}`)}
                    >
                      <Edit3 size={14} /> {p.status === 'Needs Improvement' ? 'Resubmit' : 'Edit'}
                    </button>
                  )}

                  <button
                    className="student-action-btn-history"
                    onClick={() => setHistoryProject(p)}
                  >
                    <History size={14} /> History
                  </button>

                  {p.status === 'Pending' && (
                    <button
                      className="student-action-btn-delete"
                      onClick={() => setDeleteTarget(p)}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* History Drawer Component */}
        <HistoryDrawer
          show={!!historyProject}
          onHide={() => setHistoryProject(null)}
          project={historyProject}
        />

        {/* Delete Confirmation Modal */}
        <Modal show={!!deleteTarget} onHide={() => setDeleteTarget(null)} centered>
          <Modal.Header closeButton style={{ borderBottom: '1px solid #E2E8F0', padding: '18px 24px' }}>
            <Modal.Title style={{ fontWeight: 800, fontSize: '18px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle color="#EF4444" size={20} /> Delete Project
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: '20px 24px' }}>
            <p style={{ marginBottom: 6, fontSize: '15px', color: '#1E293B' }}>
              Are you sure you want to delete <strong>{deleteTarget?.title}</strong>?
            </p>
            <p style={{ color: '#64748B', fontSize: '13.5px', margin: 0 }}>
              This action cannot be undone and will erase all version records.
            </p>
          </Modal.Body>
          <Modal.Footer style={{ borderTop: '1px solid #E2E8F0', padding: '16px 24px' }}>
            <Button variant="light" onClick={() => setDeleteTarget(null)} style={{ fontWeight: 600, borderRadius: 10 }}>
              Cancel
            </Button>
            <Button style={{ background: '#EF4444', border: 'none', fontWeight: 600, borderRadius: 10, padding: '8px 20px' }} onClick={confirmDelete}>
              Delete Project
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    </div>
  );
};

export default StudentDashboard;