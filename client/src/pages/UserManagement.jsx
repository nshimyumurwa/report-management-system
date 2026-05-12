import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, getDepartments, getRoles, register } from '../services/api';
import Footer from '../components/Footer';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role_id: '', department_id: '' });

  const fetchUsers = async () => {
    const res = await getUsers();
    setUsers(res.data);
  };

  useEffect(() => {
    Promise.all([getUsers(), getDepartments(), getRoles()])
      .then(([usersRes, deptRes, rolesRes]) => {
        setUsers(usersRes.data);
        setDepartments(deptRes.data);
        setRoles(rolesRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      setSuccess('User created successfully!');
      setShowForm(false);
      setForm({ full_name: '', email: '', password: '', role_id: '', department_id: '' });
      await fetchUsers();
    } catch (err) {
      setError('Failed to create user. Email may already exist.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="font-bold text-lg">RMS — Ministry of ICT & Innovation</h1>
          <p className="text-blue-200 text-sm">Report Management System</p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="bg-white text-blue-800 px-3 py-1 rounded text-sm font-medium hover:bg-blue-100">← Back to Dashboard</button>
      </nav>

      <div className="max-w-5xl mx-auto p-6 flex-grow w-full">
        {success && <div className="bg-green-100 text-green-700 px-4 py-3 rounded mb-4 text-sm">{success}</div>}
        {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm">{error}</div>}

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="font-semibold text-gray-700 mb-4">Create New User</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" name="full_name" value={form.full_name} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. John Mugisha" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. john@minict.gov.rw" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Minimum 8 characters" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select name="role_id" value={form.role_id} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">-- Select Role --</option>
                  {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select name="department_id" value={form.department_id} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">-- Select Department --</option>
                  {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="bg-blue-800 text-white px-6 py-2 rounded font-medium hover:bg-blue-900">Create User</button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded font-medium hover:bg-gray-300">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-gray-700">All Users ({users.length})</h2>
            <button onClick={() => { setShowForm(true); setSuccess(''); setError(''); }} className="bg-blue-800 text-white px-4 py-2 rounded text-sm hover:bg-blue-900">+ Add User</button>
          </div>
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading users...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Role</th>
                  <th className="px-6 py-3 text-left">Department</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-800">{u.full_name}</td>
                    <td className="px-6 py-3 text-gray-500">{u.email}</td>
                    <td className="px-6 py-3"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">{u.role || 'No role'}</span></td>
                    <td className="px-6 py-3 text-gray-600">{u.department || 'No department'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserManagement;