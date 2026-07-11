import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Shell } from './components';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { NewProduct } from './pages/NewProduct';
import { Review } from './pages/Review';
import { Processing } from './pages/Processing';
import { Demo, SettingsPage } from './pages/Other';
import { Login } from './pages/Login';

export function App() {
  const token = localStorage.getItem('token');
  const location = useLocation();

  // Redirect to login if not authenticated and trying to access app pages
  if (!token && location.pathname !== '/login') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Render Login page outside of the main application Shell
  if (location.pathname === '/login') {
    if (token) {
      return <Navigate to="/dashboard" replace />;
    }
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/new" element={<NewProduct />} />
        <Route path="/products/:id" element={<Review />} />
        <Route path="/products/:id/processing" element={<Processing />} />
        <Route path="/demo" element={import.meta.env.VITE_DEMO_MODE === "true" ? <Demo /> : <Navigate to="/dashboard" replace />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Shell>
  );
}
