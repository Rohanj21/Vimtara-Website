import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Edit2, Trash2, Check, X, ShieldAlert, FileCheck, Building2, Filter, AlertTriangle, ArrowUpRight, Search, FileText, Paperclip, Send, CheckCircle2, Clock, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, Legend } from 'recharts';

export default function AdminDashboard({ activeTab }) {
  const { user } = useSelector((state) => state.auth);
  
  // Provisioning & Directory States
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('USER');
  const [creationMessage, setCreationMessage] = useState('');
  const [directory, setDirectory] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });

  // Analytics States
  const [analyticsData, setAnalyticsData] = useState({ barData: [], pieData: [], totalFilings: 0 });
  const [timeFilter, setTimeFilter] = useState('6m');
  const [isLoading, setIsLoading] = useState(true);

  // Communications State
  const [selectedThreadId, setSelectedThreadId] = useState(1);

  const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#f43f5e'];

  useEffect(() => {
    if (activeTab === 'team') fetchDirectory();
    if (activeTab === 'overview') fetchAnalytics();
  }, [activeTab, timeFilter]);

  const fetchDirectory = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users');
      if (res.ok) setDirectory(await res.json());
    } catch (error) { console.error(error); }
  };

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/analytics?filter=${timeFilter}`);
      if (res.ok) setAnalyticsData(await res.json());
    } catch (error) { console.error(error); } 
    finally { setIsLoading(false); }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreationMessage('Creating...');
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, password: newPassword, name: newName, companyName: user.company, role: newRole })
      });
      if (response.ok) {
        setCreationMessage('Account Provisioned!');
        setNewEmail(''); setNewPassword(''); setNewName('');
        fetchDirectory();
        setTimeout(() => setCreationMessage(''), 3000);
      } else {
        const data = await response.json();
        setCreationMessage(data.error || 'Failed to create user.');
      }
    } catch (error) { setCreationMessage('Server error.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this account?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) fetchDirectory();
    } catch (error) { console.error('Failed to delete', error); }
  };

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (res.ok) { setEditingId(null); fetchDirectory(); }
    } catch (error) { console.error('Failed to update', error); }
  };

  const startEditing = (member) => {
    setEditingId(member.id);
    setEditForm({ name: member.name, email: member.email, role: member.role });
  };


  // --- 1. ANALYTICS OVERVIEW ---
  if (activeTab === 'overview') {
    return (
      <div className="dash-item space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-end">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 pr-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Total Filings Processed</div>
              <div className="text-4xl font-black text-slate-900 mb-2">{analyticsData.totalFilings}</div>
              <div className="text-sm font-semibold text-blue-600">Based on Postgres Data</div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Pending Actions</div>
              <div className="text-4xl font-black text-slate-900 mb-2">
                {analyticsData.pieData.find(d => d.name === 'ACTION REQUIRED')?.value || 0}
              </div>
              <div className="text-sm font-semibold text-rose-500">Requires attention</div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Avg. Compliance Score</div>
              <div className="text-4xl font-black text-slate-900 mb-2">94/100</div>
              <div className="text-sm font-semibold text-emerald-500">Optimal</div>
            </div>
          </div>
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 h-fit">
            <Filter size={16} className="text-slate-400 ml-2" />
            <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="bg-transparent text-sm font-bold text-slate-700 p-2 focus:outline-none cursor-pointer">
              <option value="3m">Trailing 3 Months</option>
              <option value="6m">Trailing 6 Months</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm min-h-[400px]">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8">Statutory Filing Volume</div>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center text-slate-400">Syncing database...</div>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.barData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="volume" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm min-h-[400px] flex flex-col">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Filing Status Distribution</div>
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center text-slate-400">Syncing database...</div>
            ) : (
              <>
                <div className="flex-1 min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={analyticsData.pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {analyticsData.pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-3">
                  {analyticsData.pieData.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: PIE_COLORS[index % PIE_COLORS.length]}}></div>
                        <span className="font-semibold text-slate-700">{entry.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- 2. INDUSTRY COMPLIANCE MODULE ---
  if (activeTab === 'industry') {
    const complianceTrendData = [
      { month: 'Jan', score: 85 }, { month: 'Feb', score: 88 }, { month: 'Mar', score: 86 },
      { month: 'Apr', score: 92 }, { month: 'May', score: 95 }, { month: 'Jun', score: 94 }
    ];
    const categoryData = [
      { name: 'GST', filed: 120, pending: 5 }, { name: 'MCA', filed: 45, pending: 12 },
      { name: 'EPFO', filed: 80, pending: 2 }, { name: 'Tax', filed: 60, pending: 0 }
    ];

    return (
      <div className="dash-item space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "GST Returns", health: "98%", icon: FileCheck, color: "emerald", risk: "Low Risk" },
            { label: "MCA Annual Filings", health: "82%", icon: Building2, color: "amber", risk: "Medium Risk" },
            { label: "Director KYC", health: "100%", icon: ShieldAlert, color: "emerald", risk: "Compliant" },
            { label: "EPFO / Labor Laws", health: "3 Open", icon: AlertTriangle, color: "rose", risk: "Action Required" }
          ].map((item, idx) => (
            <div key={idx} className={`bg-${item.color}-50/50 p-6 rounded-3xl border border-${item.color}-100 flex flex-col justify-between shadow-sm relative overflow-hidden group`}>
              <div className={`absolute -right-6 -top-6 w-24 h-24 bg-${item.color}-100 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500`}></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <item.icon size={24} className={`text-${item.color}-600`} />
                <span className={`text-[10px] font-bold px-2 py-1 rounded bg-${item.color}-100 text-${item.color}-700 uppercase`}>{item.risk}</span>
              </div>
              <div className="relative z-10">
                <div className="text-3xl font-black text-slate-900 mb-1">{item.health}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Network Compliance Trend</div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={complianceTrendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} domain={[60, 100]} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Status by Department</div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Bar dataKey="filed" name="Filed" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} barSize={32} />
                  <Bar dataKey="pending" name="Pending" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 3. TEAM MANAGEMENT ---
  if (activeTab === 'team') {
    return (
      <div className="dash-item grid lg:grid-cols-[350px_1fr] gap-8 animate-in fade-in duration-500">
        <div className="bg-transparent p-8 rounded-3xl border border-slate-200 h-fit">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Provision New Account</h2>
          <form className="space-y-4" onSubmit={handleCreateUser}>
            <input type="text" placeholder="Full Name" value={newName} onChange={(e) => setNewName(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500" />
            <input type="email" placeholder="Email Address" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500" />
            <input type="password" placeholder="Temporary Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500" />
            <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500">
              <option value="USER">Client / User</option>
              <option value="ASSISTANT">Statutory Assistant</option>
              <option value="ADMIN">Administrator</option>
            </select>
            <button type="submit" className="w-full py-3 mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg">Create Account</button>
            {creationMessage && (
              <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg text-center">{creationMessage}</div>
            )}
          </form>
        </div>
        
        <div className="p-8 rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Network Directory</h2>
          <p className="text-sm text-slate-500 mb-6">Total Provisioned Accounts: {directory.length}</p>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {directory.map((member) => (
              <div key={member.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between group">
                {editingId === member.id ? (
                  <div className="flex-1 grid grid-cols-3 gap-3 mr-4">
                    <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="bg-white border border-slate-200 text-xs rounded px-2 py-1.5 focus:outline-none focus:border-blue-500" />
                    <input type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="bg-white border border-slate-200 text-xs rounded px-2 py-1.5 focus:outline-none focus:border-blue-500" />
                    <select value={editForm.role} onChange={(e) => setEditForm({...editForm, role: e.target.value})} className="bg-white border border-slate-200 text-xs rounded px-2 py-1.5 focus:outline-none focus:border-blue-500">
                      <option value="USER">USER</option>
                      <option value="ASSISTANT">ASSISTANT</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-sm text-slate-900">{member.name}</div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">{member.role}</span>
                    </div>
                    <div className="text-xs text-slate-500">{member.email}</div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {editingId === member.id ? (
                    <>
                      <button onClick={() => handleUpdate(member.id)} className="p-1.5 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200 transition-colors"><Check size={16} /></button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 bg-slate-200 text-slate-600 rounded hover:bg-slate-300 transition-colors"><X size={16} /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditing(member)} className="p-1.5 bg-white text-slate-400 hover:text-blue-600 border border-slate-200 rounded transition-colors shadow-sm"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(member.id)} className="p-1.5 bg-white text-slate-400 hover:text-rose-600 border border-slate-200 rounded transition-colors shadow-sm" disabled={member.id === user.id}><Trash2 size={16} /></button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- 4. COMMUNICATIONS VIEW (UPGRADED) ---
  if (activeTab === 'comms') {
    // Mock Threads Data
    const mockThreads = [
      { id: 1, title: 'GST GSTR-1 Data Verification', client: 'TechCorp India', assistant: 'Priya S.', status: 'PENDING_ACTION' },
      { id: 2, title: 'Annual ROC Filing (AOC-4)', client: 'Arceus Pvt Ltd', assistant: 'Rahul M.', status: 'VERIFIED' },
      { id: 3, title: 'EPFO Monthly Update', client: 'Vimtara LLP', assistant: 'Priya S.', status: 'FILED' }
    ];

    return (
      <div className="dash-item bg-transparent border border-slate-200 rounded-3xl overflow-hidden flex h-[650px] animate-in fade-in duration-500 shadow-sm">
        
        {/* Sidebar: Thread List */}
        <div className="w-[30%] border-r border-slate-200 bg-slate-50 flex flex-col">
          <div className="p-5 border-b border-slate-200">
            <h2 className="font-bold text-slate-900">Communication Vault</h2>
            <p className="text-xs text-slate-500">Monitor client-assistant workflows.</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-2 mt-2">Active Filings</div>
            {mockThreads.map((thread) => (
              <div 
                key={thread.id} 
                onClick={() => setSelectedThreadId(thread.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedThreadId === thread.id ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-500/50' : 'bg-transparent border-transparent hover:bg-slate-200/50'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold text-sm text-slate-900 truncate pr-2">{thread.title}</div>
                  {thread.status === 'PENDING_ACTION' && <span className="w-2 h-2 rounded-full bg-rose-500 mt-1"></span>}
                </div>
                <div className="text-xs text-slate-500">{thread.client}</div>
                <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                  <Eye size={12} /> Overseeing: {thread.assistant}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Chat Area */}
        <div className="w-[70%] flex flex-col bg-white">
          
          {/* Admin Oversight Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} className="text-amber-400" />
                <h3 className="font-bold text-sm">Admin Oversight Mode</h3>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">You are viewing the {mockThreads.find(t => t.id === selectedThreadId)?.client} workspace in read-only mode.</p>
            </div>
            <div className="px-3 py-1 bg-white/10 rounded-lg text-xs font-medium border border-white/20 flex items-center gap-1">
              <CheckCircle2 size={14} className="text-emerald-400"/> System Synced
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
            
            {/* Message 1: Client Upload */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 mb-1">TechCorp India (Client) • 10:00 AM</span>
              <div className="bg-blue-600 text-white px-5 py-3.5 rounded-2xl rounded-tr-none text-sm max-w-[80%] shadow-md">
                Hi Priya, I have attached the sales register for Q2. We are ready to proceed with the GSTR-1 filing. Please verify.
              </div>
            </div>

            {/* Document Card (Client) */}
            <div className="flex flex-col items-end">
              <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tr-none shadow-sm max-w-[80%] w-80">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Sales_Register_Q2.xlsx</div>
                    <div className="text-xs text-slate-500">2.4 MB • Uploaded via Vault</div>
                  </div>
                </div>
                <button disabled className="w-full py-2 bg-slate-50 text-slate-400 text-xs font-bold rounded-lg border border-slate-200 cursor-not-allowed">
                  Client Uploaded
                </button>
              </div>
            </div>

            {/* Message 2: Assistant Response */}
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-bold text-slate-400 mb-1">Priya S. (Assistant) • 11:30 AM</span>
              <div className="bg-white border border-slate-200 text-slate-800 px-5 py-3.5 rounded-2xl rounded-tl-none text-sm max-w-[80%] shadow-sm">
                Thank you. I have run the automated reconciliation against our GST portal records. Everything matches perfectly. I am locking the data and generating the final JSON for the government portal now.
              </div>
            </div>

            {/* Action Card (Assistant Verification) */}
            <div className="flex flex-col items-start">
              <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[80%] w-80">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Data Verification Passed</div>
                    <div className="text-xs text-slate-500">Reconciled by Priya S.</div>
                  </div>
                </div>
                {/* Admin sees this as a disabled status indicator, while the Assistant would see this as a clickable button to trigger the filing API */}
                <button disabled className="w-full py-2 bg-slate-900 text-slate-400 text-xs font-bold rounded-lg cursor-not-allowed flex items-center justify-center gap-2">
                  <Clock size={14} /> Awaiting Client Approval to File
                </button>
              </div>
            </div>

          </div>

          {/* Read-Only Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 opacity-70">
              <Paperclip size={20} className="text-slate-400" />
              <input type="text" disabled placeholder="Admin read-only mode..." className="flex-1 bg-transparent text-sm p-2 focus:outline-none cursor-not-allowed" />
              <button disabled className="p-2 bg-slate-200 text-slate-400 rounded-lg cursor-not-allowed">
                <Send size={18} />
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return null;
}