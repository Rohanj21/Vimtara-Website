import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ShieldCheck, AlertCircle, FileText, CheckCircle2, Clock, UploadCloud, Paperclip, Send, ArrowRight, Download, Eye, MessageSquarePlus, Zap, Crown, X, CreditCard, Package, Calculator, Check, Tag, Trash2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- CUSTOM MARKDOWN TYPEWRITER COMPONENT ---
const TypewriterMessage = ({ content }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(content.substring(0, i));
      i += 2; // Increased step for smooth markdown typing
      if (i > content.length) {
        setDisplayed(content); // Ensure full text is set at the end
        clearInterval(interval);
      }
    }, 10);
    
    return () => clearInterval(interval);
  }, [content]);

  return (
    <div className="markdown-content text-sm leading-relaxed space-y-2">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h3: ({ node, ...props }) => <h3 className="text-base font-bold text-indigo-200 mt-3 mb-1 border-b border-indigo-700/50 pb-1" {...props} />,
          p: ({ node, ...props }) => <p className="mb-2 text-slate-100" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 my-2 pl-1 text-slate-200" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1.5 my-2 pl-1 text-slate-200" {...props} />,
          li: ({ node, ...props }) => <li className="text-slate-100" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-semibold text-white bg-indigo-950/60 px-1 py-0.5 rounded border border-indigo-800/40" {...props} />,
          a: ({ node, ...props }) => <a className="text-blue-300 underline underline-offset-2 hover:text-blue-100 font-medium transition-colors" target="_blank" rel="noopener noreferrer" {...props} />
        }}
      >
        {displayed}
      </ReactMarkdown>
    </div>
  );
};

export default function UserDashboard({ activeTab }) {
  const { user } = useSelector((state) => state.auth);

  const [tokens, setTokens] = useState(50);
  const [plan, setPlan] = useState('BASIC');
  const maxTokens = plan === 'PREMIUM_PLUS' ? 200 : plan === 'PREMIUM' ? 100 : 50;
  const [customTokenAmount, setCustomTokenAmount] = useState(50);
  const TOKEN_PRICE_INR = 15; 

  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [attachmentTag, setAttachmentTag] = useState('General Document'); 
  
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [newChatService, setNewChatService] = useState('GST');
  const [newChatMode, setNewChatMode] = useState('AI'); 
  
  // NEW: State for AI processing indicator
  const [isAIThinking, setIsAIThinking] = useState(false);

  const fileInputRef = useRef(null);
  const chatBottomRef = useRef(null);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!user?.id) return;
    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${user.id}/tokens`);
        if (res.ok) {
          const data = await res.json();
          setTokens(data.dailyTokens);
          setPlan(data.plan);
        }
      } catch (error) { console.error("Failed to fetch tokens:", error); }
    };
    const fetchThreads = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/threads/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setThreads(data);
          if (data.length > 0 && !activeThreadId) setActiveThreadId(data[0].id);
        }
      } catch (error) { console.error("Failed to fetch threads:", error); }
    };
    fetchUserData();
    if (activeTab === 'comms') fetchThreads();
  }, [activeTab, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [threads, activeThreadId, isAIThinking]);

  const handleCreateThread = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: newChatTitle, 
          service: newChatService, 
          userId: user.id,
          mode: newChatMode 
        })
      });
      if (res.ok) {
        const newThread = await res.json();
        setThreads([newThread, ...threads]);
        setActiveThreadId(newThread.id);
        setIsNewChatOpen(false);
        setNewChatTitle('');
        setNewChatMode('AI'); 
      }
    } catch (error) { console.error("Failed to create thread:", error); }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() && !attachment) return;
    const cost = attachment ? 5 : 1;
    
    if (tokens < cost) {
      alert(`Insufficient tokens! This requires ${cost} tokens.`);
      return;
    }

    const currentInput = messageInput;
    const currentAttachment = attachment;
    const currentTag = attachmentTag;
    
    const activeThread = threads.find(t => t.id === activeThreadId);

    // Reset input fields instantly
    setMessageInput(''); 
    setAttachment(null);
    setAttachmentTag('General Document');

    // Trigger AI thinking state if in AI mode
    if (activeThread?.mode === 'AI') {
      setIsAIThinking(true);
    }

    // Create optimistic local message object
    const tempUserMsg = {
      id: 'temp-' + Date.now(),
      senderId: user.id,
      content: currentInput,
      hasAttachment: !!currentAttachment,
      attachmentName: currentAttachment ? currentAttachment.name : null,
      attachmentSize: currentAttachment ? currentAttachment.size : null,
      attachmentData: currentAttachment ? currentAttachment.data : null,
      attachmentTag: currentAttachment ? currentTag : null,
      createdAt: new Date().toISOString()
    };

    // INSTANT OPTIMISTIC UPDATE
    setThreads(prevThreads => prevThreads.map(t => {
      if (t.id === activeThreadId) {
        return { ...t, messages: [...(t.messages || []), tempUserMsg] };
      }
      return t;
    }));

    try {
      const res = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threadId: activeThreadId,
          senderId: user.id,
          content: currentInput,
          hasAttachment: !!currentAttachment,
          attachmentName: currentAttachment ? currentAttachment.name : null,
          attachmentSize: currentAttachment ? currentAttachment.size : null,
          attachmentData: currentAttachment ? currentAttachment.data : null,
          attachmentTag: currentAttachment ? currentTag : null, 
          tokenCost: cost
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        // Reconcile optimistic message with database object & AI reply
        setThreads(prevThreads => prevThreads.map(t => {
          if (t.id === activeThreadId) {
            const cleanMsgs = t.messages.filter(m => m.id !== tempUserMsg.id);
            if (data.aiReply) {
              // Flag the new AI reply so it triggers the typewriter effect
              data.aiReply.isNewTyping = true;
              return { ...t, messages: [...cleanMsgs, data.message, data.aiReply] };
            }
            return { ...t, messages: [...cleanMsgs, data.message] };
          }
          return t;
        }));

        setTokens(data.tokensLeft);
      }
    } catch (error) { 
      console.error("Message send error:", error); 
    } finally {
      // Always turn off the thinking indicator, even if the backend failed
      setIsAIThinking(false);
    }
  };

  const handleDeleteThread = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this conversation?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/threads/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const remainingThreads = threads.filter(t => t.id !== id);
        setThreads(remainingThreads);
        if (activeThreadId === id) {
          setActiveThreadId(remainingThreads.length > 0 ? remainingThreads[0].id : null);
        }
      }
    } catch (error) { console.error("Failed to delete thread:", error); }
  };

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

  const handleDownload = (fileName, base64Data) => {
    if (!base64Data) return alert("File data not available.");
    const a = document.createElement('a');
    a.href = base64Data;
    a.download = fileName;
    a.click();
  };

  if (activeTab === 'overview') {
    const complianceTrend = [{ month: 'Jan', score: 92 }, { month: 'Feb', score: 95 }, { month: 'Mar', score: 94 }, { month: 'Apr', score: 98 }, { month: 'May', score: 98 }, { month: 'Jun', score: 100 }];
    return (
      <div className="dash-item space-y-8 animate-in fade-in duration-500">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-lg shadow-blue-600/20 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Your compliance is on track, {user?.name?.split(' ')[0]}.</h2>
            <p className="text-blue-100 max-w-lg">All statutory filings for {user?.company} are up to date. You have 1 upcoming deadline next week.</p>
          </div>
          <div className="relative z-10 hidden md:block">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4 flex items-center gap-4">
              <ShieldCheck size={40} className="text-emerald-300" />
              <div>
                <div className="text-xs font-bold text-blue-100 uppercase tracking-widest">Compliance Score</div>
                <div className="text-3xl font-black">100/100</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 w-2 h-full bg-rose-500"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center"><AlertCircle size={20}/></div>
              <span className="text-[10px] font-bold px-2 py-1 bg-rose-50 text-rose-600 rounded uppercase">Action Needed</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">GSTR-1 Verification</h3>
            <p className="text-sm text-slate-500">Approve the reconciled data to allow filing.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Upcoming Deadlines</div>
            <div className="text-4xl font-black text-slate-900 mb-2">1</div>
            <div className="text-sm font-semibold text-amber-500">Due in 7 Days</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Documents in Vault</div>
            <div className="text-4xl font-black text-slate-900 mb-2">24</div>
            <div className="text-sm font-semibold text-blue-600">Fully Encrypted</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Your Compliance Score Trend</div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={complianceTrend} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorClientScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} domain={[80, 100]} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorClientScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'filings') {
    return (
      <div className="dash-item bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Filing Repository</h2>
            <p className="text-sm text-slate-500 mt-1">Official records and acknowledgments for {user?.company}.</p>
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-100">
              <th className="px-8 py-4 font-bold">Document Title</th>
              <th className="px-8 py-4 font-bold">Department</th>
              <th className="px-8 py-4 font-bold">Filing Date</th>
              <th className="px-8 py-4 font-bold">Status</th>
              <th className="px-8 py-4 text-right font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {[
              { title: "GSTR-3B Return - May", dept: "GST", date: "Jun 20, 2026", status: "FILED", color: "emerald" },
              { title: "Annual Return (AOC-4)", dept: "MCA", date: "Pending", status: "PROCESSING", color: "amber" },
            ].map((row, idx) => (
              <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5 font-bold text-slate-900 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-${row.color}-50 text-${row.color}-600 flex items-center justify-center`}><FileText size={14}/></div>
                  {row.title}
                </td>
                <td className="px-8 py-5 text-slate-600">{row.dept}</td>
                <td className="px-8 py-5 text-slate-500">{row.date}</td>
                <td className="px-8 py-5">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full bg-${row.color}-100 text-${row.color}-700 uppercase flex items-center gap-1 w-fit`}>
                    {row.status === 'FILED' ? <CheckCircle2 size={12}/> : <Clock size={12}/>} {row.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="text-slate-400 hover:text-blue-600 transition-colors" disabled={row.status !== 'FILED'}><Download size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (activeTab === 'comms') {
    const activeThread = threads.find(t => t.id === activeThreadId);
    return (
      <div className="dash-item bg-transparent border border-slate-200 rounded-3xl overflow-hidden flex h-[700px] animate-in fade-in duration-500 shadow-sm relative">
        
        {/* NEW CHAT MODAL */}
        {isNewChatOpen && (
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
              <button onClick={() => setIsNewChatOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={20}/></button>
              <h2 className="text-xl font-bold text-slate-900 mb-6">Start New Service Chat</h2>
              <form onSubmit={handleCreateThread} className="space-y-4">
                
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Assistance Protocol</label>
                  <div className="grid grid-cols-2 gap-4 p-1 bg-slate-100 rounded-xl mb-2">
                    <button 
                      type="button"
                      onClick={() => setNewChatMode('AI')}
                      className={`py-2 text-xs font-black rounded-lg transition-all ${newChatMode === 'AI' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      ⚡ Local AI Core
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNewChatMode('HUMAN')}
                      className={`py-2 text-xs font-black rounded-lg transition-all ${newChatMode === 'HUMAN' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      👤 Human Assistant
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Service Department</label>
                  <select value={newChatService} onChange={(e) => setNewChatService(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500">
                    <option value="GST">GST Services</option>
                    <option value="MCA">MCA / ROC Filings</option>
                    <option value="EPFO">EPFO / Labor Law</option>
                    <option value="TAX">Income Tax</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Subject</label>
                  <input type="text" required placeholder="e.g., Notice regarding GSTR-3B" value={newChatTitle} onChange={(e) => setNewChatTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500" />
                </div>
                <button type="submit" className={`w-full py-3 mt-2 text-white font-bold rounded-xl transition-all shadow-lg ${newChatMode === 'AI' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  Create Action Thread
                </button>
              </form>
            </div>
          </div>
        )}
        
        {/* SIDEBAR */}
        <div className="w-[30%] border-r border-slate-200 bg-white flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-slate-900">Your Action Desk</h2>
                <p className="text-xs text-slate-500 mt-1">Communicate with your assistant.</p>
              </div>
            </div>
            <div className="p-4 border-b border-slate-100">
              <button onClick={() => setIsNewChatOpen(true)} className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
                <MessageSquarePlus size={18} /> New Request
              </button>
            </div>
            <div className="overflow-y-auto p-4 space-y-3 h-[380px]">
              {threads.map((thread) => (
                <div key={thread.id} onClick={() => setActiveThreadId(thread.id)} className={`p-4 rounded-xl border cursor-pointer relative overflow-hidden transition-all ${activeThreadId === thread.id ? 'border-blue-500 bg-blue-50/30 shadow-sm' : 'border-slate-200 hover:border-blue-300'}`}>
                  {activeThreadId === thread.id && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>}
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-bold text-sm text-slate-900 truncate pr-2 flex items-center gap-1">
                      {thread.mode === 'AI' && <span className="text-indigo-600">⚡</span>}
                      {thread.title}
                    </div>
                    <span className="text-[9px] font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">{thread.service}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 bg-slate-900 text-white m-4 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
             <div className="flex justify-between items-center mb-3 relative z-10">
               <div className="flex items-center gap-2">
                 <Crown size={16} className="text-amber-400" />
                 <span className="text-xs font-bold uppercase tracking-widest">{plan} PLAN</span>
               </div>
               <span className="text-xs text-slate-400">{tokens} / {maxTokens}</span>
             </div>
             <div className="w-full bg-slate-800 rounded-full h-1.5 mb-4 relative z-10">
               <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(tokens / maxTokens) * 100}%` }}></div>
             </div>
          </div>
        </div>
        
        {/* MAIN CHAT AREA */}
        {activeThread ? (
          <div className="w-[70%] flex flex-col bg-slate-50 relative">
            <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${activeThread.mode === 'AI' ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-100 text-blue-600'}`}>
                  {activeThread.mode === 'AI' ? 'AI' : 'PS'}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {activeThread.mode === 'AI' ? 'Vimtara System AI' : 'Statutory Assistant'}
                  </h3>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                    {activeThread.mode === 'AI' ? 'Processing Engine Ready' : 'Online'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button onClick={() => handleDeleteThread(activeThread.id)} className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                  <Trash2 size={14}/> Delete
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {(activeThread.messages || []).map((msg) => {
                const isMe = msg.senderId === user?.id;
                const isAI = msg.senderId === 'SYSTEM_AI';

                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] font-bold text-slate-400 mb-1">
                      {isMe ? 'You' : isAI ? '⚡ Vimtara AI Core' : '👤 Assigned Assistant'}
                    </span>
                    
                    {msg.content && (
  <div className={`${isMe ? 'bg-blue-600 text-white rounded-tr-none' : isAI ? 'bg-indigo-900 text-white rounded-tl-none border border-indigo-950 shadow-md' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'} px-5 py-3.5 rounded-2xl text-sm max-w-[85%] mb-2 break-words leading-relaxed`}>
    {msg.isNewTyping ? (
      <TypewriterMessage content={msg.content} />
    ) : (
      <div className="markdown-content text-sm leading-relaxed space-y-2">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h3: ({ node, ...props }) => <h3 className="text-base font-bold text-indigo-200 mt-3 mb-1 border-b border-indigo-700/50 pb-1" {...props} />,
            p: ({ node, ...props }) => <p className="mb-2 text-slate-100" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 my-2 pl-1 text-slate-200" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1.5 my-2 pl-1 text-slate-200" {...props} />,
            li: ({ node, ...props }) => <li className="text-slate-100" {...props} />,
            strong: ({ node, ...props }) => <strong className="font-semibold text-white bg-indigo-950/60 px-1 py-0.5 rounded border border-indigo-800/40" {...props} />,
            a: ({ node, ...props }) => <a className="text-blue-300 underline underline-offset-2 hover:text-blue-100 font-medium transition-colors" target="_blank" rel="noopener noreferrer" {...props} />
          }}
        >
          {msg.content}
        </ReactMarkdown>
      </div>
    )}
  </div>
)}
                    
                    {msg.hasAttachment && (
                      <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm max-w-[80%] w-80">
                        {msg.attachmentTag && (
                          <div className="mb-3">
                             <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded uppercase flex items-center gap-1 w-fit">
                               <Tag size={10}/> {msg.attachmentTag}
                             </span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${isMe ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
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
              
              {/* VIMTARA AI "THINKING" INDICATOR */}
              {isAIThinking && (
                <div className="flex flex-col items-start animate-in fade-in duration-300">
                  <span className="text-[10px] font-bold text-slate-400 mb-1">⚡ Vimtara AI Core</span>
                  <div className="bg-indigo-900 text-white px-5 py-3.5 rounded-2xl rounded-tl-none shadow-md flex items-center gap-3 border border-indigo-950">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span className="text-sm font-medium text-indigo-200">Analyzing compliance vectors...</span>
                  </div>
                </div>
              )}
              
              <div ref={chatBottomRef} />
            </div>

            <div className="p-4 bg-white border-t border-slate-200 flex flex-col z-10">
              {attachment && (
                <div className="mb-3 p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-slate-600" />
                      <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]">{attachment.name}</span>
                    </div>
                    <button onClick={() => setAttachment(null)} className="text-slate-400 hover:text-rose-500"><X size={16}/></button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-200 pt-3">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Tag size={14} className="text-slate-400"/>
                      <select 
                        value={attachmentTag} 
                        onChange={(e) => setAttachmentTag(e.target.value)}
                        className="bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500 w-full sm:w-auto"
                      >
                        <option value="General Document">General Document</option>
                        <option value="Invoice / Receipt">Invoice / Receipt</option>
                        <option value="Bank Statement">Bank Statement</option>
                        <option value="Govt. Notice">Govt. Notice</option>
                        <option value="KYC Document">KYC Document</option>
                      </select>
                    </div>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded flex items-center gap-1 shrink-0"><Zap size={10}/> Costs 5 Tokens</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <input type="file" ref={fileInputRef} onChange={handleFileAttach} className="hidden" />
                <button onClick={() => fileInputRef.current.click()} className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50 relative group">
                  <Paperclip size={20} />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max bg-slate-900 text-white text-[10px] px-2 py-1 rounded">Attach Document (5 Tokens)</div>
                </button>
                <input 
                  type="text" 
                  disabled={isAIThinking}
                  placeholder={isAIThinking ? "AI is processing..." : activeThread.mode === 'AI' ? "Ask the AI Engine..." : "Type your message..."}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className={`flex-1 bg-transparent text-sm p-2 focus:outline-none ${isAIThinking ? 'cursor-not-allowed opacity-50' : ''}`} 
                />
                <div className="flex items-center gap-2">
                  {!attachment && messageInput && <span className="text-[10px] font-bold text-slate-400 mr-2 flex items-center gap-1"><Zap size={10}/> 1 Token</span>}
                  <button disabled={isAIThinking} onClick={handleSendMessage} className={`p-2 rounded-lg transition-colors shadow-md ${(!messageInput.trim() && !attachment) || isAIThinking ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : activeThread.mode === 'AI' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-[70%] flex flex-col items-center justify-center bg-slate-50 text-slate-400">
            <MessageSquarePlus size={48} className="mb-4 text-slate-300" />
            <p>Select a thread or start a new request.</p>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'plan') {
    return (
      <div className="dash-item space-y-8 animate-in fade-in duration-500">
        <div className="bg-slate-900 rounded-3xl p-8 text-white flex justify-between items-center relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center border border-blue-500/30">
              <Crown size={32} />
            </div>
            <div>
              <div className="text-sm font-bold text-blue-300 uppercase tracking-widest mb-1">Active Plan</div>
              <h2 className="text-3xl font-black">{plan}</h2>
            </div>
          </div>
          <div className="relative z-10 text-right">
            <div className="text-sm text-slate-400 mb-1">Tokens Available Today</div>
            <div className="text-4xl font-black text-white flex items-center justify-end gap-2">
              <Zap size={28} className="text-amber-400" /> {tokens} <span className="text-xl text-slate-500">/ {maxTokens}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`bg-white p-8 rounded-3xl border ${plan === 'BASIC' ? 'border-blue-500 ring-4 ring-blue-50 shadow-md' : 'border-slate-200 shadow-sm'} relative flex flex-col`}>
            {plan === 'BASIC' && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Current</div>}
            <Package size={32} className="text-slate-700 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Basic Plan</h3>
            <p className="text-sm text-slate-500 mb-6">Essential compliance access.</p>
            <div className="text-3xl font-black text-slate-900 mb-6">₹999<span className="text-sm text-slate-500 font-normal">/mo</span></div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2 text-sm text-slate-600"><Check size={16} className="text-emerald-500"/> 50 Action Tokens / day</li>
              <li className="flex items-center gap-2 text-sm text-slate-600"><Check size={16} className="text-emerald-500"/> Standard Support</li>
            </ul>
            <button disabled={plan === 'BASIC'} onClick={() => setPlan('BASIC')} className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${plan === 'BASIC' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
              {plan === 'BASIC' ? 'Active' : 'Downgrade'}
            </button>
          </div>

          <div className={`bg-white p-8 rounded-3xl border ${plan === 'PREMIUM' ? 'border-blue-500 ring-4 ring-blue-50 shadow-md' : 'border-slate-200 shadow-sm'} relative flex flex-col`}>
            {plan === 'PREMIUM' && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Current</div>}
            <Crown size={32} className="text-blue-500 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Premium Plan</h3>
            <p className="text-sm text-slate-500 mb-6">For growing businesses.</p>
            <div className="text-3xl font-black text-slate-900 mb-6">₹2,499<span className="text-sm text-slate-500 font-normal">/mo</span></div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2 text-sm text-slate-600"><Check size={16} className="text-emerald-500"/> 100 Action Tokens / day</li>
              <li className="flex items-center gap-2 text-sm text-slate-600"><Check size={16} className="text-emerald-500"/> Priority Support</li>
              <li className="flex items-center gap-2 text-sm text-slate-600"><Check size={16} className="text-emerald-500"/> Dedicated Assistant</li>
            </ul>
            <button disabled={plan === 'PREMIUM'} onClick={() => {setPlan('PREMIUM'); setTokens(100);}} className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${plan === 'PREMIUM' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'}`}>
              {plan === 'PREMIUM' ? 'Active' : 'Upgrade to Premium'}
            </button>
          </div>

          <div className={`bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl relative flex flex-col text-white`}>
            {plan === 'PREMIUM_PLUS' && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Current</div>}
            <Zap size={32} className="text-amber-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Premium Plus</h3>
            <p className="text-sm text-slate-400 mb-6">Maximum compliance power.</p>
            <div className="text-3xl font-black text-white mb-6">₹4,999<span className="text-sm text-slate-400 font-normal">/mo</span></div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-amber-400"/> 200 Action Tokens / day</li>
              <li className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-amber-400"/> 24/7 Priority Support</li>
              <li className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-amber-400"/> Legal Advisory Included</li>
            </ul>
            <button disabled={plan === 'PREMIUM_PLUS'} onClick={() => {setPlan('PREMIUM_PLUS'); setTokens(200);}} className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${plan === 'PREMIUM_PLUS' ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-amber-400 text-amber-950 hover:bg-amber-300 shadow-lg shadow-amber-400/20'}`}>
              {plan === 'PREMIUM_PLUS' ? 'Active' : 'Upgrade to Plus'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col lg:flex-row gap-8 items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><Calculator size={20} /></div>
              <h3 className="text-xl font-bold text-slate-900">Out of tokens today?</h3>
            </div>
            <p className="text-sm text-slate-500 max-w-md">Purchase custom, one-time action tokens instantly without changing your base subscription plan.</p>
          </div>

          <div className="flex-1 w-full bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Amount</label>
              <div className="text-sm font-bold text-blue-600">{customTokenAmount} Tokens</div>
            </div>
            <input 
              type="range" min="10" max="500" step="10" 
              value={customTokenAmount} 
              onChange={(e) => setCustomTokenAmount(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex items-center gap-4 mt-2 pt-4 border-t border-slate-200">
              <div className="flex-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Cost (₹{TOKEN_PRICE_INR}/Token)</div>
                <div className="text-2xl font-black text-slate-900">₹{(customTokenAmount * TOKEN_PRICE_INR).toLocaleString('en-IN')}</div>
              </div>
              <button 
                onClick={() => {
                  setTokens(prev => prev + customTokenAmount);
                  alert(`Successfully purchased ${customTokenAmount} tokens for ₹${customTokenAmount * TOKEN_PRICE_INR}!`);
                }}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg transition-all"
              >
                <CreditCard size={18} /> Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}