import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import StatutoryCompliance from './pages/StatutoryCompliance';

export default function App() {
  return (
    <Router>
      <Navbar />
      
      {/* The Routes block swaps out the page content based on the URL */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/solutions/statutory-compliance" element={<StatutoryCompliance />} />
      </Routes>
      
      <Footer />
    </Router>
  );
}