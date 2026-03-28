import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, LogOut, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { EmergencyRequest } from '../App';

interface DashboardProps {
  requests: EmergencyRequest[];
  userRole: string | null;
  onLogout: () => void;
}

function Dashboard({ requests, userRole, onLogout }: DashboardProps) {
  const getStatusIcon = (status: EmergencyRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in-progress':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: EmergencyRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'in-progress':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const safeRequests = Array.isArray(requests) ? requests : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Emergency Response Center
            </h1>
            <div className="flex items-center gap-6">
              {userRole === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Panel
                </Link>
              )}
              <button
                onClick={onLogout}
                className="flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Emergency Action Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
          <div className="text-center">
            <div className="mb-4">
              <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Emergency Response
              </h2>
              <p className="text-gray-600 mb-6">
                Report emergencies and track response status
              </p>
            </div>
            <Link
              to="/emergency/new"
              className="inline-flex items-center bg-red-600 text-white px-8 py-4 rounded-md font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <Plus className="w-5 h-5 mr-2" />
              Raise Emergency
            </Link>
          </div>
        </div>

        {/* Emergency Requests Table */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Emergency Requests
            </h3>
          </div>
          
          {requests.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No emergency requests found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                      Emergency Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                      Reported
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                      Reported
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {safeRequests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {request.type}
                        </div>
                        {request.description && (
                          <div className="text-sm text-gray-600 mt-1">
                            {request.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {request.location}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-2 capitalize">
                            {request.status.replace('-', ' ')}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatTimestamp(request.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;