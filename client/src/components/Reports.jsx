import { useEffect, useState } from 'react';
import API from '../api/axios';

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/reports/summary')
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading report...</p>;
  if (!data) return <p>Failed to load report.</p>;

  const statBox = (label, value, color = '#2563eb') => (
    <div style={{
      background: 'white',
      padding: 16,
      borderRadius: 8,
      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
      minWidth: 140,
      textAlign: 'center',
    }}>
      <p style={{ fontSize: 28, fontWeight: 'bold', color, margin: 0 }}>{value}</p>
      <p style={{ margin: 0, color: '#666' }}>{label}</p>
    </div>
  );

  return (
    <div>
      <h3>Reports & Statistics</h3>

      <h4>Users</h4>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {statBox('Students', data.users.totalStudents)}
        {statBox('Teachers', data.users.totalTeachers)}
        {statBox('Admins', data.users.totalAdmins)}
      </div>

      <h4>Projects by Status</h4>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {statBox('Total Projects', data.projects.total, '#1f2937')}
        {statBox('Pending', data.projects.pending, '#f59e0b')}
        {statBox('Approved', data.projects.approved, '#16a34a')}
        {statBox('Needs Improvement', data.projects.needsImprovement, '#eab308')}
        {statBox('Rejected', data.projects.rejected, '#dc2626')}
      </div>

      <h4>Projects by Department</h4>
      <div className="table-responsive">
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 500 }}>
          <thead>
            <tr>
              <th>Department</th>
              <th>Project Count</th>
            </tr>
          </thead>
          <tbody>
            {data.departmentWise.map((d) => (
              <tr key={d.department}>
                <td>{d.department}</td>
                <td>{d.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;