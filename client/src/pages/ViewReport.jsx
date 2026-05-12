import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReportById, submitReport, getUsers, reviewReport } from '../services/api';

const ViewReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [submitTo, setSubmitTo] = useState('');
  const [note, setNote] = useState('');
  const [decision, setDecision] = useState('approved');
  const [comment, setComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const refreshReport = async () => {
    const res = await getReportById(id);
    setReport(res.data);
  };

  useEffect(() => {
    getReportById(id)
      .then((res) => setReport(res.data))
      .catch(() => setError('Report not found.'))
      .finally(() => setLoading(false));
    getUsers().then((res) => setUsers(res.data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await submitReport(id, { submitted_to: submitTo, note });
      setSuccess('Report submitted successfully!');
      setShowSubmitForm(false);
      await refreshReport();
    } catch (err) {
      setError('Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await reviewReport(id, { decision, comment, on_behalf_of: null });
      setSuccess(`Report ${decision} successfully!`);
      setShowReviewForm(false);
      await refreshReport();
    } catch (err) {
      setError('Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor = (status) => {
    if (status === 'approved') return 'bg-green-100 text-green-700';
    if (status === 'rejected') return 'bg-red-100 text-red-700';
    if (status === 'submitted') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-600';
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading report...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="font-bold text-lg">RMS — Ministry of ICT & Innovation</h1>
          <p className="text-blue-200 text-sm">Report Management System</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-white text-blue-800 px-3 py-1 rounded text-sm font-medium hover:bg-blue-100"
        >
          ← Back to Dashboard
        </button>
      </nav>

      <div className="max-w-3xl mx-auto p-6">
        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-3 rounded mb-4 text-sm">{success}</div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm">{error}</div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{report.title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {report.department_name} · {report.report_type} · {new Date(report.created_at).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColor(report.status)}`}>
              {report.status}
            </span>
          </div>
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Report Content</h3>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{report.content}</p>
          </div>
          <div className="border-t pt-4 mt-4 text-sm text-gray-500">
            <p>Author: <span className="text-gray-700 font-medium">{report.author}</span></p>
          </div>
        </div>

        {/* Submit for approval */}
        {report.status === 'draft' && (
          <div className="bg-white rounded-lg shadow p-6 mb-4">
            {!showSubmitForm ? (
              <button
                onClick={() => setShowSubmitForm(true)}
                className="bg-blue-800 text-white px-6 py-2 rounded font-medium hover:bg-blue-900"
              >
                Submit Report for Approval
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-semibold text-gray-700">Submit Report To</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Recipient</label>
                  <select
                    value={submitTo}
                    onChange={(e) => setSubmitTo(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select a person --</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.full_name} {u.role ? `— ${u.role}` : ''} {u.department ? `(${u.department})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    placeholder="Add a note for the reviewer..."
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={submitting}
                    className="bg-blue-800 text-white px-6 py-2 rounded font-medium hover:bg-blue-900">
                    {submitting ? 'Submitting...' : 'Submit'}
                  </button>
                  <button type="button" onClick={() => setShowSubmitForm(false)}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded font-medium hover:bg-gray-300">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Approve / Reject */}
        {report.status === 'submitted' && (
          <div className="bg-white rounded-lg shadow p-6">
            {!showReviewForm ? (
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-green-700 text-white px-6 py-2 rounded font-medium hover:bg-green-800"
              >
                Review This Report
              </button>
            ) : (
              <form onSubmit={handleReview} className="space-y-4">
                <h3 className="font-semibold text-gray-700">Submit Your Review</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Decision</label>
                  <select
                    value={decision}
                    onChange={(e) => setDecision(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="approved">Approve</option>
                    <option value="rejected">Reject</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comment (optional)</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="Add a comment..."
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={submitting}
                    className="bg-green-700 text-white px-6 py-2 rounded font-medium hover:bg-green-800">
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button type="button" onClick={() => setShowReviewForm(false)}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded font-medium hover:bg-gray-300">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewReport;