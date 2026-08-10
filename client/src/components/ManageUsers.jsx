import { useEffect, useState, useMemo } from 'react';
import API from '../api/axios';
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Shield,
  Building2,
  Search,
  Trash2,
  AlertCircle,
  Users
} from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student', department: '' });
  const [error, setError] = useState('');

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');

  const fetchUsers = async () => {
    const res = await API.get('/admin/users');
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/admin/users', formData);
      setFormData({ name: '', email: '', password: '', role: 'student', department: '' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await API.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  // Departments list for filter
  const departmentsList = useMemo(() => {
    const depts = new Set();
    users.forEach((u) => {
      if (u.department) depts.add(u.department);
    });
    return Array.from(depts);
  }, [users]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const term = search.toLowerCase();
      const matchesSearch =
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.department?.toLowerCase().includes(term);

      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesDept = deptFilter === 'all' || u.department === deptFilter;

      return matchesSearch && matchesRole && matchesDept;
    });
  }, [users, search, roleFilter, deptFilter]);

  return (
    <div>
      {/* ===== ADD NEW USER CARD ===== */}
      <div className="admin-card">
        <div className="admin-card-title">
          <UserPlus size={18} style={{ color: '#2563EB' }} /> Add New System User
        </div>

        {error && (
          <div className="auth-alert auth-alert-error" style={{ marginBottom: 16 }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleCreate}>
          <div className="admin-form-grid">
            {/* Name */}
            <div className="admin-input-box">
              <User size={16} />
              <input
                className="admin-input"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="admin-input-box">
              <Mail size={16} />
              <input
                className="admin-input"
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="admin-input-box">
              <Lock size={16} />
              <input
                className="admin-input"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Role Select */}
            <div>
              <select className="admin-select" style={{ width: '100%' }} name="role" value={formData.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Department */}
            <div className="admin-input-box">
              <Building2 size={16} />
              <input
                className="admin-input"
                name="department"
                placeholder="Department (e.g. IT, CS)"
                value={formData.department}
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="admin-btn-primary">
              <UserPlus size={16} /> Add User
            </button>
          </div>
        </form>
      </div>

      {/* ===== SEARCH & FILTER BAR ABOVE TABLE ===== */}
      <div className="teacher-filter-bar" style={{ marginBottom: 20 }}>
        <div className="teacher-search-box">
          <Search size={18} />
          <input
            className="teacher-search-input"
            placeholder="Search users by name, email or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="teacher-filters-group">
          {/* Role Filter */}
          <select
            className="teacher-select-filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>

          {/* Department Filter */}
          <select
            className="teacher-select-filter"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departmentsList.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== USERS DATA TABLE ===== */}
      <div className="teacher-table-wrapper">
        {filteredUsers.length === 0 ? (
          <div className="teacher-empty-box">
            <div className="teacher-empty-icon">
              <Users size={28} />
            </div>
            <h3 className="teacher-empty-title">No Users Found</h3>
            <p style={{ margin: 0, fontSize: '13.5px' }}>
              {users.length === 0 ? 'No user accounts exist in the system yet.' : 'Try adjusting your search query or role/department filter.'}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="teacher-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id}>
                    {/* User Name + Avatar */}
                    <td>
                      <div className="teacher-student-cell">
                        <div className="teacher-avatar-circle">
                          {(u.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>{u.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td style={{ color: '#475569', fontWeight: 500 }}>{u.email}</td>

                    {/* Role Badge */}
                    <td>
                      <span className={`teacher-badge role-badge-${u.role}`}>
                        <Shield size={13} />
                        {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                      </span>
                    </td>

                    {/* Department Badge */}
                    <td>
                      {u.department ? (
                        <span className="repo-tech-pill">{u.department}</span>
                      ) : (
                        <span style={{ color: '#94A3B8' }}>—</span>
                      )}
                    </td>

                    {/* Action */}
                    <td>
                      <button
                        className="student-action-btn-delete"
                        onClick={() => handleDelete(u._id)}
                        title="Delete User Account"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;