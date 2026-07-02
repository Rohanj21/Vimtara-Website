import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Pricing from './pages/Pricing';

export default function App() {
  return (
    <Router>
      <Navbar />
      
      {/* The Routes block swaps out the page content based on the URL */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
      </Routes>
      
      <Footer />
    </Router>
  );
}