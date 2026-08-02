import StatusBadge from './StatusBadge';
import { History, FileText, Calendar } from 'lucide-react';

const VersionHistory = ({ project }) => {
  if (!project?.versions || project.versions.length === 0) {
    return (
      <div style={{ padding: '16px 0', color: '#94A3B8', fontSize: '13.5px' }}>
        No previous versions submitted yet.
      </div>
    );
  }

  return (
    <div style={{ marginTop: 20 }}>
      <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        <History size={18} style={{ color: '#2563EB' }} />
        Version History ({project.versions.length})
      </h4>
      <div className="teacher-timeline">
        {project.versions
          .slice()
          .reverse()
          .map((v, idx) => (
            <div key={idx} className="teacher-timeline-node">
              <div className="teacher-timeline-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ fontWeight: 700, color: '#1E293B', fontSize: '13.5px' }}>
                    Version {v.versionNumber}
                  </span>
                  <StatusBadge status={v.status} />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', color: '#64748B', marginBottom: 8 }}>
                  <Calendar size={13} />
                  {new Date(v.submittedAt).toLocaleString()}
                </div>

                <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#334155' }}>
                  <strong>Title:</strong> {v.title}
                </p>
                {v.abstract && (
                  <p style={{ margin: '0 0 6px', fontSize: '12.5px', color: '#64748B', lineHeight: 1.4 }}>
                    <strong>Abstract:</strong> {v.abstract}
                  </p>
                )}
                {v.technologies && v.technologies.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8, marginBottom: 8 }}>
                    {v.technologies.map((tech, i) => (
                      <span key={i} className="repo-tech-pill" style={{ fontSize: '11px' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {v.reportFile && (
                  <a
                    href={`http://localhost:5000/${v.reportFile}`}
                    target="_blank"
                    rel="noreferrer"
                    className="teacher-btn-link"
                    style={{ marginTop: 4 }}
                  >
                    <FileText size={13} /> View Old Report
                  </a>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default VersionHistory;