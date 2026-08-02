import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Archive,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  BrainCircuit,
  Check,
  Clock3,
  Database,
  FileCheck2,
  FileSearch,
  Files,
  FolderSearch2,
  GitBranch,
  GraduationCap,
  History,
  LayoutDashboard,
  Lightbulb,
  LockKeyhole,
  MessageSquareText,
  Network,
  Search,
  Send,
  Sparkles,
  Tags,
  Upload,
  UserCheck,
} from 'lucide-react';
import './About.css';

const aboutProblems = [
  { icon: Files, title: 'Lost Project Records', text: 'Important work can disappear across drives, inboxes, and graduation cycles.' },
  { icon: Database, title: 'No Central Repository', text: 'Projects live in disconnected places instead of one shared academic home.' },
  { icon: FolderSearch2, title: 'Difficult Project Search', text: 'Finding relevant prior work should not require asking around or digging through folders.' },
  { icon: MessageSquareText, title: 'Unstructured Faculty Review', text: 'Feedback needs a clear, traceable place alongside every project submission.' },
  { icon: Lightbulb, title: 'Duplicate Project Ideas', text: 'Visible prior work helps students build on existing concepts instead of repeating them.' },
];

const aboutFeatures = [
  { icon: Send, title: 'Easy Project Submission', text: 'Share project files, documentation, and source code in one guided upload space.' },
  { icon: BadgeCheck, title: 'Faculty Review & Feedback', text: 'Reviewers examine, comment on, and validate submissions with complete clarity.' },
  { icon: Archive, title: 'Digital Repository Archive', text: 'Preserve approved academic work permanently for future discovery and learning.' },
  { icon: FileSearch, title: 'Smart Multidisciplinary Search', text: 'Discover projects easily by title, subject, department, or technology stack.' },
  { icon: History, title: 'Version History Tracking', text: 'Keep project iterations, submission progress, and updates organized and visible.' },
  { icon: Tags, title: 'Technology & Concept Tags', text: 'Filter and explore projects based on the specific tools and frameworks used.' },
];

const aboutUsers = [
  { icon: GraduationCap, name: 'Student', accent: 'student', items: ['Upload projects & documents', 'Track review & approval status', 'Update submission versions', 'Browse approved projects for research'] },
  { icon: UserCheck, name: 'Teacher', accent: 'teacher', items: ['Review student submissions', 'Provide structured feedback', 'Approve or request revisions', 'Maintain repository academic quality'] },
  { icon: LayoutDashboard, name: 'Administrator', accent: 'administrator', items: ['Manage user roles & access', 'Configure departments & subjects', 'Generate system analytical reports', 'Monitor repository health & content'] },
];

const aboutWorkflow = [
  { icon: Upload, title: 'Submit Project', text: 'Add your work & docs' },
  { icon: UserCheck, title: 'Faculty Review', text: 'Quality assessment' },
  { icon: MessageSquareText, title: 'Review Comments', text: 'Receive feedback' },
  { icon: GitBranch, title: 'Project Revision', text: 'Refine your work' },
  { icon: FileCheck2, title: 'Approval', text: 'Ready to publish' },
  { icon: Archive, title: 'Repository Archive', text: 'Preserved for learning' },
];

const aboutPromises = [
  { num: '01', icon: Database, label: 'Centralized Project Storage', detail: 'One clear, reliable home for all academic work across all departments.' },
  { num: '02', icon: Clock3, label: 'Faster Faculty Reviews', detail: 'A focused, organized workspace built for structured feedback and approval.' },
  { num: '03', icon: LockKeyhole, label: 'Secure File Management', detail: 'A transparent, controlled environment for managing and protecting project files.' },
  { num: '04', icon: BookOpen, label: 'Knowledge Sharing', detail: 'Approved student projects stay discoverable to inspire and guide future generations.' },
];

const AboutIllustration = () => (
  <svg className="about-illustration-wrapper" viewBox="0 0 510 390" role="img" aria-label="An organized academic project repository illustration">
    <defs>
      <linearGradient id="about-blue-grad" x1="0" x2="1" y1="0" y2="1">
        <stop stopColor="#2563eb" />
        <stop offset="1" stopColor="#4f46e5" />
      </linearGradient>
      <linearGradient id="about-panel-grad" x1="0" x2="1">
        <stop stopColor="#ffffff" />
        <stop offset="1" stopColor="#eff6ff" />
      </linearGradient>
      <filter id="about-card-shadow" x="-30%" y="-30%" width="160%" height="180%">
        <feDropShadow dx="0" dy="16" stdDeviation="14" floodColor="#1e40af" floodOpacity=".16" />
      </filter>
    </defs>
    <circle cx="95" cy="85" r="58" fill="#dbeafe" opacity=".85" />
    <circle cx="416" cy="290" r="72" fill="#e0e7ff" opacity=".9" />
    <path d="M84 306c35-65 69-85 140-62s106 19 166-41" fill="none" stroke="#bfdbfe" strokeWidth="18" strokeLinecap="round" opacity=".55" />
    <g filter="url(#about-card-shadow)">
      <rect x="92" y="54" width="326" height="244" rx="25" fill="url(#about-panel-grad)" stroke="#dbeafe" />
      <path d="M92 79c0-13.8 11.2-25 25-25h276c13.8 0 25 11.2 25 25v29H92V79z" fill="url(#about-blue-grad)" />
      <circle cx="120" cy="81" r="5" fill="white" opacity=".8" />
      <circle cx="137" cy="81" r="5" fill="white" opacity=".55" />
      <circle cx="154" cy="81" r="5" fill="white" opacity=".35" />
      <rect x="117" y="132" width="83" height="135" rx="13" fill="#eff6ff" />
      <rect x="135" y="151" width="47" height="7" rx="3.5" fill="#93c5fd" />
      <rect x="135" y="176" width="35" height="7" rx="3.5" fill="#cbd5e1" />
      <rect x="135" y="199" width="43" height="7" rx="3.5" fill="#cbd5e1" />
      <rect x="135" y="222" width="30" height="7" rx="3.5" fill="#cbd5e1" />
      <rect x="221" y="132" width="169" height="51" rx="13" fill="white" stroke="#dbeafe" />
      <rect x="237" y="148" width="74" height="8" rx="4" fill="#1d4ed8" opacity=".88" />
      <rect x="237" y="164" width="111" height="6" rx="3" fill="#cbd5e1" />
      <circle cx="365" cy="157" r="12" fill="#dcfce7" />
      <path d="m360 157 4 4 7-8" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="221" y="199" width="169" height="51" rx="13" fill="white" stroke="#dbeafe" />
      <rect x="237" y="215" width="61" height="8" rx="4" fill="#4f46e5" opacity=".85" />
      <rect x="237" y="231" width="102" height="6" rx="3" fill="#cbd5e1" />
      <circle cx="365" cy="224" r="12" fill="#dbeafe" />
      <path d="M361 224h8M365 220v8" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" />
    </g>
    <g filter="url(#about-card-shadow)">
      <rect x="47" y="257" width="112" height="71" rx="17" fill="white" stroke="#dbeafe" />
      <rect x="63" y="274" width="28" height="28" rx="9" fill="#dbeafe" />
      <path d="M72 288h10M77 283v10" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="101" y="276" width="39" height="7" rx="3.5" fill="#1e3a8a" />
      <rect x="101" y="291" width="28" height="6" rx="3" fill="#cbd5e1" />
    </g>
    <g filter="url(#about-card-shadow)">
      <rect x="362" y="35" width="100" height="70" rx="17" fill="white" stroke="#dbeafe" />
      <circle cx="387" cy="70" r="14" fill="#e0e7ff" />
      <path d="M381 70h12M387 64v12" stroke="#4f46e5" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="411" y="58" width="30" height="7" rx="3.5" fill="#1e3a8a" />
      <rect x="411" y="74" width="20" height="6" rx="3" fill="#cbd5e1" />
    </g>
  </svg>
);

const About = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const root = containerRef.current;
    if (!root) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = root.querySelectorAll('.about-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page-container" ref={containerRef}>
      {/* 1. About Open Repository (Hero Card) */}
      <section className="about-main-hero-card about-hero-load-anim">
        <div className="about-hero-badge-tag">
          <Sparkles size={14} />
          <span>Built for Academic Excellence</span>
        </div>

        <div className="about-hero-grid-layout">
          <div className="about-hero-text-block">
            <h1>
              About <span>Open Repository</span>
            </h1>
            <p>
              Open Repository is a dedicated academic platform designed to streamline project submissions, faculty reviews, secure archiving, and multidisciplinary project discovery. Built to serve departments sitewide, it provides a structured, accessible environment for academic growth.
            </p>
            <div className="about-hero-btn-group">
              <Link to="/register" className="about-hero-primary-btn">
                Get Started <ArrowUpRight size={17} />
              </Link>
              <Link to="/repository" className="about-hero-secondary-btn">
                Browse Repository <ArrowRight size={17} />
              </Link>
            </div>
            <div className="about-hero-chips" aria-label="Key features">
              <span><Check size={14} /> Faculty Review</span>
              <span><Check size={14} /> Secure Repository</span>
              <span><Check size={14} /> Smart Search</span>
            </div>
          </div>

          <AboutIllustration />
        </div>
      </section>

      {/* 2. Our Mission */}
      <section className="about-mission-section about-reveal">
        <div className="about-mission-icon-box">
          <Network size={28} />
        </div>
        <div className="about-mission-content">
          <span className="about-kicker">Our Mission</span>
          <h2>Make every academic project easier to carry forward.</h2>
          <p>
            Open Repository simplifies project submission, faculty review, and long-term academic storage—bringing students, teachers, and administrators into one clear, connected workflow so that quality work is preserved and shared.
          </p>
        </div>
      </section>

      {/* 3. Why We Built It */}
      <section className="about-why-built-section about-reveal">
        <div className="about-section-header">
          <span className="about-kicker">Why We Built It</span>
          <h2>Academic work deserves a better system.</h2>
          <p>Traditional project submission methods lead to lost work, delayed feedback, and duplicated efforts across graduation cycles.</p>
        </div>

        <div className="about-problems-grid">
          {aboutProblems.map(({ icon: Icon, title, text }) => (
            <article className="about-problem-card" key={title}>
              <div className="about-problem-icon"><Icon size={20} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>

        <div className="about-solution-banner">
          <div className="about-solution-icon">
            <BrainCircuit size={26} />
          </div>
          <div className="about-solution-text">
            <span>The Open Repository Approach</span>
            <p>One structured space turns scattered academic work into an accessible, review-ready knowledge base—so each approved project can inform what comes next.</p>
          </div>
        </div>
      </section>

      {/* 4. Platform Features */}
      <section className="about-features-section about-reveal">
        <div className="about-section-header">
          <span className="about-kicker">Platform Features</span>
          <h2>Designed for the complete project lifecycle.</h2>
        </div>

        <div className="about-features-grid">
          {aboutFeatures.map(({ icon: Icon, title, text }) => (
            <article className="about-feature-card" key={title}>
              <div className="about-feature-icon"><Icon size={22} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
              <ArrowUpRight size={16} className="about-feature-arrow" />
            </article>
          ))}
        </div>
      </section>

      {/* 5. Who Uses Open Repository */}
      <section className="about-users-section about-reveal">
        <div className="about-section-header centered">
          <span className="about-kicker">Built for Every Role</span>
          <h2>Who uses Open Repository?</h2>
          <p>Every user role gains a dedicated, streamlined experience tailored to their academic responsibilities.</p>
        </div>

        <div className="about-users-grid">
          {aboutUsers.map(({ icon: Icon, name, accent, items }) => (
            <article className={`about-user-card ${accent}`} key={name}>
              <div className="about-user-head">
                <div className="about-user-avatar"><Icon size={26} /></div>
                <div>
                  <span>For</span>
                  <h3>{name}</h3>
                </div>
              </div>
              <ul>
                {items.map((item) => (
                  <li key={item}><Check size={15} />{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* 6. Project Workflow Timeline */}
      <section className="about-timeline-section about-reveal">
        <div className="about-section-header centered">
          <span className="about-kicker">A Transparent Path</span>
          <h2>Project Workflow Timeline</h2>
          <p>Every submission progresses through a clear, traceable, review-friendly process.</p>
        </div>

        <div className="about-timeline-grid">
          {aboutWorkflow.map(({ icon: Icon, title, text }, index) => (
            <div className="about-timeline-step" key={title}>
              <div className="about-timeline-marker"><Icon size={19} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
              {index < aboutWorkflow.length - 1 && <span className="about-timeline-line" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </section>

      {/* 7. Why Choose Open Repository */}
      <section className="about-why-choose-section about-reveal">
        <div className="about-section-header">
          <span className="about-kicker">Why Choose Us</span>
          <h2>Made to keep academic knowledge moving.</h2>
        </div>

        <div className="about-promises-grid">
          {aboutPromises.map(({ num, icon: Icon, label, detail }) => (
            <article className="about-promise-card" key={label}>
              <span className="about-promise-num">{num}</span>
              <Icon size={24} />
              <h3>{label}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 8. Vision */}
      <section className="about-vision-section about-reveal">
        <div className="about-vision-pattern" />
        <div className="about-vision-icon"><Sparkles size={25} /></div>
        <span className="about-kicker">Our Vision</span>
        <blockquote>
          “To build a modern academic repository that preserves student innovation, encourages collaboration, and makes quality academic projects easily accessible for future generations.”
        </blockquote>
      </section>

      {/* 9. Contact / CTA */}
      <footer className="about-cta-footer-section about-reveal">
        <div className="about-cta-card">
          <div className="about-cta-info">
            <h3>Ready to explore or submit academic projects?</h3>
            <p>Get started today with Open Repository for your department.</p>
          </div>
          <div className="about-cta-actions">
            <Link to="/register" className="about-hero-primary-btn">
              Get Started <ArrowRight size={16} />
            </Link>
            <Link to="/repository" className="about-hero-secondary-btn">
              <Search size={16} /> Browse Repository
            </Link>
          </div>
        </div>

        <div className="about-footer-main">
          <div className="about-footer-brand">
            <h4>
              <BookOpen size={22} />
              Open Repository
            </h4>
            <p>
              A centralized academic project repository platform for managing, reviewing, and exploring student projects across all departments.
            </p>
          </div>

          <ul className="about-footer-nav-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/repository">Repository</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>

        <div className="about-footer-bottom">
          <div>© 2026 Open Repository. All Rights Reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default About;
