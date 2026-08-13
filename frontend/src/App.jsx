import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import IssueList from './pages/IssueList';
import Modal from './components/Modal';
import CreateIssueForm from './components/CreateIssueForm';

// Layout component to wrap protected pages with Sidebar & Navbar
const DashboardLayout = ({ setIsCreateModalOpen, refreshTrigger, setRefreshTrigger }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '0 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ display: 'flex', gap: '24px', flex: 1, paddingBottom: '40px' }}>
          <Sidebar onCreateIssueClick={() => setIsCreateModalOpen(true)} />
          <main style={{ flex: 1, minWidth: 0 }}>
            {/* We will map children inside routes but here we render content */}
            <Routes>
              <Route path="/" element={<Dashboard refreshTrigger={refreshTrigger} />} />
              <Route path="/issues" element={<IssueList refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger} />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleIssueCreated = () => {
    setIsCreateModalOpen(false);
    setRefreshTrigger(prev => prev + 1); // Trigger refetches across components
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={
              <DashboardLayout 
                setIsCreateModalOpen={setIsCreateModalOpen} 
                refreshTrigger={refreshTrigger}
                setRefreshTrigger={setRefreshTrigger}
              />
            } />
          </Route>
        </Routes>

        {/* Global Create Issue Modal */}
        <Modal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          title="Create New Issue"
        >
          <CreateIssueForm onCancel={() => setIsCreateModalOpen(false)} onSuccess={handleIssueCreated} />
        </Modal>
      </Router>
    </AuthProvider>
  );
}

export default App;
