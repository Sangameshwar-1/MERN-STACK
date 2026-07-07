import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Onboarding from './pages/auth/Onboarding';

import Dashboard from './pages/participant/Dashboard';
import Profile from './pages/participant/Profile';
import BrowseEvents from './pages/participant/BrowseEvents';
import EventDetails from './pages/participant/EventDetails';
import ClubsDirectory from './pages/participant/ClubsDirectory';
import ViewTicket from './pages/participant/ViewTicket';

import OrgDashboard from './pages/organizer/OrgDashboard';
import OrgProfile from './pages/organizer/OrgProfile';
import OrgEvents from './pages/organizer/OrgEvents';
import ManageEvent from './pages/organizer/ManageEvent';
import Participants from './pages/organizer/Participants';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageOrganizers from './pages/admin/ManageOrganizers';
import PasswordResets from './pages/admin/PasswordResets';
import ChangePassword from './pages/auth/ChangePassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<BrowseEvents />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/participant/events" element={<ProtectedRoute allowedRoles={['participant']}><BrowseEvents /></ProtectedRoute>} />
              <Route path="/participant/events/:id" element={<ProtectedRoute allowedRoles={['participant']}><EventDetails /></ProtectedRoute>} />

              {/* Participant Routes */}
              <Route path="/onboarding" element={<ProtectedRoute allowedRoles={['participant']}><Onboarding /></ProtectedRoute>} />
              <Route path="/participant" element={<ProtectedRoute allowedRoles={['participant']}><Dashboard /></ProtectedRoute>} />
              <Route path="/participant/profile" element={<ProtectedRoute allowedRoles={['participant']}><Profile /></ProtectedRoute>} />
              <Route path="/participant/clubs" element={<ProtectedRoute allowedRoles={['participant']}><ClubsDirectory /></ProtectedRoute>} />
              
              <Route path="/ticket/:ticketId" element={<ProtectedRoute allowedRoles={['participant', 'organizer', 'admin']}><ViewTicket /></ProtectedRoute>} />
              <Route path="/change-password" element={<ProtectedRoute allowedRoles={['participant', 'organizer', 'admin']}><ChangePassword /></ProtectedRoute>} />

              {/* Organizer Routes */}
              <Route path="/organizer" element={<ProtectedRoute allowedRoles={['organizer']}><OrgDashboard /></ProtectedRoute>} />
              <Route path="/organizer/profile" element={<ProtectedRoute allowedRoles={['organizer']}><OrgProfile /></ProtectedRoute>} />
              <Route path="/organizer/events" element={<ProtectedRoute allowedRoles={['organizer']}><OrgEvents /></ProtectedRoute>} />
              <Route path="/organizer/events/:id" element={<ProtectedRoute allowedRoles={['organizer']}><ManageEvent /></ProtectedRoute>} />
              <Route path="/organizer/events/:id/participants" element={<ProtectedRoute allowedRoles={['organizer']}><Participants /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/organizers" element={<ProtectedRoute allowedRoles={['admin']}><ManageOrganizers /></ProtectedRoute>} />
              <Route path="/admin/password-resets" element={<ProtectedRoute allowedRoles={['admin']}><PasswordResets /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
