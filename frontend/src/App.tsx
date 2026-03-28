import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import EmergencyForm from './components/EmergencyForm';
import AdminDashboard from './components/AdminDashboard';

export interface EmergencyRequest {
  _id: string;
  type: string;
  location: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  timestamp: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
      fetchRequests();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setEmergencyRequests([]);
        setIsAuthenticated(false);
        setUserRole(null);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/emergencies/list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          setIsAuthenticated(false);
          setUserRole(null);
        }

        console.error('Error fetching requests:', response.status, errorData || response.statusText);
        setEmergencyRequests([]);
        return;
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        console.warn('Unexpected emergency list format, defaulting to empty array', data);
        setEmergencyRequests([]);
      } else {
        setEmergencyRequests(data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      setEmergencyRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);
        setIsAuthenticated(true);
        setUserRole(data.user.role);
        fetchRequests();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  const addEmergencyRequest = async (request: Omit<EmergencyRequest, '_id' | 'timestamp' | 'status'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/emergencies/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      });
      if (response.ok) {
        fetchRequests();
      }
    } catch (error) {
      console.error('Error adding request:', error);
    }
  };

  const handleStatusUpdate = async (id: string, status: EmergencyRequest['status']) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/emergencies/update/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        fetchRequests();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <LoginPage onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <RegisterPage />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
              <Dashboard 
                requests={emergencyRequests}
                userRole={userRole}
                onLogout={handleLogout}
              /> : 
              <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/emergency/new" 
            element={
              isAuthenticated ? 
              <EmergencyForm onSubmit={addEmergencyRequest} /> : 
              <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/admin" 
            element={
              isAuthenticated ? 
              (userRole === 'admin' ? 
                <AdminDashboard 
                  requests={emergencyRequests}
                  onStatusUpdate={handleStatusUpdate}
                /> : 
                <div className="min-h-screen flex items-center justify-center">
                  <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                    <h1 className="text-2xl font-bold mb-2">Admin access required</h1>
                    <p className="text-gray-600 mb-4">You are signed in, but not as admin. Please sign in with an admin account.</p>
                    <Link to="/dashboard" className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Return to Dashboard</Link>
                  </div>
                </div>
              ) : 
              <Navigate to="/login" replace />
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;