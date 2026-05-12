import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getReports } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logoutUser } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await getReports();
        setReports(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="font-bold text-lg">RMS — Ministry of ICT & Innovation</h1>
          <p className="text-blue-200 text-sm">Report Management System</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">Welcome, {user?.full_name}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-800 px-3 py-1 rounded text-sm font-medium hover:bg-blue-100"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Total Reports</p>
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

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-gray-700">All Reports</h2>
            <button
              onClick={() => navigate('/reports/create')}
              className="bg-blue-800 text-white px-4 py-2 rounded text-sm hover:bg-blue-900"
            >
              + New Report
            </button>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No reports yet.</div>
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
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                   <td
                      className="px-6 py-3 font-medium text-blue-700 cursor-pointer hover:underline"
                      onClick={() => navigate(`/reports/${report.id}`)}
                      >
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
    </div>
  );
};

export default Dashboard;