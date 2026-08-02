import { CheckCircle2, Clock, AlertTriangle, XCircle } from 'lucide-react';

const statusConfig = {
  Approved: {
    className: 'teacher-badge teacher-badge-approved',
    icon: <CheckCircle2 size={14} />,
    label: 'Approved',
  },
  Pending: {
    className: 'teacher-badge teacher-badge-pending',
    icon: <Clock size={14} />,
    label: 'Pending',
  },
  Rejected: {
    className: 'teacher-badge teacher-badge-rejected',
    icon: <XCircle size={14} />,
    label: 'Rejected',
  },
  'Needs Improvement': {
    className: 'teacher-badge teacher-badge-improvement',
    icon: <AlertTriangle size={14} />,
    label: 'Needs Improvement',
  },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.Pending;
  return (
    <span className={config.className}>
      {config.icon}
      {config.label}
    </span>
  );
};

export default StatusBadge;