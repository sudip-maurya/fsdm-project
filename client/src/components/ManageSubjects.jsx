import { useEffect, useState } from 'react';
import API from '../api/axios';
import { BookMarked, Trash2 } from 'lucide-react';

const ManageSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [viewFilter, setViewFilter] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    const [subRes, deptRes] = await Promise.all([
      API.get('/subjects'),
      API.get('/departments'),
    ]);
    setSubjects(subRes.data);
    setDepartments(deptRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleDepartment = (id) => {
    setSelectedDepartments((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/subjects', { name, departments: selectedDepartments });
      setName('');
      setSelectedDepartments([]);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject?')) return;
    await API.delete(`/subjects/${id}`);
    fetchData();
  };

  const filteredSubjects = viewFilter
    ? subjects.filter(
        (s) => s.departments.length === 0 || s.departments.some((d) => d._id === viewFilter)
      )
    : subjects;

  return (
    <div>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <BookMarked size={20} /> Manage Subjects
      </h3>

      <form
        onSubmit={handleCreate}
        style={{
          marginBottom: 16,
          background: 'white',
          padding: 16,
          borderRadius: 8,
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        }}
      >
        <input
          placeholder="Subject Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ marginBottom: 12 }}
        />

        <p style={{ fontSize: 13, color: '#666', margin: '0 0 8px' }}>
          Applies to (leave all unchecked = All Departments):
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 14 }}>
          {departments.map((d) => (
            <label
              key={d._id}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 400 }}
            >
              <input
                type="checkbox"
                checked={selectedDepartments.includes(d._id)}
                onChange={() => toggleDepartment(d._id)}
                style={{ width: 'auto', margin: 0 }}
              />
              {d.name}
            </label>
          ))}
        </div>

        <button type="submit">Add Subject</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 14, color: '#666', marginRight: 8 }}>View subjects for:</label>
        <select value={viewFilter} onChange={(e) => setViewFilter(e.target.value)} style={{ minWidth: 180, width: 'auto' }}>
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 12,
        }}
      >
        {filteredSubjects.map((s) => (
          <div
            key={s._id}
            style={{
              background: 'white',
              padding: '14px 16px',
              borderRadius: 8,
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: s.departments.length ? '#888' : '#2563eb' }}>
                {s.departments.length
                  ? s.departments.map((d) => d.name).join(', ')
                  : 'All Departments'}
              </div>
            </div>
            <button
              onClick={() => handleDelete(s._id)}
              title="Delete"
              style={{ background: '#fee2e2', color: '#dc2626', padding: 6, borderRadius: 6, display: 'flex' }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {filteredSubjects.length === 0 && <p style={{ color: '#888' }}>No subjects found for this department.</p>}
      </div>
    </div>
  );
};

export default ManageSubjects;