import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DesignStudio } from './components/DesignStudio';
import { Footer } from './components/Footer';
import { BackgroundParticles } from './components/BackgroundParticles';
import { FavoritesPage } from './pages/Favorites';
import { LedgerPage } from './pages/Ledger';
import { AuthPage } from './pages/AuthPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useNavigate } from 'react-router-dom';

export default function App() {
  const navigate = useNavigate();

  const handleEnterStudio = () => {
    navigate('/studio');
  };

  useEffect(() => {
    // Keep legacy hash links working after moving the studio into a protected route.
    if (window.location.hash === '#studio') {
      navigate('/studio', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: '#0f0f0f' }}>
      {/* Background texture overlay */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />
      
      <BackgroundParticles />
      <div className="relative z-10">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero onEnterStudio={handleEnterStudio} />
              </>
            }
          />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/studio"
            element={
              <ProtectedRoute>
                <DesignStudio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ledger"
            element={
              <ProtectedRoute>
                <LedgerPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}
