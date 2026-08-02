import { useEffect, useState } from 'react';
import axios from 'axios';
import StatusBadge from '../components/StatusBadge';
import {
  Search,
  SlidersHorizontal,
  FolderKanban,
  Building2,
  CalendarRange,
  User,
  BookOpen,
  Code2,
  Video,
  FileDown,
  FolderSearch,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

const Repository = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const res = await axios.get(
          'https://open-repository-backend.onrender.com//api/projects/approved'
        );
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApproved();
  }, []);

  const departments = [
    ...new Set(projects.map((p) => p.department?.name).filter(Boolean)),
  ];

  const years = [
    ...new Set(projects.map((p) => p.academicYear).filter(Boolean)),
  ];

  const filteredProjects = projects.filter((p) => {
    const term = search.toLowerCase();

    const matchesSearch =
      !term ||
      p.title?.toLowerCase().includes(term) ||
      p.submittedBy?.name?.toLowerCase().includes(term) ||
      p.guideTeacher?.name?.toLowerCase().includes(term) ||
      p.guide?.name?.toLowerCase().includes(term) ||
      p.teacher?.name?.toLowerCase().includes(term) ||
      p.department?.name?.toLowerCase().includes(term) ||
      p.subject?.name?.toLowerCase().includes(term) ||
      p.abstract?.toLowerCase().includes(term) ||
      p.technologies?.some((tech) =>
        tech.toLowerCase().includes(term)
      );

    const matchesDepartment =
      !departmentFilter || p.department?.name === departmentFilter;

    const matchesYear =
      !yearFilter || p.academicYear === yearFilter;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesYear
    );
  });

  const clearFilters = () => {
    setDepartmentFilter('');
    setYearFilter('');
  };

  const activeFilterCount = [
    departmentFilter,
    yearFilter,
  ].filter(Boolean).length;

  const totalProjects = projects.length;
  const totalDepartments = departments.length;
  const totalYears = years.length;

  return (
    <div className="repo-page-premium">
      <div className="repo-container">

        {/* Hero Welcome Banner */}
        <div className="repo-hero repo-glass fade-in-up">
          <div className="repo-hero-text">
            <span className="repo-hero-eyebrow">
              <Sparkles size={14} /> Open Repository
            </span>

            <h1 className="repo-hero-title">
              Academic Project Repository
            </h1>

            <p className="repo-hero-subtitle">
              Explore approved, high-impact student capstone and research projects across departments and academic years.
            </p>
          </div>

          {/* Statistics Cards Grid */}
          <div className="repo-stats-grid">
            <div className="repo-stat-card">
              <div className="repo-stat-icon repo-stat-icon-blue">
                <FolderKanban size={22} />
              </div>
              <div>
                <div className="repo-stat-value">{totalProjects}</div>
                <div className="repo-stat-label">Total Projects</div>
              </div>
            </div>

            <div className="repo-stat-card">
              <div className="repo-stat-icon repo-stat-icon-indigo">
                <Building2 size={22} />
              </div>
              <div>
                <div className="repo-stat-value">{totalDepartments}</div>
                <div className="repo-stat-label">Departments</div>
              </div>
            </div>

            <div className="repo-stat-card">
              <div className="repo-stat-icon repo-stat-icon-purple">
                <CalendarRange size={22} />
              </div>
              <div>
                <div className="repo-stat-value">{totalYears}</div>
                <div className="repo-stat-label">Academic Years</div>
              </div>
            </div>

            <div className="repo-stat-card">
              <div className="repo-stat-icon repo-stat-icon-slate">
                <SlidersHorizontal size={22} />
              </div>
              <div>
                <div className="repo-stat-value">{activeFilterCount}</div>
                <div className="repo-stat-label">Active Filters</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="repo-search-bar">
          <div className="repo-search-input-group">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by project title, student name, guide/faculty, department, technology..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="repo-search-btn">
            Search
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`repo-filter-btn ${showFilters ? 'active' : ''}`}
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="repo-filter-badge">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Expandable Filter Panel */}
        {showFilters && (
          <div className="repo-filter-panel">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="repo-filter-select"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="repo-filter-select"
            >
              <option value="">All Academic Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="repo-clear-filters-btn">
                <RotateCcw size={13} /> Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Counter Header */}
        <p className="repo-results-count">
          Showing {filteredProjects.length} approved project{filteredProjects.length !== 1 ? 's' : ''}
        </p>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="repo-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="repo-skeleton-card" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          /* Empty State */
          <div className="repo-empty-state">
            <div className="repo-empty-icon">
              <FolderSearch size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>
              No matching projects found
            </h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Try adjusting your search query or clear your active department/year filters.
            </p>
          </div>
        ) : (
          /* Projects Grid */
          <div className="repo-grid">
            {filteredProjects.map((p) => (
              <div key={p._id} className="repo-card">
                <div>
                  {/* Card Header with Title & Badges */}
                  <div className="repo-card-header">
                    <div>
                      <h3 className="repo-card-title">{p.title}</h3>
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                      <StatusBadge status={p.status || 'Approved'} />
                      {p.academicYear && (
                        <span className="repo-card-year">
                          {p.academicYear}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Abstract */}
                  <p className="repo-card-abstract">
                    {p.abstract || 'No abstract description provided.'}
                  </p>

                  {/* Metadata List */}
                  <div className="repo-card-meta">
                    <div className="repo-meta-item">
                      <strong>
                        <Building2 size={14} style={{ color: '#2563EB' }} /> Department
                      </strong>
                      <span>{p.department?.name || 'N/A'}</span>
                    </div>

                    <div className="repo-meta-item">
                      <strong>
                        <BookOpen size={14} style={{ color: '#4F46E5' }} /> Subject
                      </strong>
                      <span>{p.subject?.name || 'N/A'}</span>
                    </div>

                    <div className="repo-meta-item">
                      <strong>
                        <User size={14} style={{ color: '#7C3AED' }} /> Submitted By
                      </strong>
                      <span>{p.submittedBy?.name || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Technology Chips */}
                  {p.technologies?.length > 0 && (
                    <div className="repo-card-tech">
                      {p.technologies.map((tech, index) => (
                        <span key={index} className="repo-tech-pill">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="repo-card-footer">
                  {p.githubLink && (
                    <a
                      href={p.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="repo-card-link github"
                      title="View GitHub Repository"
                    >
                      <Code2 size={14} /> GitHub
                    </a>
                  )}

                  {p.demoVideoLink && (
                    <a
                      href={p.demoVideoLink}
                      target="_blank"
                      rel="noreferrer"
                      className="repo-card-link demo"
                      title="Watch Project Demo Video"
                    >
                      <Video size={14} /> Demo
                    </a>
                  )}

                  {p.reportFile && (
                    <a
                      href={`https://open-repository-backend.onrender.com//${p.reportFile}`}
                      target="_blank"
                      rel="noreferrer"
                      className="repo-card-link report"
                      title="Download Project Documentation PDF"
                    >
                      <FileDown size={14} /> Download Report
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Repository;