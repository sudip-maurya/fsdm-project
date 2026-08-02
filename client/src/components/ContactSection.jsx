import React, { useState } from 'react';
import {
  FolderGit2,
  Users,
  Mail,
  Copy,
  Check,
  Send,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import './ContactSection.css';

const ContactSection = () => {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const email = 'sudipmauryaff666@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setShowToast(true);

    setTimeout(() => {
      setCopied(false);
    }, 2500);

    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  return (
    <section id="contact" className="contact-saas-container fade-in-up">
      {/* Toast Notification */}
      {showToast && (
        <div className="contact-toast" role="status" aria-live="polite">
          <div className="contact-toast-icon">
            <Check size={16} strokeWidth={2.5} />
          </div>
          <span className="contact-toast-text">Email copied successfully!</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="contact-hero-header">
        <div className="contact-badge">
          <Sparkles size={14} className="contact-badge-icon" />
          <span>Feedback & Support</span>
        </div>
        <h2 className="contact-hero-title">
          Contact <span className="contact-title-accent">Us</span>
        </h2>
        <p className="contact-hero-subtitle">
          Have a suggestion or found an issue? We'd love to hear your feedback.
        </p>
      </div>

      {/* 3-Card Grid */}
      <div className="contact-grid">
        {/* Card 1 – About the Project */}
        <div className="contact-card">
          <div className="contact-icon-box project-icon">
            <FolderGit2 size={26} strokeWidth={2} />
          </div>
          <h3 className="contact-card-title">Open Repository</h3>
          <p className="contact-card-description">
            A paperless academic project repository developed to simplify project submission, faculty review, and repository management.
          </p>
          <div className="contact-card-tags">
            <span className="contact-tag">Academic</span>
            <span className="contact-tag">Paperless</span>
            <span className="contact-tag">Repository</span>
          </div>
        </div>

        {/* Card 2 – Development Team */}
        <div className="contact-card">
          <div className="contact-icon-box team-icon">
            <Users size={26} strokeWidth={2} />
          </div>
          <h3 className="contact-card-title">Development Team</h3>
          <div className="contact-team-list">
            <div className="contact-team-item">
              <span className="contact-emoji" role="img" aria-label="developer">👨‍💻</span>
              <div className="contact-team-details">
                <span className="contact-member-name">Sudip Awadhesh Maurya</span>
                <span className="contact-member-role">Project Developer</span>
              </div>
            </div>
            <div className="contact-team-item">
              <span className="contact-emoji" role="img" aria-label="developer">👩‍💻</span>
              <div className="contact-team-details">
                <span className="contact-member-name">Shrishti Vinay Mishra</span>
                <span className="contact-member-role">Project Developer</span>
              </div>
            </div>
            <div className="contact-team-item college-item">
              <span className="contact-emoji" role="img" aria-label="college">🎓</span>
              <div className="contact-team-details">
                <span className="contact-member-name">Thakur Shyamnarayan Degree College</span>
                <span className="contact-member-role">Academic Institution</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 – Contact */}
        <div className="contact-card email-card">
          <div className="contact-icon-box email-icon">
            <Mail size={26} strokeWidth={2} />
          </div>
          <h3 className="contact-card-title">Contact Email</h3>
          <p className="contact-card-description">
            For any questions, suggestions, feedback, or bug reports, please email us.
          </p>
          <div className="contact-email-box">
            <span className="contact-email-address" title={email}>{email}</span>
            <button
              type="button"
              className={`contact-copy-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopyEmail}
              aria-label="Copy Email address to clipboard"
            >
              {copied ? (
                <>
                  <Check size={14} strokeWidth={2.5} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} strokeWidth={2} />
                  <span>Copy Email</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Full-Width CTA Banner */}
      <div className="contact-cta-banner">
        <div className="contact-cta-left">
          <span className="contact-cta-icon" role="img" aria-label="lightbulb">💡</span>
          <span className="contact-cta-text">
            Your feedback helps improve <strong>Open Repository</strong>.
          </span>
        </div>
        <a
          href={`mailto:${email}`}
          className="contact-send-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Send size={16} strokeWidth={2} />
          <span>Send Email</span>
          <ExternalLink size={14} className="contact-send-arrow" />
        </a>
      </div>
    </section>
  );
};

export default ContactSection;
