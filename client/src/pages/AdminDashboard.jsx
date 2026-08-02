import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ManageUsers from '../components/ManageUsers';
import ManageDepartments from '../components/ManageDepartments';
import ManageSubjects from '../components/ManageSubjects';
import Reports from '../components/Reports';
import API from '../api/axios';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  UserCheck,
  Building2,
  BookOpen,
  FileSpreadsheet
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  // Stats state
  const [userStats, setUserStats] = useState({ total: 0, students: 0, teachers: 0 });
  const [departmentCount, setDepartmentCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, deptRes] = await Promise.all([
          API.get('/admin/users').catch(() => ({ data: [] })),
          API.get('/departments').catch(() => ({ data: [] }))
        ]);
        const usersList = usersRes.data || [];
        const deptsList = deptRes.data || [];
        setUserStats({
          total: usersList.length,
          students: usersList.filter((u) => u.role === 'student').length,
          teachers: usersList.filter((u) => u.role === 'teacher').length
        });
        setDepartmentCount(deptsList.length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard-page">
      <div className="admin-container">
        
        {/* ===== HERO WELCOME BANNER ===== */}
        <div className="teacher-hero fade-in-up">
          <div className="teacher-hero-badge">
            <ShieldCheck size={16} /> Admin Command Center
          </div>
          <h1 className="teacher-hero-title">Welcome back, {user?.name || 'Administrator'} 👋</h1>
          <p className="teacher-hero-subtitle">
            Manage system users, department structures, subject mappings, and access reports efficiently.
          </p>
        </div>

        {/* ===== STATISTICS CARDS ===== */}
        <div className="teacher-stats-grid">
          <div className="teacher-stat-card">
            <div className="teacher-stat-info">
              <span className="teacher-stat-label">Total Users</span>
              <span className="teacher-stat-value">{userStats.total}</span>
            </div>
            <div className="teacher-stat-icon-wrapper teacher-stat-blue">
              <Users size={24} />
            </div>
          </div>

          <div className="teacher-stat-card">
            <div className="teacher-stat-info">
              <span className="teacher-stat-label">Students</span>
              <span className="teacher-stat-value">{userStats.students}</span>
            </div>
            <div className="teacher-stat-icon-wrapper teacher-stat-green">
              <GraduationCap size={24} />
            </div>
          </div>

          <div className="teacher-stat-card">
            <div className="teacher-stat-info">
              <span className="teacher-stat-label">Teachers</span>
              <span className="teacher-stat-value">{userStats.teachers}</span>
            </div>
            <div className="teacher-stat-icon-wrapper teacher-stat-purple">
              <UserCheck size={24} />
            </div>
          </div>

          <div className="teacher-stat-card">
            <div className="teacher-stat-info">
              <span className="teacher-stat-label">Departments</span>
              <span className="teacher-stat-value">{departmentCount}</span>
            </div>
            <div className="teacher-stat-icon-wrapper teacher-stat-amber">
              <Building2 size={24} />
            </div>
          </div>
        </div>

        {/* ===== MODERN TAB NAVIGATION PILLS ===== */}
        <div className="admin-tabs-nav">
          <button
            className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={16} /> Users Management
          </button>

          <button
            className={`admin-tab-btn ${activeTab === 'departments' ? 'active' : ''}`}
            onClick={() => setActiveTab('departments')}
          >
            <Building2 size={16} /> Departments
          </button>

          <button
            className={`admin-tab-btn ${activeTab === 'subjects' ? 'active' : ''}`}
            onClick={() => setActiveTab('subjects')}
          >
            <BookOpen size={16} /> Subjects
          </button>

          <button
            className={`admin-tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <FileSpreadsheet size={16} /> System Reports
          </button>
        </div>

        {/* ===== TAB PANELS ===== */}
        <div className="fade-in-up">
          {activeTab === 'users' && <ManageUsers />}
          {activeTab === 'departments' && <ManageDepartments />}
          {activeTab === 'subjects' && <ManageSubjects />}
          {activeTab === 'reports' && <Reports />}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;