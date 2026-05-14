import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getReports } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Dashboard = () => {
  const { user, logoutUser } = useAuth();
  const [reports, setReports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const navigate = useNavigate();

  const isAdmin = user?.access_level >= 3;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await getReports();
        setReports(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  useEffect(() => {
    let result = reports;
    if (search) {
      result = result.filter(r => r.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter);
    }
    if (typeFilter !== 'all') {
      result = result.filter(r => r.report_type === typeFilter);
    }
    if (dateFrom) {
      result = result.filter(r => new Date(r.created_at) >= new Date(dateFrom));
    }
    if (dateTo) {
      result = result.filter(r => new Date(r.created_at) <= new Date(dateTo + 'T23:59:59'));
    }
    setFiltered(result);
  }, [search, statusFilter, typeFilter, dateFrom, dateTo, reports]);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="font-bold text-lg">RMS — Ministry of ICT & Innovation</h1>
          <p className="text-blue-200 text-sm">Report Management System</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">Welcome, {user?.full_name}</span>
          {user?.role_name && (
            <span className="bg-blue-700 text-white px-2 py-1 rounded text-xs">
              {user.role_name}
            </span>
          )}
          {isAdmin && (
            <>
              <button onClick={() => navigate('/users')}
                className="bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-600">
                Manage Users
              </button>
              <button onClick={() => navigate('/delegations')}
                className="bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-600">
                Delegations
              </button>
            </>
          )}
          <button onClick={handleLogout}
            className="bg-white text-blue-800 px-3 py-1 rounded text-sm font-medium hover:bg-blue-100">
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6 flex-grow">
        {!isAdmin && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6 text-sm text-blue-700">
            You are logged in as <strong>{user?.role_name || 'Staff'}</strong> — {user?.department_name || 'No department'}. You can create and submit your own reports.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">{isAdmin ? 'Total Reports' : 'My Reports'}</p>
            <p className="text-3xl font-bold text-blue-800">{reports.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-3xl font-bold text-yellow-500">
              {reports.filter(r => r.status === 'submitted').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Approved</p>
            <p className="text-3xl font-bold text-green-600">
              {reports.filter(r => r.status === 'approved').length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-gray-700">{isAdmin ? 'All Reports' : 'My Reports'}</h2>
            <button onClick={() => navigate('/reports/create')}
              className="bg-blue-800 text-white px-4 py-2 rounded text-sm hover:bg-blue-900">
              + New Report
            </button>
          </div>

          {/* Search & Filter */}
          <div className="px-6 py-3 border-b bg-gray-50 flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Types</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="meeting">Meeting</option>
              <option value="ad-hoc">Ad-hoc</option>
            </select>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">From:</span>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">To:</span>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {(search || statusFilter !== 'all' || typeFilter !== 'all' || dateFrom || dateTo) && (
              <button onClick={() => { setSearch(''); setStatusFilter('all'); setTypeFilter('all'); setDateFrom(''); setDateTo(''); }}
                className="text-sm text-red-500 hover:text-red-700">
                Clear filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading reports...</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No reports found.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left">Title</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Author</th>
                  <th className="px-6 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-blue-700 cursor-pointer hover:underline"
                      onClick={() => navigate(`/reports/${report.id}`)}>
                      {report.title}
                    </td>
                    <td className="px-6 py-3 capitalize">{report.report_type}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'approved' ? 'bg-green-100 text-green-700' :
                        report.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        report.status === 'submitted' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">{report.author}</td>
                    <td className="px-6 py-3">{new Date(report.created_at).toLocaleDateString()}</td>
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

export default Dashboard;