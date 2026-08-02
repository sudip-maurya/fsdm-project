import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Database,
  FolderGit2,
  Layers,
  Search,
  ShieldCheck,
  Upload,
  UserCheck,
} from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="uni-home-container">
      {/* Hero Section */}
      <section className="uni-hero fade-in-up">
        <div className="uni-hero-badge">
          <BookOpen size={16} />
          <span>Centralized Academic Platform</span>
        </div>

        <h1 className="uni-hero-title">
          Open <span>Repository</span>
        </h1>

        <h2 className="uni-hero-subtitle">
          A Centralized Academic Project Repository
        </h2>

        <p className="uni-hero-description">
          Open Repository is a centralized platform that helps students and faculty manage academic projects from all departments. It simplifies project submission, faculty review, secure storage, and easy access to approved projects through a single organized repository.
        </p>

        <div className="uni-hero-actions">
          <Link to="/register" className="uni-btn-primary">
            Get Started <ArrowRight size={16} />
          </Link>
          <Link to="/repository" className="uni-btn-secondary">
            <Search size={16} /> Browse Repository
          </Link>
        </div>
      </section>

      {/* Section 1 – How Open Repository Works */}
      <section className="uni-section fade-in-up delay-1">
        <div className="uni-section-header">
          <span className="uni-section-tag">WORKFLOW</span>
          <h2 className="uni-section-title">How Open Repository Works</h2>
        </div>

        <div className="uni-workflow-grid">
          {/* Step 1 */}
          <div className="uni-workflow-step">
            <div className="uni-workflow-icon-circle">
              <Upload size={24} />
              <span className="uni-workflow-step-num">1</span>
            </div>
            <h3>Submit Project</h3>
            <p>Students upload their academic projects along with reports, source code, and required documents.</p>
            <div className="uni-workflow-arrow" aria-hidden="true">
              <ArrowRight size={16} />
            </div>
          </div>

          {/* Step 2 */}
          <div className="uni-workflow-step">
            <div className="uni-workflow-icon-circle">
              <UserCheck size={24} />
              <span className="uni-workflow-step-num">2</span>
            </div>
            <h3>Faculty Review</h3>
            <p>Faculty members review submissions, provide feedback, and verify project quality.</p>
            <div className="uni-workflow-arrow" aria-hidden="true">
              <ArrowRight size={16} />
            </div>
          </div>

          {/* Step 3 */}
          <div className="uni-workflow-step">
            <div className="uni-workflow-icon-circle">
              <CheckCircle2 size={24} />
              <span className="uni-workflow-step-num">3</span>
            </div>
            <h3>Project Approval</h3>
            <p>Approved projects are validated and prepared for publication in the repository.</p>
            <div className="uni-workflow-arrow" aria-hidden="true">
              <ArrowRight size={16} />
            </div>
          </div>

          {/* Step 4 */}
          <div className="uni-workflow-step">
            <div className="uni-workflow-icon-circle">
              <Database size={24} />
              <span className="uni-workflow-step-num">4</span>
            </div>
            <h3>Repository Archive</h3>
            <p>Approved projects become part of the centralized repository for future reference and learning.</p>
          </div>
        </div>
      </section>

      {/* Section 2 – Platform Highlights */}
      <section className="uni-section fade-in-up delay-2">
        <div className="uni-section-header">
          <span className="uni-section-tag">HIGHLIGHTS</span>
          <h2 className="uni-section-title">Platform Highlights</h2>
        </div>

        <div className="uni-highlights-grid">
          <div className="uni-highlight-card">
            <div className="uni-highlight-icon-wrapper">
              <Layers size={24} />
            </div>
            <h3>All Departments</h3>
            <p>Supports academic projects from every department through one centralized platform.</p>
          </div>

          <div className="uni-highlight-card">
            <div className="uni-highlight-icon-wrapper">
              <ShieldCheck size={24} />
            </div>
            <h3>Faculty Review</h3>
            <p>Every project is reviewed and verified by faculty before publication.</p>
          </div>

          <div className="uni-highlight-card">
            <div className="uni-highlight-icon-wrapper">
              <FolderGit2 size={24} />
            </div>
            <h3>Digital Repository</h3>
            <p>Store approved academic projects securely for long-term access.</p>
          </div>

          <div className="uni-highlight-card">
            <div className="uni-highlight-icon-wrapper">
              <Search size={24} />
            </div>
            <h3>Easy Search</h3>
            <p>Quickly discover projects using title, department, technology, or academic year.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="uni-footer fade-in-up">
        <div className="uni-footer-content-simple">
          <div className="uni-footer-brand">
            <h4>
              <BookOpen size={22} className="uni-footer-brand-icon" />
              Open Repository
            </h4>
            <p className="uni-footer-desc">
              A centralized platform for managing, reviewing, and exploring academic projects across all departments.
            </p>
          </div>

          <div className="uni-footer-nav">
            <ul className="uni-footer-links-row">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/repository">Repository</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="uni-footer-bottom">
          <div>© 2026 Open Repository. All Rights Reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
