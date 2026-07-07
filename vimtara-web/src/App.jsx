import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import StatutoryCompliance from './pages/StatutoryCompliance';
import Dashboard from './pages/Dashboard';

// We create an inner component so we can use the useLocation hook
function AppContent() {
  const location = useLocation();
  
  // Check if the current URL is the dashboard
  const isDashboard = location.pathname === '/dashboard';

  return (
    <>
      {/* Only render Navbar if we are NOT on the dashboard */}
      {!isDashboard && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/solutions/statutory-compliance" element={<StatutoryCompliance />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      
      {/* Only render Footer if we are NOT on the dashboard */}
      {!isDashboard && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}