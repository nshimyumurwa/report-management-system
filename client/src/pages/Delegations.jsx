import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../services/api';
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const Delegations = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [delegations, setDelegations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    delegator_id: '',
    delegate_id: '',
    reason: '',
    valid_from: '',
    valid_until: '',
  });

  const fetchDelegations = async () => {
    const res = await API.get('/delegations');
    setDelegations(res.data);
  };

  useEffect(() => {
    Promise.all([getUsers(), API.get('/delegations')])
      .then(([usersRes, delRes]) => {
        setUsers(usersRes.data);
        setDelegations(delRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/delegations', form);
      setSuccess('Delegation created successfully!');
      setShowForm(false);
      setForm({ delegator_id: '', delegate_id: '', reason: '', valid_from: '', valid_until: '' });
      await fetchDelegations();
    } catch (err) {
      setError('Failed to create delegation.');
    }
  };

  const getUserName = (id) => {
    const u = users.find((u) => u.id === id);
    return u ? u.full_name : 'Unknown';
  };

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

      <div className="max-w-5xl mx-auto p-6">
        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-3 rounded mb-4 text-sm">{success}</div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm">{error}</div>
        )}

        {/* Create Delegation Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="font-semibold text-gray-700 mb-4">Create New Delegation</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delegator (Who is delegating)</label>
                <select
                  name="delegator_id"
                  value={form.delegator_id}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select Person --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.full_name} {u.role ? `— ${u.role}` : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delegate (Who will represent)</label>
                <select
                  name="delegate_id"
                  value={form.delegate_id}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select Person --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.full_name} {u.role ? `— ${u.role}` : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
                <input
                  type="datetime-local"
                  name="valid_from"
                  value={form.valid_from}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until (optional)</label>
                <input
                  type="datetime-local"
                  name="valid_until"
                  value={form.valid_until}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g. Minister attending UN summit, PS to represent"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button type="submit"
                  className="bg-blue-800 text-white px-6 py-2 rounded font-medium hover:bg-blue-900">
                  Create Delegation
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded font-medium hover:bg-gray-300">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Delegations Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-gray-700">Active Delegations ({delegations.length})</h2>
            <button
              onClick={() => { setShowForm(true); setSuccess(''); setError(''); }}
              className="bg-blue-800 text-white px-4 py-2 rounded text-sm hover:bg-blue-900"
            >
              + New Delegation
            </button>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading delegations...</div>
          ) : delegations.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No delegations yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left">Delegator</th>
                  <th className="px-6 py-3 text-left">Delegate</th>
                  <th className="px-6 py-3 text-left">Reason</th>
                  <th className="px-6 py-3 text-left">Valid From</th>
                  <th className="px-6 py-3 text-left">Valid Until</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {delegations.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-800">{getUserName(d.delegator_id)}</td>
                    <td className="px-6 py-3 text-blue-700 font-medium">{getUserName(d.delegate_id)}</td>
                    <td className="px-6 py-3 text-gray-500">{d.reason || '—'}</td>
                    <td className="px-6 py-3 text-gray-500">{new Date(d.valid_from).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-gray-500">{d.valid_until ? new Date(d.valid_until).toLocaleDateString() : 'Open-ended'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Delegations;