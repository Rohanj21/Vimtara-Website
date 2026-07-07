import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { LayoutDashboard, FileText, Settings, LogOut, Activity, Users, MessageSquare, PlusCircle } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Dashboard() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Grab auth state and the all-important user ROLE from Redux
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // State to manage which page of the dashboard we are viewing
  const [activeTab, setActiveTab] = useState('command-center');

  // Form State for Admins to create new users
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('USER');
  const [creationMessage, setCreationMessage] = useState('');

  // Security Check
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

  // --- THE "EASY" USER CREATION FUNCTION ---
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreationMessage('Creating...');
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail,
          password: newPassword,
          name: newName,
          companyName: user.company, // Inherit the admin's company
          role: newRole
        })
      });
      if (response.ok) {
        setCreationMessage('User successfully added to database!');
        setNewEmail(''); setNewPassword(''); setNewName('');
        setTimeout(() => setCreationMessage(''), 3000);
      } else {
        const data = await response.json();
        setCreationMessage(data.error || 'Failed to create user.');
      }
    } catch (error) {
      setCreationMessage('Server error. Is the backend running?');
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* --- ROLE-BASED SIDEBAR --- */}
      <aside className="w-64 bg-[#0b1221] text-white p-6 flex flex-col fixed h-full z-40 border-r border-slate-800">
        <div className="flex items-center gap-2 mb-10 mt-2">
          <span className="text-blue-500 text-3xl font-black leading-none -mt-1">V</span>
          <span className="uppercase tracking-widest text-lg font-black">imtara</span>
        </div>
        
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">
          Logged in as: <span className="text-blue-400">{user.role}</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {/* Visible to ADMIN and USER */}
          {(user.role === 'ADMIN' || user.role === 'USER') && (
            <button 
              onClick={() => setActiveTab('command-center')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'command-center' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <LayoutDashboard size={20} /> Command Center
            </button>
          )}

          {/* Visible to ALL Roles */}
          <button 
            onClick={() => setActiveTab('filings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'filings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <FileText size={20} /> Filings & Documents
          </button>

          {/* Visible ONLY to ASSISTANT */}
          {user.role === 'ASSISTANT' && (
            <button 
              onClick={() => setActiveTab('tasks')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'tasks' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <MessageSquare size={20} /> Action Items
            </button>
          )}

          {/* Visible ONLY to ADMIN */}
          {user.role === 'ADMIN' && (
            <button 
              onClick={() => setActiveTab('team')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'team' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Users size={20} /> Team Management
            </button>
          )}
        </nav>

        <button onClick={handleLogout} className="w-full flex items-center gap-3 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-4 py-3 rounded-xl font-medium transition-colors mt-auto">
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* --- DYNAMIC MAIN CONTENT --- */}
      <main className="flex-1 ml-64 p-10 pt-16"> 
        
        <div className="dash-item mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500">Managing compliance for <strong className="text-slate-800">{user.company}</strong></p>
        </div>

        {/* VIEW 1: Command Center (Admin/User) */}
        {activeTab === 'command-center' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[{ title: "Compliance Score", value: "98/100", status: "Optimal", color: "emerald" }, { title: "Active Alerts", value: "0", status: "All clear", color: "blue" }, { title: "Upcoming Deadlines", value: "2", status: "Next 7 days", color: "amber" }].map((metric, idx) => (
                <div key={idx} className="dash-item bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">{metric.title}</div>
                  <div className="text-4xl font-black text-slate-900 mb-2">{metric.value}</div>
                  <div className={`text-sm font-semibold text-${metric.color}-600 bg-${metric.color}-50 inline-block px-3 py-1 rounded-full`}>{metric.status}</div>
                </div>
              ))}
            </div>
            <div className="dash-item bg-white p-8 rounded-3xl border border-slate-200 shadow-sm min-h-[300px] flex flex-col items-center justify-center">
              <Activity size={48} className="text-slate-200 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">System Sync Active</h3>
              <p className="text-slate-500 text-center max-w-sm">Your GST and MCA data is fully synced.</p>
            </div>
          </div>
        )}

        {/* VIEW 2: Filings (All Roles) */}
        {activeTab === 'filings' && (
          <div className="dash-item bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Filing Repository</h2>
            <div className="border border-slate-100 rounded-xl p-8 text-center bg-slate-50">
              <p className="text-slate-500">In a real app, this is where we map through the PostgreSQL `Filing` table.</p>
            </div>
          </div>
        )}

        {/* VIEW 3: Team Management (ADMIN ONLY) */}
        {activeTab === 'team' && user.role === 'ADMIN' && (
          <div className="dash-item grid lg:grid-cols-2 gap-8">
            
            {/* The "Easy" User Creation Form */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><PlusCircle size={20}/></div>
                <h2 className="text-xl font-bold text-slate-900">Invite New Team Member</h2>
              </div>
              
              <form onSubmit={handleCreateUser} className="space-y-4">
                <input 
                  type="text" placeholder="Full Name (e.g. Rahul C.)" required value={newName} onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <input 
                  type="email" placeholder="Email Address" required value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <input 
                  type="password" placeholder="Temporary Password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Assign Role</label>
                  <select 
                    value={newRole} onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                  >
                    <option value="USER">Standard User (View Metrics)</option>
                    <option value="ASSISTANT">Statutory Assistant (Process Filings)</option>
                    <option value="ADMIN">Admin (Full Control)</option>
                  </select>
                </div>

                <button type="submit" className="w-full py-3 mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg">
                  Create User
                </button>
                
                {creationMessage && (
                  <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg text-center">
                    {creationMessage}
                  </div>
                )}
              </form>
            </div>

            <div className="bg-[#0b1221] p-8 rounded-3xl border border-slate-800 shadow-xl text-white">
              <h2 className="text-xl font-bold mb-6">Directory</h2>
              <p className="text-slate-400 text-sm mb-4">Users registered under {user.company}:</p>
              {/* In the future, we will fetch and map all users from PostgreSQL here */}
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold">{user.name}</div>
                  <div className="text-xs text-slate-400">{user.email}</div>
                </div>
                <div className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-1 rounded">ADMIN</div>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}