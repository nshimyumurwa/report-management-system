import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReport, getDepartments, getUsers, submitReport, uploadFile } from '../services/api';
import Footer from '../components/Footer';

const CreateReport = () => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    report_type: 'weekly',
    department_id: '',
    meeting_id: null,
    file_attachment: null,
  });
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitTo, setSubmitTo] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getDepartments().then((res) => setDepartments(res.data));
    getUsers().then((res) => setUsers(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
    }
  };

  const handleUpload = async () => {
    if (!file) return null;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadFile(formData);
      return res.data.fileUrl;
    } catch (err) {
      setError('File upload failed. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSaveDraft = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let fileUrl = null;
      if (file) fileUrl = await handleUpload();
      await createReport({ ...form, file_attachment: fileUrl });
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to save report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNow = async (e) => {
    e.preventDefault();
    if (!submitTo) {
      setError('Please select a recipient to submit the report.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      let fileUrl = null;
      if (file) fileUrl = await handleUpload();
      const res = await createReport({ ...form, file_attachment: fileUrl });
      await submitReport(res.data.report.id, { submitted_to: submitTo, note: '' });
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="font-bold text-lg">RMS — Ministry of ICT & Innovation</h1>
          <p className="text-blue-200 text-sm">Report Management System</p>
        </div>
        <button onClick={() => navigate('/dashboard')}
          className="bg-white text-blue-800 px-3 py-1 rounded text-sm font-medium hover:bg-blue-100">
          ← Back to Dashboard
        </button>
      </nav>

      <div className="max-w-2xl mx-auto p-6 flex-grow w-full">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Create New Report</h2>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>
          )}

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Title</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Weekly Progress Report - May 2026" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select name="report_type" value={form.report_type} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="meeting">Meeting</option>
                <option value="ad-hoc">Ad-hoc</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select name="department_id" value={form.department_id} onChange={handleChange} required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Select Department --</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Content
                <span className="text-gray-400 font-normal ml-1">(optional if attaching a file)</span>
              </label>
              <textarea name="content" value={form.content} onChange={handleChange} rows={5}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write the report content here or attach a file below..." />
            </div>

            {/* File Attachment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attach Document <span className="text-gray-400 font-normal">(PDF, Word, Excel, Image — max 10MB)</span>
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer bg-gray-100 border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
                  📎 Choose File
                  <input type="file" onChange={handleFileChange} className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" />
                </label>
                {fileName && (
                  <span className="text-sm text-green-600">✅ {fileName}</span>
                )}
              </div>
            </div>

            {/* Submit To */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Submit To <span className="text-gray-400 font-normal">(required only if submitting now)</span>
              </label>
              <select value={submitTo} onChange={(e) => setSubmitTo(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Select Recipient --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.full_name} {u.role ? `— ${u.role}` : ''} {u.department ? `(${u.department})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={handleSaveDraft} disabled={loading || uploading}
                className="bg-gray-600 text-white px-6 py-2 rounded font-medium hover:bg-gray-700">
                {loading ? 'Saving...' : '💾 Save as Draft'}
              </button>
              <button type="button" onClick={handleSubmitNow} disabled={loading || uploading}
                className="bg-blue-800 text-white px-6 py-2 rounded font-medium hover:bg-blue-900">
                {loading ? 'Submitting...' : '📤 Submit Now'}
              </button>
              <button type="button" onClick={() => navigate('/dashboard')}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded font-medium hover:bg-gray-300">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateReport;