import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { AlertCircle, FileText, CheckCircle2, Paperclip, Send, ArrowRight, Eye, MessageSquare, Briefcase, X, Building2, Check, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

export default function AssistantDashboard({ activeTab }) {
  const { user } = useSelector((state) => state.auth);

  const [threads, setThreads] = useState([]);
  const [clients, setClients] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef(null);

  const [chatFilter, setChatFilter] = useState('ALL'); 
  const PIE_COLORS = ['#3b82f6', '#f59e0b', '#10b981'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/assistant/dashboard');
        if (res.ok) {
          const data = await res.json();
          setThreads(data.threads);
          setClients(data.clients);
          if (data.threads.length > 0 && !activeThreadId) {
            setActiveThreadId(data.threads[0].id);
          }
        }
      } catch (error) { console.error("Failed to fetch data", error); }
    };
    fetchDashboardData();
  }, [activeTab]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() && !attachment) return;

    try {
      const res = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threadId: activeThreadId,
          senderId: user.id,
          content: messageInput,
          hasAttachment: !!attachment,
          attachmentName: attachment ? attachment.name : null,
          attachmentSize: attachment ? attachment.size : null,
          attachmentData: attachment ? attachment.data : null,
          tokenCost: 0 
        })
      });

      if (res.ok) {
        const data = await res.json();
        const updatedThreads = threads.map(t => {
          if (t.id === activeThreadId) return { ...t, messages: [...t.messages, data.message] };
          return t;
        });
        setThreads(updatedThreads);
        setMessageInput('');
        setAttachment(null);
      }
    } catch (error) { console.error("Send error:", error); }
  };

  // Convert File to Base64 String
  const handleFileAttach = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File too large. Maximum size is 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setAttachment({
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          data: reader.result
        });
      };
    }
  };

  // Trigger File Download
  const handleDownload = (fileName, base64Data) => {
    if (!base64Data) return alert("File data not available.");
    const a = document.createElement('a');
    a.href = base64Data;
    a.download = fileName;
    a.click();
  };

  if (activeTab === 'overview') {
    const workloadData = [{ day: 'Mon', gst: 12, mca: 5, epfo: 2 }, { day: 'Tue', gst: 19, mca: 3, epfo: 4 }, { day: 'Wed', gst: 15, mca: 8, epfo: 1 }, { day: 'Thu', gst: 22, mca: 12, epfo: 6 }, { day: 'Fri', gst: 10, mca: 4, epfo: 8 }];
    const taskStatus = [{ name: 'Pending', value: 45 }, { name: 'In Review', value: 20 }, { name: 'Completed', value: 85 }];

    return (
      <div className="dash-item space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Briefcase size={28}/></div>
            <div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Active Clients</div>
              <div className="text-3xl font-black text-slate-900">{clients.length}</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm flex items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-amber-400"></div>
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center"><AlertCircle size={28}/></div>
            <div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Pending Actions</div>
              <div className="text-3xl font-black text-slate-900">14</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><CheckCircle2 size={28}/></div>
            <div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Filings Completed</div>
              <div className="text-3xl font-black text-slate-900">85</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Weekly Workload by Service</div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workloadData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="gst" name="GST" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} barSize={32} />
                  <Bar dataKey="mca" name="MCA" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="epfo" name="EPFO" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Task Distribution</div>
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={taskStatus} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {taskStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {taskStatus.map((entry, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: PIE_COLORS[index % PIE_COLORS.length]}}></div>
                    <span className="font-semibold text-slate-700">{entry.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'clients') {
    return (
      <div className="dash-item bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Client Roster</h2>
            <p className="text-sm text-slate-500 mt-1">Manage compliance status for assigned portfolios.</p>
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-100">
              <th className="px-8 py-4 font-bold">Company Name</th>
              <th className="px-8 py-4 font-bold">Contact Person</th>
              <th className="px-8 py-4 font-bold">Subscription</th>
              <th className="px-8 py-4 text-right font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {clients.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-8 text-slate-400">No clients assigned yet.</td></tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Building2 size={14}/></div>
                    {client.companyName || 'Unknown Entity'}
                  </td>
                  <td className="px-8 py-5 text-slate-600">{client.name}</td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 uppercase">{client.plan}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-blue-600 font-bold hover:text-blue-800 transition-colors flex items-center justify-end gap-1 w-full">
                      View Profile <ArrowRight size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }

  if (activeTab === 'comms') {
    const filteredThreads = chatFilter === 'ALL' ? threads : threads.filter(t => t.service === chatFilter);
    const activeThread = threads.find(t => t.id === activeThreadId);

    return (
      <div className="dash-item bg-transparent border border-slate-200 rounded-3xl overflow-hidden flex h-[700px] animate-in fade-in duration-500 shadow-sm relative">
        <div className="w-[35%] border-r border-slate-200 bg-white flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-slate-900">Client Communications</h2>
            <p className="text-xs text-slate-500 mt-1">Manage inbound requests and filings.</p>
          </div>
          <div className="px-4 pt-4 pb-2 border-b border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
            {['ALL', 'GST', 'MCA', 'EPFO', 'TAX'].map(filter => (
              <button key={filter} onClick={() => setChatFilter(filter)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${chatFilter === filter ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                {filter}
              </button>
            ))}
          </div>
          <div className="overflow-y-auto p-4 space-y-3 flex-1 bg-slate-50/30">
            {filteredThreads.length === 0 ? (
               <div className="text-center text-slate-400 text-xs mt-10">No threads found for {chatFilter}.</div>
            ) : (
              filteredThreads.map((thread) => (
                <div key={thread.id} onClick={() => setActiveThreadId(thread.id)} className={`p-4 rounded-xl border cursor-pointer relative overflow-hidden transition-all ${activeThreadId === thread.id ? 'border-blue-500 bg-white shadow-md' : 'border-slate-200 bg-white hover:border-blue-300'}`}>
                  {activeThreadId === thread.id && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>}
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-bold text-sm text-slate-900 truncate pr-2">{thread.title}</div>
                    <span className="w-2 h-2 rounded-full bg-rose-500 mt-1"></span>
                  </div>
                  <div className="text-xs text-slate-500 mb-2">{thread.user?.companyName}</div>
                  <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">{thread.service}</span>
                </div>
              ))
            )}
          </div>
        </div>
        
        {activeThread ? (
          <div className="w-[65%] flex flex-col bg-slate-50">
            <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{activeThread.user?.companyName || 'Client'}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeThread.user?.name}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                  <Check size={14}/> Mark Resolved
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {activeThread.messages.map((msg) => {
                const isAssistant = msg.senderId === user.id;
                return (
                  <div key={msg.id} className={`flex flex-col ${isAssistant ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] font-bold text-slate-400 mb-1">{isAssistant ? 'You' : 'Client'}</span>
                    {msg.content && (
                      <div className={`${isAssistant ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'} px-5 py-3.5 rounded-2xl text-sm max-w-[80%] mb-2 break-words`}>
                        {msg.content}
                      </div>
                    )}
                    
                    {/* UPDATE: Interactive File Download Card */}
                    {msg.hasAttachment && (
                      <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm max-w-[80%] w-80">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${isAssistant ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            <FileText size={20} />
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-sm font-bold text-slate-900 truncate w-48">{msg.attachmentName}</div>
                            <div className="text-xs text-slate-500">{msg.attachmentSize}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 border-t border-slate-100 pt-2.5">
                          <button onClick={() => handleDownload(msg.attachmentName, msg.attachmentData)} className="flex-1 py-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                            <Eye size={14}/> View
                          </button>
                          <button onClick={() => handleDownload(msg.attachmentName, msg.attachmentData)} className="flex-1 py-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                            <Download size={14}/> Download
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-white border-t border-slate-200">
              {attachment && (
                <div className="mb-3 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-slate-600" />
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]">{attachment.name}</span>
                  </div>
                  <button onClick={() => setAttachment(null)} className="text-slate-400 hover:text-rose-500"><X size={14}/></button>
                </div>
              )}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100 transition-all">
                <input type="file" ref={fileInputRef} onChange={handleFileAttach} className="hidden" />
                <button onClick={() => fileInputRef.current.click()} className="p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-200">
                  <Paperclip size={20} />
                </button>
                <input 
                  type="text" 
                  placeholder="Reply to client..." 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-transparent text-sm p-2 focus:outline-none" 
                />
                <button onClick={handleSendMessage} className={`p-2 rounded-lg transition-colors shadow-md ${!messageInput.trim() && !attachment ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-[65%] flex flex-col items-center justify-center bg-slate-50 text-slate-400">
            <MessageSquare size={48} className="mb-4 text-slate-300" />
            <p>Select a thread to respond.</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}