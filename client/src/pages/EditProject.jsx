import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Form } from 'react-bootstrap';
import { FaSave, FaFolderOpen, FaChalkboardTeacher, FaLink, FaFileUpload } from 'react-icons/fa';
import API from '../api/axios';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  const [sourceCodeFile, setSourceCodeFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [linkError, setLinkError] = useState('');

  const reportInputRef = useRef(null);
  const sourceCodeInputRef = useRef(null);

  const handleRemoveReport = () => {
    setReportFile(null);
    if (reportInputRef.current) {
      reportInputRef.current.value = '';
    }
  };

  const handleRemoveSourceCode = () => {
    setSourceCodeFile(null);
    if (sourceCodeInputRef.current) {
      sourceCodeInputRef.current.value = '';
    }
  };

  useEffect(() => {
    API.get('/health').catch(() => {});
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const [projectRes, deptRes] = await Promise.all([
        API.get(`/projects/${id}`),
        API.get('/departments'),
      ]);
      const p = projectRes.data;
      setFormData({
        title: p.title,
        abstract: p.abstract,
        description: p.description,
        department: p.department?._id || '',
        academicYear: p.academicYear,
        subject: p.subject?._id || '',
        guide: p.guide,
        technologies: p.technologies?.join(', ') || '',
        teamMembers: p.teamMembers?.join(', ') || '',
        keywords: p.keywords?.join(', ') || '',
        githubLink: p.githubLink || '',
        demoVideoLink: p.demoVideoLink || '',
        projectLinkType: p.projectLinkType || 'Demo Video Link',
      });
      setDepartments(deptRes.data);
    };
    loadData();
  }, [id]);

  useEffect(() => {
    if (formData?.department) {
      API.get(`/subjects/department/${formData.department}`).then((res) => setSubjects(res.data));
    }
  }, [formData?.department]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateURL = (url) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLinkError('');

    if (formData.demoVideoLink && !validateURL(formData.demoVideoLink)) {
      setLinkError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (reportFile) data.append('reportFile', reportFile);
    if (sourceCodeFile) data.append('sourceCodeFile', sourceCodeFile);

    try {
      await API.put(`/projects/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setError('');
      setSuccess('Project updated successfully!');
      setTimeout(() => navigate('/student/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  if (!formData) return <p style={{ padding: 20 }}>Loading...</p>;

  const Label = ({ children, required }) => (
    <label className="form-label-custom">
      {children}
      {required && <span className="required-star">*</span>}
    </label>
  );

  return (
    <div style={{ maxWidth: 800, margin: '30px auto', padding: '0 20px 60px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700, margin: 0 }}>Edit Project</h2>
        <p style={{ color: '#6B7280', marginTop: 4 }}>
          Update your project information and upload a new version if required.
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
              <Form.Select name="subject" value={formData.subject} onChange={handleChange} required>
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
              <Label required>Guide Name</Label>
              <Form.Control name="guide" value={formData.guide} onChange={handleChange} required />
            </Col>
            <Col md={6} style={{ marginBottom: 16 }}>
              <Label required>Academic Year</Label>
              <Form.Control name="academicYear" placeholder="e.g. 2025-2026" value={formData.academicYear} onChange={handleChange} required />
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
              <Label>GitHub Link</Label>
              <Form.Control name="githubLink" placeholder="https://github.com/..." value={formData.githubLink} onChange={handleChange} />
            </Col>
            <Col md={6} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Label>Live Link / Demo Video Link (Optional)</Label>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div 
                  onClick={() => setFormData({ ...formData, projectLinkType: 'Live Project Link', demoVideoLink: '' })}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '8px',
                    borderRadius: '6px',
                    border: `1px solid ${formData.projectLinkType === 'Live Project Link' ? '#2563EB' : '#D1D5DB'}`,
                    backgroundColor: formData.projectLinkType === 'Live Project Link' ? '#EFF6FF' : '#F9FAFB',
                    color: formData.projectLinkType === 'Live Project Link' ? '#2563EB' : '#4B5563',
                    cursor: 'pointer',
                    fontWeight: formData.projectLinkType === 'Live Project Link' ? 600 : 400,
                    transition: 'all 0.2s ease'
                  }}
                >
                  Live Project Link
                </div>
                <div 
                  onClick={() => setFormData({ ...formData, projectLinkType: 'Demo Video Link', demoVideoLink: '' })}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '8px',
                    borderRadius: '6px',
                    border: `1px solid ${formData.projectLinkType === 'Demo Video Link' ? '#2563EB' : '#D1D5DB'}`,
                    backgroundColor: formData.projectLinkType === 'Demo Video Link' ? '#EFF6FF' : '#F9FAFB',
                    color: formData.projectLinkType === 'Demo Video Link' ? '#2563EB' : '#4B5563',
                    cursor: 'pointer',
                    fontWeight: formData.projectLinkType === 'Demo Video Link' ? 600 : 400,
                    transition: 'all 0.2s ease'
                  }}
                >
                  Demo Video Link
                </div>
              </div>
              <Form.Control 
                name="demoVideoLink" 
                placeholder={formData.projectLinkType === 'Live Project Link' ? 'https://your-live-project.com' : 'https://youtube.com/...'}
                value={formData.demoVideoLink} 
                onChange={handleChange} 
                isInvalid={!!linkError}
              />
              <Form.Control.Feedback type="invalid" style={{ display: linkError ? 'block' : 'none' }}>
                {linkError}
              </Form.Control.Feedback>
            </Col>
          </Row>
        </div>

        {/* Files */}
        <div className="form-section">
          <div className="form-section-title"><FaFileUpload color="#2563EB" /> Files</div>
          <Row>
            <Col md={6} style={{ marginBottom: 16 }}>
              <Label>Replace Report (PDF)</Label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Form.Control
                  type="file"
                  ref={reportInputRef}
                  accept="application/pdf"
                  onChange={(e) => setReportFile(e.target.files[0] || null)}
                />
                {reportFile && (
                  <button
                    type="button"
                    onClick={handleRemoveReport}
                    title="Remove selected report file"
                    style={{
                      border: '1px solid #fca5a5',
                      background: '#fee2e2',
                      color: '#dc2626',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ✕ Clear
                  </button>
                )}
              </div>
            </Col>
            <Col md={6} style={{ marginBottom: 4 }}>
              <Label>Replace Source Code (ZIP)</Label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Form.Control
                  type="file"
                  ref={sourceCodeInputRef}
                  accept=".zip"
                  onChange={(e) => setSourceCodeFile(e.target.files[0] || null)}
                />
                {sourceCodeFile && (
                  <button
                    type="button"
                    onClick={handleRemoveSourceCode}
                    title="Remove selected source code file"
                    style={{
                      border: '1px solid #fca5a5',
                      background: '#fee2e2',
                      color: '#dc2626',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ✕ Clear
                  </button>
                )}
              </div>
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

        <button type="submit" className="save-btn">
          <FaSave /> Save Changes
        </button>
      </Form>
    </div>
  );
};

export default EditProject;