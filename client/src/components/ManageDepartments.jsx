import { useEffect, useState } from 'react';
import API from '../api/axios';
import { Building2, Trash2 } from 'lucide-react';

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const fetchDepartments = async () => {
    const res = await API.get('/departments');
    setDepartments(res.data);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/departments', { name });
      setName('');
      fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this department?')) return;
    try {
      await API.delete(`/departments/${id}`);
      fetchDepartments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Building2 size={20} /> Manage Departments
      </h3>

      <form
        onSubmit={handleCreate}
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 20,
          background: 'white',
          padding: 16,
          borderRadius: 8,
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        }}
      >
        <input
          placeholder="Department Name (e.g. IT, CS, DS)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ flex: 1 }}
        />
        <button type="submit" style={{ whiteSpace: 'nowrap' }}>Add Department</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 12,
        }}
      >
        {departments.map((d) => (
          <div
            key={d._id}
            style={{
              background: 'white',
              padding: '14px 16px',
              borderRadius: 8,
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontWeight: 600 }}>{d.name}</span>
            <button
              onClick={() => handleDelete(d._id)}
              title="Delete"
              style={{
                background: '#fee2e2',
                color: '#dc2626',
                padding: 6,
                borderRadius: 6,
                display: 'flex',
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageDepartments;