import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, MessageSquare, Upload, Users, Activity,
  Send, Bot, User, RefreshCw, AlertTriangle, TrendingUp, 
  TrendingDown, FileText, FlaskConical, ChevronLeft, Menu,
  Check, X, Plus, Save, Loader2, LogOut
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

// Import Auth and Landing components
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import AuthPages from './components/AuthPages';

// API Base URL - uses environment variable for production, localhost for development
const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Get auth token helper
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Format message with markdown-like rendering
function FormattedMessage({ text }) {
  // Parse markdown tables
  const renderContent = (content) => {
    const lines = content.split('\n');
    const elements = [];
    let i = 0;
    
    while (i < lines.length) {
      const line = lines[i];
      
      // Check if this is a table (line with | characters)
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const tableLines = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          tableLines.push(lines[i]);
          i++;
        }
        
        if (tableLines.length >= 2) {
          const headers = tableLines[0].split('|').map(h => h.trim()).filter(h => h);
          const rows = tableLines.slice(2).map(row => 
            row.split('|').map(cell => cell.trim()).filter(cell => cell)
          );
          
          elements.push(
            <div key={elements.length} className="my-3 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-600">
                    {headers.map((header, idx) => (
                      <th key={idx} className="px-3 py-2 text-left font-semibold text-slate-300">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="border-b border-slate-700/50">
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="px-3 py-2 text-slate-200">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        continue;
      }
      
      // Regular line - format bold text
      if (line.trim()) {
        const formatted = line
          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
        
        elements.push(
          <p key={elements.length} className="mb-2" dangerouslySetInnerHTML={{ __html: formatted }} />
        );
      } else {
        elements.push(<br key={elements.length} />);
      }
      i++;
    }
    
    return elements;
  };
  
  return <div className="prose prose-invert max-w-none">{renderContent(text)}</div>;
}

// API Functions
const api = {
  async query(text) {
    console.log('[Frontend] Sending query:', text);
    console.log('[Frontend] API URL:', `${API_BASE}/query`);
    const res = await fetch(`${API_BASE}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: text })
    });
    console.log('[Frontend] Query response status:', res.status);
    const data = await res.json();
    console.log('[Frontend] Query response data:', data);
    return data;
  },
  async getStats() {
    console.log('[Frontend] Fetching stats from:', `${API_BASE}/stats`);
    const res = await fetch(`${API_BASE}/stats`);
    console.log('[Frontend] Stats response status:', res.status);
    const data = await res.json();
    console.log('[Frontend] Stats data:', data);
    return data;
  },
  async getRecentAbnormal() {
    const res = await fetch(`${API_BASE}/recent-abnormal?limit=8`);
    return res.json();
  },
  async getPatients() {
    const res = await fetch(`${API_BASE}/patients`);
    return res.json();
  },
  async getPatientHistory(patientName) {
    const res = await fetch(`${API_BASE}/patient/${encodeURIComponent(patientName)}/history`);
    return res.json();
  },
  async getTestTypes() {
    const res = await fetch(`${API_BASE}/tests/types`);
    return res.json();
  },
  async getReportTypes() {
    const res = await fetch(`${API_BASE}/reports/types`);
    return res.json();
  },
  async listPatients(filters = {}) {
    const params = new URLSearchParams();
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.has_abnormal !== undefined) params.append('has_abnormal', filters.has_abnormal);
    if (filters.test_type) params.append('test_type', filters.test_type);
    if (filters.report_type) params.append('report_type', filters.report_type);
    const url = `${API_BASE}/patients/list${params.toString() ? '?' + params.toString() : ''}`;
    const res = await fetch(url);
    return res.json();
  },
  async checkHealth() {
    try {
      console.log('[Frontend] Checking health at: /health');
      const res = await fetch('/health');
      console.log('[Frontend] Health check status:', res.status, res.ok);
      return res.ok;
    } catch (error) {
      console.error('[Frontend] Health check failed:', error);
      return false;
    }
  }
};

// Sidebar Component
function Sidebar({ active, setActive, collapsed, setCollapsed }) {
  const [online, setOnline] = useState(false);
  const { user, logout } = useAuth();
  
  useEffect(() => {
    api.checkHealth().then(setOnline);
    const interval = setInterval(() => api.checkHealth().then(setOnline), 30000);
    return () => clearInterval(interval);
  }, []);

  const items = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'chat', icon: MessageSquare, label: 'Query Chat' },
    { id: 'upload', icon: Upload, label: 'Upload' },
    { id: 'patients', icon: Users, label: 'Patients' },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-screen glass flex flex-col transition-all duration-300 z-50 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-5 border-b border-slate-700/50 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">MediSaarthi</h1>
              <p className="text-xs text-slate-400">Bridging Medical Gaps</p>
            </div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="p-2 hover:bg-slate-700/50 rounded-lg">
          {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              active === item.id 
                ? 'bg-gradient-to-r from-purple-600 to-purple-600 text-white shadow-lg' 
                : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* User Info */}
      {user && (
        <div className="p-4 border-t border-slate-700/50">
          <div className={`flex items-center gap-3 px-3 py-2 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.full_name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className={`w-full mt-2 flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      )}

      <div className="p-4 border-t border-slate-700/50">
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 ${collapsed && 'justify-center'}`}>
          <div className={`w-3 h-3 rounded-full pulse-dot ${online ? 'bg-blue-500' : 'bg-red-500'}`} />
          {!collapsed && <span className="text-sm text-slate-400">{online ? 'API Online' : 'API Offline'}</span>}
        </div>
      </div>
    </aside>
  );
}

// Stat Card
function StatCard({ icon: Icon, label, value, gradient }) {
  return (
    <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform cursor-default">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value ?? '-'}</p>
        </div>
        <div className={`w-14 h-14 rounded-2xl ${gradient} flex items-center justify-center`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );
}

// Dashboard Page
function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, recentRes] = await Promise.all([api.getStats(), api.getRecentAbnormal()]);
      setStats(statsRes);
      setRecent(recentRes.results || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const pieData = stats?.test_distribution ? 
    Object.entries(stats.test_distribution).slice(0, 6).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value })) : [];
  
  const barData = stats?.abnormal_by_test ?
    Object.entries(stats.abnormal_by_test).slice(0, 6).map(([name, count]) => ({ name: name.substring(0, 12), count })) : [];

  const genderData = stats?.gender_distribution ?
    Object.entries(stats.gender_distribution).map(([name, value]) => ({ name: name || 'Unknown', value })) : [];

  const abnormalityData = [
    { name: 'Normal', value: stats?.normal_count || 0, color: '#10b981' },
    { name: 'Abnormal', value: stats?.abnormal_count || 0, color: '#ef4444' }
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
          <p className="text-slate-400">Real-time lab analytics overview</p>
        </div>
        <button onClick={loadData} className="btn-gradient text-white px-6 py-3 rounded-xl flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard icon={Users} label="Total Patients" value={stats?.total_patients} gradient="bg-gradient-to-br from-blue-500 to-blue-700" />
        <StatCard icon={FlaskConical} label="Total Tests" value={stats?.total_tests} gradient="bg-gradient-to-br from-purple-500 to-purple-700" />
        <StatCard icon={AlertTriangle} label="Abnormal Results" value={stats?.abnormal_count} gradient="bg-gradient-to-br from-red-500 to-red-700" />
        <StatCard icon={FileText} label="Test Types" value={stats?.unique_tests} gradient="bg-gradient-to-br from-blue-500 to-emerald-700" />
        <StatCard icon={Activity} label="Abnormal Rate" value={stats?.abnormal_rate ? `${stats.abnormal_rate}%` : '-'} gradient="bg-gradient-to-br from-orange-500 to-orange-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-6">Test Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name }) => name}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-6">Abnormal vs Normal</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={abnormalityData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {abnormalityData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-6">Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={genderData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {genderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-6">Abnormal Tests by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }} />
              <Bar dataKey="count" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-6">Recent Abnormal Results</h3>
        <div className="space-y-3">
          {recent.length > 0 ? recent.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.abnormal_direction === 'LOW' ? 'bg-blue-500/20' : 'bg-red-500/20'}`}>
                  {item.abnormal_direction === 'LOW' ? <TrendingDown className="w-5 h-5 text-blue-400" /> : <TrendingUp className="w-5 h-5 text-red-400" />}
                </div>
                <div>
                  <p className="font-semibold">{item.patient_name}</p>
                  <p className="text-sm text-slate-400">{item.canonical_test?.replace(/_/g, ' ')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${item.abnormal_direction === 'LOW' ? 'text-blue-400' : 'text-red-400'}`}>
                  {item.value} {item.unit}
                </p>
                <p className="text-xs text-slate-500">Normal: {item.reference_min}-{item.reference_max}</p>
              </div>
            </div>
          )) : <p className="text-center text-slate-400 py-8">No abnormal results found</p>}
        </div>
      </div>
    </div>
  );
}

// Chat Page
function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scrollToBottom, [messages]);

  const suggestions = [
    "Show patients with low hemoglobin",
    "Who has abnormal WBC?",
    "Show hemoglobin trend for Renuka",
    "List all CBC reports"
  ];

  const sendMessage = async (text = input) => {
    if (!text.trim() || loading) return;
    
    setMessages(prev => [...prev, { text: text.trim(), isUser: true, time: new Date() }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.query(text.trim());
      setMessages(prev => [...prev, { 
        text: res.message || 'Sorry, I encountered an error.', 
        isUser: false, 
        time: new Date(),
        data: res.data || [],
        resultCount: res.result_count || 0
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { text: 'Unable to connect to server.', isUser: false, time: new Date() }]);
    }
    setLoading(false);
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col animate-fade-in">
      <div className="mb-6">
        <h1 className="text-4xl font-bold gradient-text mb-2">Query Assistant</h1>
        <p className="text-slate-400">Ask anything about your lab reports</p>
      </div>

      <div className="flex-1 glass rounded-2xl flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Hello! I'm LabAssist AI</h3>
              <p className="text-slate-400 mb-8 max-w-md">I can analyze lab reports, find trends, and answer questions about patient results.</p>
              <div className="flex flex-wrap gap-3 justify-center max-w-2xl">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s)} className="px-4 py-2 bg-slate-800 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 rounded-full text-sm transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className="flex items-start gap-3 max-w-[70%]">
                    {!msg.isUser && (
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className={`p-4 rounded-2xl ${msg.isUser ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-sm' : 'bg-slate-800 rounded-bl-sm'}`}>
                      {msg.isUser ? (
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      ) : (
                        <>
                          <FormattedMessage text={msg.text} />
                          
                          {/* Data Visualization - show if we have test data */}
                          {msg.data && msg.data.length > 0 && (() => {
                            // Check if data contains test results
                            const hasTestResults = msg.data.some(item => 
                              item.value !== undefined || item.test_name || item.canonical_test
                            );

                            if (hasTestResults && msg.data.length > 0) {
                              // Count from ALL data (not just chartable data)
                              const allAbnormalCount = msg.data.filter(item => item.is_abnormal === true).length;
                              const allNormalCount = msg.data.filter(item => item.is_abnormal === false).length;
                              const totalCount = msg.resultCount || msg.data.length;

                              // Prepare chart data (only numeric values)
                              const chartData = msg.data
                                .filter(item => item.value != null && !isNaN(parseFloat(item.value)))
                                .slice(0, 20) // Show max 20 tests
                                .map(item => ({
                                  name: (item.test_name || item.canonical_test || 'Unknown').substring(0, 20),
                                  fullName: item.test_name || item.canonical_test || 'Unknown',
                                  value: parseFloat(item.value),
                                  unit: item.unit || '',
                                  is_abnormal: item.is_abnormal || false,
                                  patient: item.patient_name
                                }));

                              if (chartData.length > 0) {
                                return (
                                  <div className="mt-4 space-y-4">
                                    {/* Stats Summary */}
                                    <div className="grid grid-cols-3 gap-3 text-sm">
                                      <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                                        <div className="text-slate-400 text-xs mb-1">Total Tests</div>
                                        <div className="text-white font-bold text-lg">{totalCount}</div>
                                      </div>
                                      <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/30">
                                        <div className="text-blue-400 text-xs mb-1">Normal</div>
                                        <div className="text-emerald-300 font-bold text-lg">{allNormalCount}</div>
                                      </div>
                                      <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/30">
                                        <div className="text-red-400 text-xs mb-1">Abnormal</div>
                                        <div className="text-red-300 font-bold text-lg">{allAbnormalCount}</div>
                                      </div>
                                    </div>

                                    {/* Bar Chart */}
                                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                                      <div className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                        <BarChart className="w-4 h-4" />
                                        Test Results Visualization
                                      </div>
                                      <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={chartData}>
                                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                          <XAxis 
                                            dataKey="name" 
                                            tick={{ fill: '#94a3b8', fontSize: 9 }}
                                            angle={-45}
                                            textAnchor="end"
                                            height={80}
                                            stroke="#475569"
                                          />
                                          <YAxis 
                                            tick={{ fill: '#94a3b8', fontSize: 10 }}
                                            stroke="#475569"
                                          />
                                          <Tooltip 
                                            contentStyle={{ 
                                              backgroundColor: '#1e293b', 
                                              border: '1px solid #475569',
                                              borderRadius: '8px'
                                            }}
                                            formatter={(value, name, props) => [
                                              `${value} ${props.payload.unit}`,
                                              props.payload.fullName
                                            ]}
                                            labelStyle={{ color: '#e2e8f0' }}
                                          />
                                          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                            {chartData.map((entry, index) => (
                                              <Cell 
                                                key={`cell-${index}`} 
                                                fill={entry.is_abnormal ? '#ef4444' : '#10b981'}
                                              />
                                            ))}
                                          </Bar>
                                        </BarChart>
                                      </ResponsiveContainer>
                                      <div className="mt-3 flex gap-4 justify-center text-xs">
                                        <div className="flex items-center gap-2">
                                          <div className="w-3 h-3 rounded bg-blue-500"></div>
                                          <span className="text-slate-400">Normal</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <div className="w-3 h-3 rounded bg-red-500"></div>
                                          <span className="text-slate-400">Abnormal</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Pie Chart - Normal vs Abnormal */}
                                    {allAbnormalCount > 0 && (
                                      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                                        <div className="text-sm font-semibold text-white mb-3">Status Distribution</div>
                                        <ResponsiveContainer width="100%" height={200}>
                                          <PieChart>
                                            <Pie
                                              data={[
                                                { name: 'Normal', value: allNormalCount, color: '#10b981' },
                                                { name: 'Abnormal', value: allAbnormalCount, color: '#ef4444' }
                                              ]}
                                              cx="50%"
                                              cy="50%"
                                              innerRadius={50}
                                              outerRadius={80}
                                              paddingAngle={5}
                                              dataKey="value"
                                              label={({ name, value, percent }) => 
                                                `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                                              }
                                            >
                                              {[
                                                { name: 'Normal', value: allNormalCount, color: '#10b981' },
                                                { name: 'Abnormal', value: allAbnormalCount, color: '#ef4444' }
                                              ].map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                              ))}
                                            </Pie>
                                            <Tooltip 
                                              contentStyle={{ 
                                                backgroundColor: '#1e293b', 
                                                border: '1px solid #475569',
                                                borderRadius: '8px'
                                              }}
                                            />
                                          </PieChart>
                                        </ResponsiveContainer>
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                            }
                            return null;
                          })()}
                        </>
                      )}
                      <p className="text-xs opacity-60 mt-2">{msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    {msg.isUser && (
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-slate-800 rounded-2xl rounded-bl-sm p-4 flex gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="p-4 border-t border-slate-700/50">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about lab results..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              disabled={loading}
            />
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading} className="btn-gradient px-6 rounded-xl disabled:opacity-50">
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Upload Page
function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleFileChange = async (selectedFile) => {
    if (!selectedFile) return;
    
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/tiff', 'image/bmp', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Please upload PNG, JPEG, TIFF, BMP, or PDF files.');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setUploading(true);
    setExtractedData(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/ocr/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'OCR processing failed');
      }

      const data = await response.json();
      // Normalize the response to match frontend expectations
      const normalizedData = {
        ...data,
        patient_info: {
          name: data.patient_info?.patient_name || data.patient_info?.name || '',
          age: data.patient_info?.age || '',
          gender: data.patient_info?.gender || '',
          report_date: data.patient_info?.report_date || ''
        },
        tests: (data.tests || []).map(test => ({
          ...test,
          test_name: test.test_name || test.test_name_raw || test.canonical_test || '',
          value: test.value ?? '',
          unit: test.unit || '',
          reference_range: test.reference_range || (test.reference_min != null && test.reference_max != null ? `${test.reference_min}-${test.reference_max}` : ''),
          is_abnormal: test.is_abnormal || false
        }))
      };
      setExtractedData(normalizedData);
    } catch (err) {
      setError(err.message);
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileChange(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSave = async () => {
    if (!extractedData) return;

    setSaving(true);
    setError(null);

    try {
      // Transform data to match backend expectations
      const saveData = {
        ...extractedData,
        patient_info: {
          ...extractedData.patient_info,
          patient_name: extractedData.patient_info.name // Backend expects patient_name, not name
        },
        tests: extractedData.tests.map(test => ({
          ...test,
          canonical_test: test.canonical_test || test.test_name || 'UNKNOWN',
          raw_test_name: test.test_name || test.raw_test_name || 'Unknown'
        }))
      };
      console.log('Sending save data:', saveData);

      const response = await fetch('/api/ocr/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to save data');
      }

      const result = await response.json();
      setSuccess(true);
      setTimeout(() => {
        setFile(null);
        setExtractedData(null);
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setExtractedData(null);
    setError(null);
    setSuccess(false);
  };

  const updatePatientInfo = (field, value) => {
    setExtractedData(prev => ({
      ...prev,
      patient_info: { ...prev.patient_info, [field]: value }
    }));
  };

  const updateTest = (index, field, value) => {
    setExtractedData(prev => ({
      ...prev,
      tests: prev.tests.map((test, i) => 
        i === index ? { ...test, [field]: value } : test
      )
    }));
  };

  const removeTest = (index) => {
    setExtractedData(prev => ({
      ...prev,
      tests: prev.tests.filter((_, i) => i !== index)
    }));
  };

  const addTest = () => {
    setExtractedData(prev => ({
      ...prev,
      tests: [...prev.tests, {
        test_name: '',
        value: '',
        unit: '',
        reference_range: '',
        is_abnormal: false
      }]
    }));
  };

  if (success) {
    return (
      <div className="animate-fade-in">
        <div className="glass rounded-2xl p-12 text-center border-2 border-blue-500">
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-blue-400 mb-2">Success!</h2>
          <p className="text-slate-300 mb-4">
            Lab report for <span className="text-white font-semibold">{extractedData?.patient_info?.name}</span> has been saved successfully.
          </p>
          <p className="text-slate-400">
            {extractedData?.tests?.length || 0} tests added to the database.
          </p>
        </div>
      </div>
    );
  }

  if (extractedData && !uploading) {
    return (
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Verify Extracted Data</h1>
            <p className="text-slate-400">Review and edit the extracted information before saving</p>
          </div>
          <button 
            onClick={handleReset}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-red-400 font-semibold">Error</div>
              <div className="text-red-300 text-sm">{error}</div>
            </div>
          </div>
        )}

        {/* Patient Information */}
        <div className="glass rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            Patient Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Patient Name</label>
              <input
                type="text"
                value={extractedData.patient_info.name || ''}
                onChange={(e) => updatePatientInfo('name', e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Age</label>
              <input
                type="text"
                value={extractedData.patient_info.age || ''}
                onChange={(e) => updatePatientInfo('age', e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Gender</label>
              <select
                value={extractedData.patient_info.gender || ''}
                onChange={(e) => updatePatientInfo('gender', e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Test Date</label>
              <input
                type="text"
                value={extractedData.patient_info.test_date || ''}
                onChange={(e) => updatePatientInfo('test_date', e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                placeholder="YYYY-MM-DD"
              />
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Test Results ({extractedData.tests.length})
            </h2>
            <button
              onClick={addTest}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Test
            </button>
          </div>

          <div className="space-y-3">
            {extractedData.tests.map((test, index) => (
              <div key={index} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${test.is_abnormal ? 'bg-red-500' : 'bg-blue-500'}`} />
                    <span className="text-sm font-medium text-slate-400">Test #{index + 1}</span>
                  </div>
                  <button
                    onClick={() => removeTest(index)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-400 mb-1">Test Name</label>
                    <input
                      type="text"
                      value={test.test_name || test.test_name_raw || test.canonical_test || ''}
                      onChange={(e) => updateTest(index, 'test_name', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Value</label>
                    <input
                      type="text"
                      value={test.value ?? ''}
                      onChange={(e) => updateTest(index, 'value', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Unit</label>
                    <input
                      type="text"
                      value={test.unit || ''}
                      onChange={(e) => updateTest(index, 'unit', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Reference Range</label>
                    <input
                      type="text"
                      value={test.reference_range || (test.reference_min != null && test.reference_max != null ? `${test.reference_min}-${test.reference_max}` : '')}
                      onChange={(e) => updateTest(index, 'reference_range', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !extractedData.patient_info.name || extractedData.tests.length === 0}
            className="px-6 py-3 btn-gradient text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save to Database
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-4xl font-bold gradient-text mb-2">Upload Lab Reports</h1>
      <p className="text-slate-400 mb-8">Upload lab report images for automatic OCR processing and data extraction</p>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-red-400 font-semibold">Error</div>
            <div className="text-red-300 text-sm">{error}</div>
          </div>
        </div>
      )}

      <div 
        className="glass rounded-2xl p-12 text-center border-2 border-dashed border-slate-600 hover:border-blue-500 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/tiff,image/bmp,application/pdf"
          onChange={(e) => handleFileChange(e.target.files[0])}
          className="hidden"
        />
        
        {uploading ? (
          <>
            <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-6 animate-spin" />
            <h3 className="text-2xl font-semibold mb-2">Processing OCR...</h3>
            <p className="text-slate-400">Extracting text and analyzing lab report data</p>
          </>
        ) : (
          <>
            <Upload className="w-16 h-16 text-blue-500 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-2">Drag & Drop Lab Report</h3>
            <p className="text-slate-400 mb-6">or click to browse files</p>
            <div className="inline-block btn-gradient text-white px-8 py-3 rounded-xl">
              Browse Files
            </div>
            <p className="text-xs text-slate-500 mt-4">
              Supported formats: PNG, JPEG, TIFF, BMP, PDF
            </p>
          </>
        )}
      </div>
      
      <div className="mt-8 grid grid-cols-3 gap-6">
        <div className="glass rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Upload className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="font-semibold mb-2">1. Upload</h3>
          <p className="text-sm text-slate-400">Drop your lab report image</p>
        </div>
        <div className="glass rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="font-semibold mb-2">2. Verify</h3>
          <p className="text-sm text-slate-400">Review and edit extracted data</p>
        </div>
        <div className="glass rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Check className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="font-semibold mb-2">3. Save</h3>
          <p className="text-sm text-slate-400">Data ready for queries</p>
        </div>
      </div>
    </div>
  );
}

// Patients Page
function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientHistory, setPatientHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    api.getPatients().then(res => {
      setPatients(res.patients || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = patients.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  const viewPatientDetails = async (patient) => {
    setSelectedPatient(patient);
    setHistoryLoading(true);
    try {
      const history = await api.getPatientHistory(patient.name);
      setPatientHistory(history);
    } catch (error) {
      console.error('Failed to load patient history:', error);
    }
    setHistoryLoading(false);
  };

  const closeModal = () => {
    setSelectedPatient(null);
    setPatientHistory(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Patients</h1>
          <p className="text-slate-400">View all patient records</p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patients..."
          className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 w-72"
        />
      </div>

      {loading ? (
        <div className="p-12 text-center glass rounded-2xl">
          <RefreshCw className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading patients...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length > 0 ? filtered.map((patient, i) => (
            <div 
              key={i} 
              onClick={() => viewPatientDetails(patient)}
              className="glass rounded-2xl p-6 hover:border-blue-500 border-2 border-transparent transition-all cursor-pointer hover:scale-105 duration-200 group relative overflow-hidden"
            >
              {/* Hover gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              
              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg">
                    {patient.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white mb-1 truncate group-hover:text-blue-400 transition-colors">{patient.name}</h3>
                    <div className="flex gap-3 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {patient.age || 'N/A'} yrs
                      </span>
                      <span>•</span>
                      <span>{patient.gender || 'N/A'}</span>
                    </div>
                  </div>
                </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Total Tests</span>
                  <span className="text-white font-semibold flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-blue-400" />
                    {patient.test_count}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Health Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${patient.has_abnormal ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                    {patient.has_abnormal ? (
                      <>
                        <AlertTriangle className="w-3 h-3" />
                        Needs Attention
                      </>
                    ) : (
                      <>
                        <Activity className="w-3 h-3" />
                        All Normal
                      </>
                    )}
                  </span>
                </div>

                {patient.latest_date && (
                  <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                    <span className="text-slate-400 text-sm">Latest Report</span>
                    <span className="text-slate-300 text-sm">{new Date(patient.latest_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700">
                <button className="w-full btn-gradient text-white py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
                  <Activity className="w-4 h-4" />
                  View Full History
                </button>
              </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full glass rounded-2xl p-12 text-center">
              <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No patients found</p>
            </div>
          )}
        </div>
      )}

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="glass rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-700 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  {selectedPatient.name?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">{selectedPatient.name}</h2>
                  <div className="flex gap-4 text-slate-400">
                    <span>{selectedPatient.age} years</span>
                    <span>•</span>
                    <span>{selectedPatient.gender}</span>
                    {patientHistory && (
                      <>
                        <span>•</span>
                        <span>{patientHistory.total_reports} Reports</span>
                        <span>•</span>
                        <span>{patientHistory.total_tests} Tests</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {historyLoading ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
                  <p className="text-slate-400">Loading patient history...</p>
                </div>
              ) : patientHistory ? (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                      <div className="text-slate-400 text-sm mb-1">Total Reports</div>
                      <div className="text-2xl font-bold text-white">{patientHistory.total_reports}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                      <div className="text-slate-400 text-sm mb-1">Total Tests</div>
                      <div className="text-2xl font-bold text-white">{patientHistory.total_tests}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                      <div className="text-slate-400 text-sm mb-1">Abnormal Results</div>
                      <div className="text-2xl font-bold text-red-400">{patientHistory.total_abnormal}</div>
                    </div>
                  </div>

                  {/* Latest Test Values Overview - Bar Chart */}
                  {(() => {
                    // Get the latest value for each unique test
                    const latestTests = {};
                    patientHistory.reports.forEach(report => {
                      report.tests.forEach(test => {
                        if (test.value != null && !latestTests[test.test_name]) {
                          latestTests[test.test_name] = {
                            name: test.test_name,
                            value: parseFloat(test.value),
                            unit: test.unit,
                            is_abnormal: test.is_abnormal,
                            reference_range: test.reference_range
                          };
                        }
                      });
                    });

                    const chartData = Object.values(latestTests)
                      .filter(t => !isNaN(t.value))
                      .slice(0, 15); // Show top 15 tests

                    if (chartData.length > 0) {
                      return (
                        <div className="mb-6">
                          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            Latest Test Values Overview
                          </h3>
                          <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700">
                            <ResponsiveContainer width="100%" height={300}>
                              <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis 
                                  dataKey="name" 
                                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                                  angle={-45}
                                  textAnchor="end"
                                  height={100}
                                  stroke="#475569"
                                  interval={0}
                                />
                                <YAxis 
                                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                                  stroke="#475569"
                                  label={{ value: 'Test Value', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                                />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: '#1e293b', 
                                    border: '1px solid #475569',
                                    borderRadius: '8px',
                                    padding: '8px'
                                  }}
                                  formatter={(value, name, props) => [
                                    `${value} ${props.payload.unit || ''}`,
                                    'Value'
                                  ]}
                                  labelFormatter={(label) => label}
                                  labelStyle={{ color: '#e2e8f0', fontWeight: 'bold', marginBottom: '4px' }}
                                />
                                <Bar 
                                  dataKey="value" 
                                  radius={[8, 8, 0, 0]}
                                >
                                  {chartData.map((entry, index) => (
                                    <Cell 
                                      key={`cell-${index}`} 
                                      fill={entry.is_abnormal ? '#ef4444' : '#10b981'}
                                    />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                            <div className="mt-4 flex gap-6 justify-center text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-blue-500"></div>
                                <span className="text-slate-300">Normal Range</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-red-500"></div>
                                <span className="text-slate-300">Abnormal</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Test Trends Charts */}
                  {(() => {
                    // Prepare trend data for common tests
                    const testTrends = {};
                    patientHistory.reports.forEach(report => {
                      const date = new Date(report.report_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      report.tests.forEach(test => {
                        if (test.value != null) {
                          if (!testTrends[test.test_name]) {
                            testTrends[test.test_name] = [];
                          }
                          testTrends[test.test_name].push({
                            date: date,
                            value: parseFloat(test.value),
                            unit: test.unit,
                            is_abnormal: test.is_abnormal,
                            reference_range: test.reference_range
                          });
                        }
                      });
                    });

                    // Filter to tests that have multiple data points
                    const trendsToShow = Object.entries(testTrends)
                      .filter(([_, data]) => data.length > 1)
                      .slice(0, 6); // Show top 6 tests with trends

                    if (trendsToShow.length > 0) {
                      return (
                        <div className="mb-6">
                          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Test Trends Over Time
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {trendsToShow.map(([testName, data]) => (
                              <div key={testName} className="bg-slate-800/30 rounded-xl p-4 border border-slate-700">
                                <div className="text-sm font-semibold text-white mb-3">{testName}</div>
                                <ResponsiveContainer width="100%" height={150}>
                                  <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis 
                                      dataKey="date" 
                                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                                      stroke="#475569"
                                    />
                                    <YAxis 
                                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                                      stroke="#475569"
                                    />
                                    <Tooltip 
                                      contentStyle={{ 
                                        backgroundColor: '#1e293b', 
                                        border: '1px solid #475569',
                                        borderRadius: '8px'
                                      }}
                                      formatter={(value) => [`${value} ${data[0].unit || ''}`, 'Value']}
                                      labelStyle={{ color: '#e2e8f0' }}
                                    />
                                    <Line 
                                      type="monotone" 
                                      dataKey="value" 
                                      stroke="#3b82f6" 
                                      strokeWidth={2}
                                      dot={(props) => {
                                        const { cx, cy, payload } = props;
                                        return (
                                          <circle
                                            cx={cx}
                                            cy={cy}
                                            r={4}
                                            fill={payload.is_abnormal ? '#ef4444' : '#10b981'}
                                            stroke={payload.is_abnormal ? '#dc2626' : '#059669'}
                                            strokeWidth={2}
                                          />
                                        );
                                      }}
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                                {data[0].reference_range && (
                                  <div className="text-xs text-slate-400 mt-2">
                                    Reference: {data[0].reference_range}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Timeline of Reports */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-4">Test History Timeline</h3>
                    {patientHistory.reports.map((report, idx) => (
                      <div key={idx} className="bg-slate-800/30 rounded-xl p-5 border border-slate-700">
                        {/* Report Header */}
                        <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-700">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-lg font-bold text-white">{report.report_type || 'Lab Report'}</h4>
                              {report.abnormal_count > 0 && (
                                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full border border-red-500/30">
                                  {report.abnormal_count} Abnormal
                                </span>
                              )}
                            </div>
                            <div className="text-slate-400 text-sm">
                              {new Date(report.report_date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </div>
                          </div>
                          <div className="text-slate-400 text-sm">
                            {report.total_tests} tests
                          </div>
                        </div>

                        {/* Test Results Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                          {report.tests.map((test, testIdx) => (
                            <div 
                              key={testIdx} 
                              className={`p-4 rounded-lg border-2 ${
                                test.is_abnormal 
                                  ? 'bg-red-500/10 border-red-500/30' 
                                  : 'bg-blue-500/10 border-blue-500/30'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="font-bold text-white text-base flex-1">{test.test_name}</div>
                                {test.is_abnormal && (
                                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 ml-2" />
                                )}
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-slate-400 text-xs">Value:</span>
                                  <span className={`text-xl font-bold ${
                                    test.is_abnormal ? 'text-red-400' : 'text-blue-400'
                                  }`}>
                                    {test.value} {test.unit || ''}
                                  </span>
                                </div>
                                {test.reference_range && (
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-slate-400 text-xs">Normal Range:</span>
                                    <span className="text-slate-300 text-xs font-medium">{test.reference_range}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Bar Chart Visualization */}
                        <div className="mt-4 bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                          <h5 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <BarChart className="w-4 h-4" />
                            Test Values Visualization
                          </h5>
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={report.tests.filter(t => t.value != null).map(t => ({
                              name: t.test_name.length > 15 ? t.test_name.substring(0, 15) + '...' : t.test_name,
                              fullName: t.test_name,
                              value: parseFloat(t.value),
                              unit: t.unit,
                              is_abnormal: t.is_abnormal,
                              reference: t.reference_range
                            }))}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                              <XAxis 
                                dataKey="name" 
                                tick={{ fill: '#94a3b8', fontSize: 10 }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                stroke="#475569"
                              />
                              <YAxis 
                                tick={{ fill: '#94a3b8', fontSize: 11 }}
                                stroke="#475569"
                              />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: '#1e293b', 
                                  border: '1px solid #475569',
                                  borderRadius: '8px'
                                }}
                                formatter={(value, name, props) => [
                                  `${value} ${props.payload.unit || ''}`,
                                  props.payload.fullName
                                ]}
                                labelFormatter={(label) => ''}
                                labelStyle={{ color: '#e2e8f0' }}
                              />
                              <Bar 
                                dataKey="value" 
                                radius={[8, 8, 0, 0]}
                              >
                                {report.tests.filter(t => t.value != null).map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.is_abnormal ? '#ef4444' : '#10b981'}
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-400">Failed to load patient history</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Dashboard App (Protected)
function DashboardApp() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'chat': return <Chat />;
      case 'upload': return <UploadPage />;
      case 'patients': return <PatientsPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Sidebar active={activePage} setActive={setActivePage} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <main className={`flex-1 p-8 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {renderPage()}
      </main>
    </div>
  );
}

// Main App with Authentication
function App() {
  const [authMode, setAuthMode] = useState(null); // null = landing, 'login', 'register'
  const { isAuthenticated, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, show dashboard
  if (isAuthenticated) {
    return <DashboardApp />;
  }

  // Show auth pages
  if (authMode === 'login' || authMode === 'register') {
    return (
      <AuthPages 
        mode={authMode} 
        onModeChange={setAuthMode}
        onSuccess={() => setAuthMode(null)}
        onBack={() => setAuthMode(null)}
      />
    );
  }

  // Show landing page
  return (
    <LandingPage 
      onLogin={() => setAuthMode('login')}
      onRegister={() => setAuthMode('register')}
    />
  );
}

// Wrap App with AuthProvider
function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWithAuth;
