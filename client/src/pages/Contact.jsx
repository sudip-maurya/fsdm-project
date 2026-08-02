import React, { useEffect } from 'react';
import ContactSection from '../components/ContactSection';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ minHeight: '80vh', paddingTop: '20px', paddingBottom: '40px' }}>
      <ContactSection />

      {/* Simple Page Footer */}
      <footer className="uni-footer" style={{ maxWidth: '1100px', margin: '40px auto 0', borderRadius: '16px' }}>
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

export default Contact;
