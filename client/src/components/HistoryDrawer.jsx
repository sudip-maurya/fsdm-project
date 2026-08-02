import { Offcanvas } from 'react-bootstrap';

const dotColor = {
  Pending: '#F59E0B',
  Approved: '#22C55E',
  Rejected: '#EF4444',
  'Needs Improvement': '#3B82F6',
};

const HistoryDrawer = ({ show, onHide, project }) => {
  if (!project) return null;

  const timeline = [
    ...project.versions.map((v) => ({
      label: `Version ${v.versionNumber}`,
      sub: v.status,
      date: v.submittedAt,
      color: dotColor[v.status] || '#94A3B8',
    })),
    {
      label: `Version ${project.currentVersion} (Current)`,
      sub: project.status,
      date: project.updatedAt,
      color: dotColor[project.status] || '#94A3B8',
    },
  ];

  return (
    <Offcanvas show={show} onHide={onHide} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title style={{ fontWeight: 700 }}>Project History</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <h6 style={{ color: '#64748B', marginBottom: 20 }}>{project.title}</h6>
        {timeline.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: item.color,
                marginTop: 4,
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ fontWeight: 600 }}>{item.label}</div>
              <div style={{ color: '#64748B', fontSize: 13 }}>{item.sub}</div>
              <div style={{ color: '#94A3B8', fontSize: 12 }}>
                {new Date(item.date).toLocaleDateString('en-GB', {
                  day: '2-digit', month: 'short', year: 'numeric',
                })}
              </div>
            </div>
          </div>
        ))}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default HistoryDrawer;