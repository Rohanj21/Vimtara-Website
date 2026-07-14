import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Component Imports
import AdminDashboard from '../components/dashboard/AdminDashboard';
import UserDashboard from '../components/dashboard/UserDashboard'; // <-- NEW IMPORT

export default function Dashboard() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  useGSAP(() => {
    if (isAuthenticated) {
      gsap.fromTo(".dash-item", 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      );
    }
  }, { scope: containerRef, dependencies: [isAuthenticated, activeTab] });

  if (!isAuthenticated) return null; 

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    navigate('/');
  };

  const renderSidebarLinks = () => {
    const linkClasses = (tabName) => 
      `w-full text-left px-4 py-3 font-medium transition-all bg-transparent outline-none ${
        activeTab === tabName 
        ? 'text-blue-400 border-l-2 border-blue-400' 
        : 'text-slate-400 hover:text-slate-200'
      }`;

    // Admin Navigation
    if (user?.role === 'ADMIN') {
      return (
        <>
          <button onClick={() => setActiveTab('overview')} className={linkClasses('overview')}>Analytics Overview</button>
          <button onClick={() => setActiveTab('industry')} className={linkClasses('industry')}>Industry Compliance</button>
          <button onClick={() => setActiveTab('team')} className={linkClasses('team')}>Team Management</button>
          <button onClick={() => setActiveTab('comms')} className={linkClasses('comms')}>Communications</button>
        </>
      );
      
    }
    
    // Standard User / Client Navigation
    return (
      <>
        <button onClick={() => setActiveTab('overview')} className={linkClasses('overview')}>Account Overview</button>
        <button onClick={() => setActiveTab('filings')} className={linkClasses('filings')}>Filing Repository</button>
        <button onClick={() => setActiveTab('comms')} className={linkClasses('comms')}>Action Desk</button>
        <button onClick={() => setActiveTab('plan')} className={linkClasses('plan')}>Your Plan</button>
      </>
    );
  };

  // The Traffic Cop dynamically injects the correct role-based component
  const renderDashboardView = () => {
    if (user?.role === 'ADMIN') {
      return <AdminDashboard activeTab={activeTab} />;
    }
    
    if (user?.role === 'USER') {
      return <UserDashboard activeTab={activeTab} />;
    }
    
    return <div className="text-slate-500">Assistant Dashboard loading...</div>;
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* MINIMALIST SIDEBAR */}
      <aside className="w-64 bg-slate-900 p-6 flex flex-col fixed h-full z-40">
        <div className="flex items-center gap-2 mb-10 mt-2">
          <span className="text-blue-500 text-3xl font-black leading-none -mt-1">V</span>
          <span className="uppercase tracking-widest text-lg font-black text-white">imtara</span>
        </div>
        
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 px-4">
          Role: <span className="text-blue-400">{user?.role}</span>
        </div>
        
        <nav className="flex-1 space-y-1">
          {renderSidebarLinks()}
        </nav>

        <button 
          onClick={handleLogout} 
          className="w-full text-left px-4 py-3 font-medium transition-all bg-transparent text-rose-400 hover:text-rose-300 mt-auto"
        >
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-64 p-10 pt-16"> 
        <div className="dash-item mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {user?.role === 'ADMIN' ? 'Account Management' : 'Compliance Hub'}
          </h1>
          <p className="text-slate-500 mt-2">
            {user?.role === 'ADMIN' ? 'Managing compliance network for ' : 'Secure regulatory dashboard for '} 
            <strong className="text-slate-800">{user?.company}</strong>
          </p>
        </div>

        {renderDashboardView()}

      </main>
    </div>
  );
}