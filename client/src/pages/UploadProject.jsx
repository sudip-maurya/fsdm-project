import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Form } from 'react-bootstrap';
import { FaSave, FaFolderOpen, FaChalkboardTeacher, FaLink, FaFileUpload } from 'react-icons/fa';
import API from '../api/axios';

const UploadProject = () => {
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    description: '',
    department: '',
    academicYear: '',
    subject: '',
    guide: '',
    technologies: '',
    teamMembers: '',
    keywords: '',
    githubLink: '',
    demoVideoLink: '',
  });
  const [reportFile, setReportFile] = useState(null);
  const [sourceCodeFile, setSourceCodeFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/departments').then((res) => setDepartments(res.data));
  }, []);

  useEffect(() => {
    if (formData.department) {
      API.get(`/subjects/department/${formData.department}`).then((res) =>
        setSubjects(res.data)
      );
    } else {
      setSubjects([]);
    }
  }, [formData.department]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (reportFile) data.append('reportFile', reportFile);
    if (sourceCodeFile) data.append('sourceCodeFile', sourceCodeFile);

    try {
      await API.post('/projects', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setError('');
      setSuccess('Project submitted successfully!');
      setTimeout(() => navigate('/student/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    }
  };

  const Label = ({ children, required }) => (
    <label className="form-label-custom">
      {children}
      {required && <span className="required-star">*</span>}
    </label>
  );

  return (
    <div style={{ maxWidth: 800, margin: '30px auto', padding: '0 20px 60px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700, margin: 0 }}>Upload New Project</h2>
        <p style={{ color: '#6B7280', marginTop: 4 }}>
          Submit your academic project with all required details and supporting files.
        </p>
      </div>

      <Form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="form-section">
          <div className="form-section-title"><FaFolderOpen color="#2563EB" /> Basic Information</div>

          <div style={{ marginBottom: 16 }}>
            <Label required>Project Title</Label>
            <Form.Control name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div style={{ marginBottom: 16 }}>
            <Label required>Abstract</Label>
            <Form.Control as="textarea" rows={2} name="abstract" value={formData.abstract} onChange={handleChange} required />
          </div>

          <div style={{ marginBottom: 16 }}>
            <Label required>Description</Label>
            <Form.Control as="textarea" rows={4} name="description" value={formData.description} onChange={handleChange} required />
          </div>

          <Row>
            <Col md={6} style={{ marginBottom: 16 }}>
              <Label required>Department</Label>
              <Form.Select name="department" value={formData.department} onChange={handleChange} required>
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6} style={{ marginBottom: 16 }}>
              <Label required>Subject</Label>
              <Form.Select name="subject" value={formData.subject} onChange={handleChange} required disabled={!formData.department}>
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </div>

        {/* Academic Information */}
        <div className="form-section">
          <div className="form-section-title"><FaChalkboardTeacher color="#2563EB" /> Academic Information</div>
          <Row>
            <Col md={6} style={{ marginBottom: 16 }}>
              <Label required>Academic Year</Label>
              <Form.Control name="academicYear" placeholder="e.g. 2025-2026" value={formData.academicYear} onChange={handleChange} required />
            </Col>
            <Col md={6} style={{ marginBottom: 16 }}>
              <Label required>Guide Name</Label>
              <Form.Control name="guide" value={formData.guide} onChange={handleChange} required />
            </Col>
          </Row>
          <Row>
            <Col md={6} style={{ marginBottom: 16 }}>
              <Label>Technologies</Label>
              <Form.Control name="technologies" placeholder="Comma separated" value={formData.technologies} onChange={handleChange} />
            </Col>
            <Col md={6} style={{ marginBottom: 16 }}>
              <Label>Team Members</Label>
              <Form.Control name="teamMembers" placeholder="Comma separated" value={formData.teamMembers} onChange={handleChange} />
            </Col>
          </Row>
          <div style={{ marginBottom: 4 }}>
            <Label>Keywords</Label>
            <Form.Control name="keywords" placeholder="Comma separated" value={formData.keywords} onChange={handleChange} />
          </div>
        </div>

        {/* Project Links */}
        <div className="form-section">
          <div className="form-section-title"><FaLink color="#2563EB" /> Project Links</div>
          <Row>
            <Col md={6} style={{ marginBottom: 16 }}>
              <Label>GitHub Link (Optional)</Label>
              <Form.Control name="githubLink" placeholder="https://github.com/..." value={formData.githubLink} onChange={handleChange} />
            </Col>
            <Col md={6} style={{ marginBottom: 4 }}>
              <Label>Demo Video Link (Optional)</Label>
              <Form.Control name="demoVideoLink" placeholder="https://..." value={formData.demoVideoLink} onChange={handleChange} />
            </Col>
          </Row>
        </div>

        {/* Files */}
        <div className="form-section">
          <div className="form-section-title"><FaFileUpload color="#2563EB" /> Files</div>
          <Row>
            <Col md={6} style={{ marginBottom: 16 }}>
              <Label>Report (PDF)</Label>
              <Form.Control type="file" accept="application/pdf" onChange={(e) => setReportFile(e.target.files[0])} />
            </Col>
            <Col md={6} style={{ marginBottom: 4 }}>
              <Label>Source Code (ZIP)</Label>
              <Form.Control type="file" accept=".zip" onChange={(e) => setSourceCodeFile(e.target.files[0])} />
            </Col>
          </Row>
        </div>

        {error && (
          <p style={{ color: '#dc2626', fontWeight: 600, marginTop: 8, marginBottom: 12 }}>
            {error}
          </p>
        )}
        {success && (
          <p style={{ color: '#16a34a', fontWeight: 600, marginTop: 8, marginBottom: 12 }}>
            {success}
          </p>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="save-btn">
            <FaSave /> Submit Project
          </button>
          <button type="button" className="cancel-btn" onClick={() => navigate('/student/dashboard')}>
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
};

export default UploadProject;