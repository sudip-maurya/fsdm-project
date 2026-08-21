import { useEffect, useState, useMemo } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import VersionHistory from '../components/VersionHistory';
import StatusBadge from '../components/StatusBadge';
import {
  GraduationCap,
  FolderCheck,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  Search,
  RotateCcw,
  FileText,
  Code,
  CheckSquare,
  Sparkles,
  User,
  Building2,
  Tag,
  X,
  Send,
  BookOpen
} from 'lucide-react';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('Pending');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects/all');
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

  const openReview = (project) => {
    setSelectedProject(project);
    setStatus(project.status || 'Pending');
    setComment('');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/projects/${selectedProject._id}/review`, { status, comment });
      setSelectedProject(null);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Review failed');
    }
  };

  // Compute Statistics
  const stats = useMemo(() => {
    const total = projects.length;
    const approved = projects.filter((p) => p.status === 'Approved').length;
    const pending = projects.filter((p) => p.status === 'Pending').length;
    const needsImp = projects.filter((p) => p.status === 'Needs Improvement').length;
    return { total, approved, pending, needsImp };
  }, [projects]);

  // Unique Departments List
  const departments = useMemo(() => {
    const depts = new Set();
    projects.forEach((p) => {
      if (p.department?.name) depts.add(p.department.name);
    });
    return Array.from(depts);
  }, [projects]);

  // Filtered and Sorted Projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchesSearch =
          p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.submittedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.department?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = selectedDept === 'All' || p.department?.name === selectedDept;
        const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
        return matchesSearch && matchesDept && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [projects, searchTerm, selectedDept, selectedStatus, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDept('All');
    setSelectedStatus('All');
    setSortBy('newest');
  };

  return (
    <div className="teacher-dashboard-page">
      <div className="teacher-container">
        
        {/* ===== HERO WELCOME SECTION ===== */}
        <div className="teacher-hero">
          <div className="teacher-hero-badge">
            <GraduationCap size={16} /> Faculty Review Portal
          </div>
          <h1 className="teacher-hero-title">Welcome back, {user?.name || 'Teacher'} 👋</h1>
          <p className="teacher-hero-subtitle">
            Manage, evaluate, and track student project submissions seamlessly with automated version history and status workflows.
          </p>
        </div>

        {/* ===== STATISTICS CARDS ===== */}
        <div className="teacher-stats-grid">
          <div className="teacher-stat-card">
            <div className="teacher-stat-info">
              <span className="teacher-stat-label">Total Submissions</span>
              <span className="teacher-stat-value">{stats.total}</span>
            </div>
            <div className="teacher-stat-icon-wrapper teacher-stat-blue">
              <FileSpreadsheet size={24} />
            </div>
          </div>

          <div className="teacher-stat-card">
            <div className="teacher-stat-info">
              <span className="teacher-stat-label">Approved</span>
              <span className="teacher-stat-value">{stats.approved}</span>
            </div>
            <div className="teacher-stat-icon-wrapper teacher-stat-green">
              <FolderCheck size={24} />
            </div>
          </div>

          <div className="teacher-stat-card">
            <div className="teacher-stat-info">
              <span className="teacher-stat-label">Pending Review</span>
              <span className="teacher-stat-value">{stats.pending}</span>
            </div>
            <div className="teacher-stat-icon-wrapper teacher-stat-amber">
              <Clock size={24} />
            </div>
          </div>

          <div className="teacher-stat-card">
            <div className="teacher-stat-info">
              <span className="teacher-stat-label">Needs Improvement</span>
              <span className="teacher-stat-value">{stats.needsImp}</span>
            </div>
            <div className="teacher-stat-icon-wrapper teacher-stat-purple">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>

        {/* ===== SEARCH BAR & FILTER SECTION ===== */}
        <div className="teacher-filter-bar">
          <div className="teacher-search-box">
            <Search size={18} />
            <input
              type="text"
              className="teacher-search-input"
              placeholder="Search by project title, student, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="teacher-filters-group">
            {/* Department Filter */}
            <select
              className="teacher-select-filter"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="All">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="teacher-select-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Needs Improvement">Needs Improvement</option>
              <option value="Rejected">Rejected</option>
            </select>

            {/* Sort Dropdown */}
            <select
              className="teacher-select-filter"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="title">Sort: Title (A-Z)</option>
            </select>

            {/* Reset Button */}
            {(searchTerm || selectedDept !== 'All' || selectedStatus !== 'All' || sortBy !== 'newest') && (
              <button className="teacher-reset-btn" onClick={resetFilters} title="Reset all filters">
                <RotateCcw size={14} /> Reset
              </button>
            )}
          </div>
        </div>

        {/* ===== PROJECTS TABLE ===== */}
        <div className="teacher-table-wrapper">
          {loading ? (
            <div className="teacher-skeleton-table">
              <div className="teacher-skeleton-row" />
              <div className="teacher-skeleton-row" />
              <div className="teacher-skeleton-row" />
              <div className="teacher-skeleton-row" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="teacher-empty-box">
              <div className="teacher-empty-icon">
                <FileSpreadsheet size={28} />
              </div>
              <h3 className="teacher-empty-title">No projects found</h3>
              <p style={{ margin: 0, fontSize: '13.5px' }}>
                {projects.length === 0
                  ? 'No projects have been submitted by students yet.'
                  : 'Try adjusting your search query or clear existing filters.'}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="teacher-table">
                <thead>
                  <tr>
                    <th>Project Title</th>
                    <th>Student Name</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((p) => (
                    <tr key={p._id}>
                      {/* Title */}
                      <td>
                        <div className="teacher-project-title">{p.title}</div>
                        {p.currentVersion && (
                          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                            v{p.currentVersion}
                          </span>
                        )}
                      </td>

                      {/* Student */}
                      <td>
                        <div className="teacher-student-cell">
                          <div className="teacher-avatar-circle">
                            {(p.submittedBy?.name || 'S').charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600, color: '#1E293B' }}>
                            {p.submittedBy?.name || 'Unknown Student'}
                          </span>
                        </div>
                      </td>

                      {/* Department */}
                      <td>
                        <span style={{ color: '#475569', fontWeight: 500 }}>
                          {p.department?.name || 'N/A'}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td>
                        <StatusBadge status={p.status} />
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="teacher-actions-cell">
                          <button
                            className="teacher-btn-review"
                            onClick={() => openReview(p)}
                            title="Evaluate and Review Project"
                          >
                            <CheckSquare size={15} /> Review
                          </button>
                          
                          {p.reportFile && (
                            <a
                              href={p.reportFile.startsWith('http') ? p.reportFile : `https://open-repository-backend.onrender.com/${p.reportFile.replace(/\\/g, '/')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="teacher-btn-link"
                              title="View Submitted Report PDF"
                            >
                              <FileText size={14} /> Report
                            </a>
                          )}
                          
                          {p.sourceCodeFile && (
                            <a
                              href={p.sourceCodeFile.startsWith('http') ? p.sourceCodeFile : `https://open-repository-backend.onrender.com/${p.sourceCodeFile.replace(/\\/g, '/')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="teacher-btn-link"
                              title="Download Source Code Archive"
                            >
                              <Code size={14} /> Code
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ===== REDESIGNED REVIEW PAGE / MODAL SECTION ===== */}
        {selectedProject && (
          <div className="teacher-review-section">
            <div className="teacher-review-header">
              <h2 className="teacher-review-title">
                Evaluating Submission
              </h2>
              <button
                className="teacher-btn-cancel"
                onClick={() => setSelectedProject(null)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <X size={16} /> Close Review
              </button>
            </div>

            <div className="teacher-review-grid">
              {/* Left Column: Project Details & Version History Card */}
              <div className="teacher-review-card">
                <div className="teacher-review-card-title">
                  <BookOpen size={18} style={{ color: '#2563EB' }} />
                  Project Overview & File Attachments
                </div>

                <div className="teacher-meta-item">
                  <div className="teacher-meta-label">Title</div>
                  <div className="teacher-meta-value" style={{ fontWeight: 700, fontSize: '16px' }}>
                    {selectedProject.title}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div className="teacher-meta-item" style={{ margin: 0 }}>
                    <div className="teacher-meta-label">Submitted By</div>
                    <div className="teacher-meta-value">
                      <User size={13} style={{ display: 'inline', marginRight: 4, color: '#64748B' }} />
                      {selectedProject.submittedBy?.name || 'N/A'}
                    </div>
                  </div>
                  <div className="teacher-meta-item" style={{ margin: 0 }}>
                    <div className="teacher-meta-label">Department</div>
                    <div className="teacher-meta-value">
                      <Building2 size={13} style={{ display: 'inline', marginRight: 4, color: '#64748B' }} />
                      {selectedProject.department?.name || 'N/A'}
                    </div>
                  </div>
                  <div className="teacher-meta-item" style={{ margin: 0, gridColumn: '1 / -1' }}>
                    <div className="teacher-meta-label">Subject*</div>
                    <div className="teacher-meta-value">
                      <BookOpen size={13} style={{ display: 'inline', marginRight: 4, color: '#64748B' }} />
                      {selectedProject.subject?.name || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="teacher-meta-item">
                  <div className="teacher-meta-label">Current Version</div>
                  <div className="teacher-meta-value">
                    <span className="repo-tech-pill">v{selectedProject.currentVersion || '1.0'}</span>
                  </div>
                </div>

                <div className="teacher-meta-item">
                  <div className="teacher-meta-label" style={{ fontSize: '14px', color: '#1E293B', marginBottom: 12, borderBottom: '1px solid #E2E8F0', paddingBottom: 6 }}>
                    <GraduationCap size={16} style={{ display: 'inline', marginRight: 6, color: '#2563EB', verticalAlign: 'middle' }} />
                    Academic Information
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                    <div className="teacher-meta-item" style={{ margin: 0 }}>
                      <div className="teacher-meta-label">Academic Year</div>
                      <div className="teacher-meta-value">{selectedProject.academicYear || 'N/A'}</div>
                    </div>
                    <div className="teacher-meta-item" style={{ margin: 0 }}>
                      <div className="teacher-meta-label">Guide Name</div>
                      <div className="teacher-meta-value">{selectedProject.guide || 'N/A'}</div>
                    </div>
                    {selectedProject.teamMembers && selectedProject.teamMembers.length > 0 && (
                      <div className="teacher-meta-item" style={{ margin: 0, gridColumn: '1 / -1' }}>
                        <div className="teacher-meta-label">Team Members</div>
                        <div className="teacher-meta-value">
                          {selectedProject.teamMembers.join(', ')}
                        </div>
                      </div>
                    )}
                    {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                      <div className="teacher-meta-item" style={{ margin: 0, gridColumn: '1 / -1' }}>
                        <div className="teacher-meta-label">Technologies</div>
                        <div className="teacher-meta-value">
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                            {selectedProject.technologies.map((tech, idx) => (
                              <span key={idx} className="repo-tech-pill" style={{ background: '#EFF6FF', color: '#2563EB', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedProject.keywords && selectedProject.keywords.length > 0 && (
                      <div className="teacher-meta-item" style={{ margin: 0, gridColumn: '1 / -1' }}>
                        <div className="teacher-meta-label">Keywords</div>
                        <div className="teacher-meta-value">
                          {selectedProject.keywords.join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="teacher-meta-item">
                  <div className="teacher-meta-label">Abstract</div>
                  <div className="teacher-meta-value" style={{ background: '#F8FAFC', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0', fontSize: '13.5px' }}>
                    {selectedProject.abstract || 'No abstract provided.'}
                  </div>
                </div>

                {/* Live Project / Demo Video Link */}
                {selectedProject.demoVideoLink && (
                  <div className="teacher-meta-item" style={{ marginTop: 16 }}>
                    <div className="teacher-meta-label">
                      {selectedProject.projectLinkType === 'Live Project Link' ? 'LIVE PROJECT' : 'DEMO VIDEO'}
                    </div>
                    <a
                      href={selectedProject.demoVideoLink.startsWith('http') ? selectedProject.demoVideoLink : `https://${selectedProject.demoVideoLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="teacher-btn-review"
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        textDecoration: 'none', 
                        marginTop: 8, 
                        padding: '10px 16px',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                        {selectedProject.projectLinkType === 'Live Project Link' ? '🌐 Open Live Project' : '▶ Open Demo Video'}
                      </span>
                      {selectedProject.projectLinkType === 'Live Project Link' && <span>↗</span>}
                    </a>
                  </div>
                )}

                {/* Quick File Downloads */}
                <div style={{ display: 'flex', gap: 10, marginTop: 16, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
                  {selectedProject.reportFile && (
                    <a
                      href={selectedProject.reportFile.startsWith('http') ? selectedProject.reportFile : `https://open-repository-backend.onrender.com/${selectedProject.reportFile.replace(/\\/g, '/')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="teacher-btn-review"
                      style={{ textDecoration: 'none' }}
                    >
                      <FileText size={15} /> Open Full Report PDF
                    </a>
                  )}
                  {selectedProject.sourceCodeFile && (
                    <a
                      href={selectedProject.sourceCodeFile.startsWith('http') ? selectedProject.sourceCodeFile : `https://open-repository-backend.onrender.com/${selectedProject.sourceCodeFile.replace(/\\/g, '/')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="teacher-btn-link"
                      style={{ padding: '8px 14px' }}
                    >
                      <Code size={15} /> Source Code
                    </a>
                  )}
                </div>

                {/* Version History component */}
                <VersionHistory project={selectedProject} />
              </div>

              {/* Right Column: Review Form Card */}
              <div className="teacher-review-card">
                <div className="teacher-review-card-title">
                  <Sparkles size={18} style={{ color: '#2563EB' }} />
                  Submit Evaluation & Feedback
                </div>

                <form onSubmit={submitReview}>
                  {/* Status Selection */}
                  <div className="teacher-meta-item">
                    <label className="form-label-custom" style={{ fontSize: '13.5px' }}>
                      <Tag size={14} style={{ display: 'inline', marginRight: 6 }} />
                      Evaluation Decision Status:
                    </label>
                    <select
                      className="teacher-select-filter"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      style={{ width: '100%', height: 48, background: '#FFFFFF' }}
                    >
                      <option value="Pending">🟡 Pending (Under Review)</option>
                      <option value="Approved">🟢 Approved (Accepted)</option>
                      <option value="Needs Improvement">🔵 Needs Improvement (Revision Required)</option>
                      <option value="Rejected">🔴 Rejected (Unsatisfactory)</option>
                    </select>
                  </div>

                  {/* Comment Textarea */}
                  <div className="teacher-meta-item" style={{ marginTop: 18 }}>
                    <label className="form-label-custom" style={{ fontSize: '13.5px' }}>
                      Feedback & Review Remarks:
                    </label>
                    <textarea
                      className="teacher-textarea"
                      placeholder="Write detailed recommendations, correction instructions, or feedback for the student..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={6}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                    <button
                      type="submit"
                      className="teacher-btn-review"
                      style={{ flex: 1, height: 46, justifyContent: 'center', fontSize: '14px' }}
                    >
                      <Send size={16} /> Submit Evaluation
                    </button>
                    <button
                      type="button"
                      className="teacher-btn-cancel"
                      onClick={() => setSelectedProject(null)}
                      style={{ height: 46 }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TeacherDashboard;