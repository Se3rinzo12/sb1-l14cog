import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CreatorDashboard from './pages/CreatorDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatorProfile from './pages/CreatorProfile';
import CompanyProfile from './pages/CompanyProfile';
import ProjectListing from './pages/ProjectListing';
import ProjectDetails from './pages/ProjectDetails';
import CreateProject from './pages/CreateProject';
import EditProfile from './pages/EditProfile';
import Messaging from './pages/Messaging';
import PaymentManagement from './pages/PaymentManagement';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div dir="rtl" className="min-h-screen bg-gray-50 text-right flex flex-col">
            <Header />
            <main className="container mx-auto px-4 py-8 flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/creator-dashboard" element={<ProtectedRoute><CreatorDashboard /></ProtectedRoute>} />
                <Route path="/company-dashboard" element={<ProtectedRoute><CompanyDashboard /></ProtectedRoute>} />
                <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/creator-profile/:id" element={<CreatorProfile />} />
                <Route path="/company-profile/:id" element={<CompanyProfile />} />
                <Route path="/projects" element={<ProjectListing />} />
                <Route path="/project/:id" element={<ProjectDetails />} />
                <Route path="/create-project" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
                <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                <Route path="/messaging" element={<ProtectedRoute><Messaging /></ProtectedRoute>} />
                <Route path="/payments" element={<ProtectedRoute><PaymentManagement /></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
        <ToastContainer position="bottom-left" rtl />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;