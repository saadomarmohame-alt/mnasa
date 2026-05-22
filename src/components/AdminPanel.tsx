import React, { useState } from 'react';
import { 
  Shield, Users, DollarSign, Key, AlertTriangle, CheckCircle, 
  Ban, ArrowUpRight, Award, Plus, Code, Trash, Activity, Database
} from 'lucide-react';
import { User, Transaction, SecurityLog, Course } from '../types';
import DatabaseExplorer from './DatabaseExplorer';

interface AdminPanelProps {
  users: User[];
  transactions: Transaction[];
  securityLogs: SecurityLog[];
  courses: Course[];
  onUserRoleChange: (userId: string, targetRole: 'Super Admin' | 'Admin' | 'Teacher' | 'Student' | 'Moderator') => void;
  onBanUserToggle: (userId: string) => void;
  onApproveTeacher: (teacherName: string) => void;
  onDeleteCourse?: (id: string) => void;
}

export default function AdminPanel({ 
  users, 
  transactions, 
  securityLogs, 
  courses, 
  onUserRoleChange, 
  onBanUserToggle, 
  onApproveTeacher,
  onDeleteCourse
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'metrics' | 'users' | 'approvals' | 'security' | 'coupons' | 'database'>('metrics');
  const [inspectedUser, setInspectedUser] = useState<User | null>(null);
  
  // Custom Coupon Builder state
  const [coupons, setCoupons] = useState([
    { code: 'ARG_ZERO_A', discount: 100, remaining: 12, category: 'AL ARGINTINI PREMIUM' },
    { code: 'CYBER_VIP_80', discount: 80, remaining: 45, category: 'CYBER ETHICAL' },
    { code: 'AI_LABS_20', discount: 20, remaining: 150, category: 'AI NETWORK' }
  ]);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState(50);

  // Pending teachers approvals queue
  const [pendingTeachers, setPendingTeachers] = useState([
    { id: 'p-1', name: 'Professor Julian Thorne', area: 'Quantum Cryptography', resumeLink: '#', verifiedID: 'DOC-KYC-902' },
    { id: 'p-2', name: 'Eng. Anya Vostok', area: 'Reverse Malware Analysis', resumeLink: '#', verifiedID: 'DOC-KYC-184' }
  ]);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    setCoupons((prev) => [
      ...prev,
      { code: newCode.trim().toUpperCase(), discount: Math.min(100, Math.max(5, newDiscount)), remaining: 100, category: 'MANUAL REBATE' }
    ]);
    setNewCode('');
  };

  const handleRemoveCoupon = (code: string) => {
    setCoupons((prev) => prev.filter(c => c.code !== code));
  };

  const handleApproveTeacherClick = (id: string, name: string) => {
    onApproveTeacher(name);
    setPendingTeachers((prev) => prev.filter(p => p.id !== id));
  };

  // Compute stats metrics sums
  const totalRevenue = transactions
    .filter(t => t.status === 'Completed')
    .reduce((sum, curr) => sum + curr.amount, 0);

  const activeEnrolls = users.reduce((sum, u) => sum + u.enrolledCourses.length, 0);

  return (
    <div className="space-y-6" id="admin-panel-main">
      {/* Tab Navigations Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-900 pb-1.5 select-none text-xs">
        {[
          { id: 'metrics', label: 'Neural Analytics', icon: Activity },
          { id: 'users', label: 'User Matrix', icon: Users },
          { id: 'approvals', label: 'Teacher Verifications', icon: Award },
          { id: 'security', label: 'Dynamic Defense Logs', icon: Key },
          { id: 'coupons', label: 'Campaign Coupons', icon: DollarSign },
          { id: 'database', label: 'Relational DB Explorer', icon: Database }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-sans font-medium hover:text-white transition flex items-center gap-2 cursor-pointer ${isActive ? 'bg-gradient-to-r from-cyan-950/50 to-indigo-950/50 border border-cyan-500/30 text-cyan-400 font-bold' : 'text-slate-400'}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* METRICS & STATS INTERFACE TAB */}
      {activeTab === 'metrics' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Key Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Revenue */}
            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl" />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase font-bold">Total Platform Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-3.5 space-y-1">
                <h3 className="text-2.5xl font-mono font-extrabold text-white">${totalRevenue.toLocaleString()}</h3>
                <p className="text-[10px] text-emerald-400 font-sans flex items-center gap-1">
                  <span className="font-bold">+18.4%</span> since last cycle
                </p>
              </div>
            </div>

            {/* Total Students Enrollment */}
            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl" />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase font-bold">Enrolled Profiles</span>
                <Users className="w-4 h-4 text-pink-400" />
              </div>
              <div className="mt-3.5 space-y-1">
                <h3 className="text-2.5xl font-mono font-extrabold text-white">{users.length * 4}</h3>
                <p className="text-[10px] text-pink-400 font-sans flex items-center gap-1">
                  <span className="font-bold">+12%</span> enrollment expansion
                </p>
              </div>
            </div>

            {/* Total Lectures Courses */}
            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase font-bold">Curated Catalog</span>
                <Shield className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="mt-3.5 space-y-1">
                <h3 className="text-2.5xl font-mono font-extrabold text-white">{courses.length} Deep Modules</h3>
                <p className="text-[10px] text-slate-500 font-sans">
                  Dynamic micro syllabus active
                </p>
              </div>
            </div>

            {/* Active Server Nodes Load */}
            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 relative overflow-hidden group">
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase font-bold">Node Hardware Load</span>
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              </div>
              <div className="mt-3.5 space-y-1">
                <h3 className="text-2.5xl font-mono font-extrabold text-white">0.04 ms</h3>
                <p className="text-[10px] text-slate-400 font-sans">
                  Edge Content Delivery Network sync
                </p>
              </div>
            </div>
          </div>

          {/* Premium Custom Analytics Plot (SVG Graphic) */}
          <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Live Telemetry</span>
                <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider">
                  Operational Revenue Expansion Plot (USD)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/20 uppercase">
                AUTOMATED SYSTEM FEED
              </span>
            </div>

            {/* Beautiful Curve */}
            <div className="relative h-64 w-full bg-slate-900/15 rounded-xl overflow-hidden border border-slate-900 p-4">
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 pointer-events-none opacity-[0.05]">
                {Array(24).fill(0).map((_, i) => (
                  <div key={i} className="border-t border-r border-white w-full h-full" />
                ))}
              </div>

              {/* Dynamic Vector Curves Line chart representing stats */}
              <svg className="w-full h-full overflow-visible xl:px-4" viewBox="0 0 500 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.38" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area Gradient */}
                <path
                  d="M 0 100 Q 120 40 250 80 T 500 20 L 500 100 Z"
                  fill="url(#area-grad)"
                />
                {/* Line Curve path */}
                <path
                  d="M 0 100 Q 120 40 250 80 T 500 20"
                  fill="none"
                  strokeWidth="2"
                  className="stroke-cyan-400"
                />
                {/* Hot spot beacons */}
                <circle cx="250" cy="80" r="4" fill="#06b6d4" className="animate-ping" />
                <circle cx="500" cy="20" r="4" fill="#6366f1" className="animate-pulse" />
              </svg>

              {/* Chart legends */}
              <div className="absolute bottom-2 left-4 right-4 flex justify-between font-mono text-[9px] text-slate-500">
                <span>EPOCH Q1</span>
                <span>EPOCH Q2</span>
                <span>EPOCH Q3</span>
                <span>EPOCH Q4 (CURRENT)</span>
              </div>
            </div>
          </div>

          {/* Recent Ledger transactions lists */}
          <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider">
              Recent Capital Ledger Logs
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full font-sans text-xs text-left text-slate-300">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-500 text-[10px] font-mono uppercase">
                    <th className="py-2.5">TRANSACTION ID</th>
                    <th>STUDENT NAME</th>
                    <th>ACADEMIC TARGET</th>
                    <th>FEE</th>
                    <th>GATEWAY</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60">
                  {transactions.slice(0, 10).map((t) => (
                    <tr key={t.id} className="hover:bg-slate-905 transition">
                      <td className="py-3 font-mono text-[10px] text-slate-500">{t.id}</td>
                      <td className="font-bold text-white">{t.userName}</td>
                      <td className="truncate max-w-[200px] text-slate-400">{t.courseTitle}</td>
                      <td className="font-mono text-cyan-400 font-bold">${t.amount}</td>
                      <td className="font-mono text-[10px]">{t.paymentMethod}</td>
                      <td>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${t.status === 'Completed' ? 'bg-emerald-950/20 text-emerald-400' : 'bg-red-950/20 text-red-400'}`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* USER MANAGEMENT MATRIX TABLE */}
      {activeTab === 'users' && (
        <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3 font-sans">
            <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider">
              Administrative Users Permission Grid
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">Role hierarchy bypass authorized</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead>
                <tr className="border-b border-slate-900 text-slate-500 text-[10px] font-mono uppercase">
                  <th className="py-2.5">USER AVATAR & NAME</th>
                  <th>EMAIL CORRIDOR</th>
                  <th>ORGANIZATION ROLE</th>
                  <th>COURSES HELD</th>
                  <th>SANCTION ACTION</th>
                  <th>INSPECT DETAILS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#0d1222] transition">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <img src={u.avatar} className="w-8 h-8 rounded-full border border-slate-800" alt={u.name} />
                        <div>
                          <p className="font-bold text-white">{u.name}</p>
                           <span className="text-[9px] font-mono text-slate-500">ID: {u.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-slate-400">{u.email}</td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => onUserRoleChange(u.id, e.target.value as any)}
                        className="bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs px-2.5 py-1 focus:outline-none focus:border-cyan-45"
                      >
                        {['Super Admin', 'Admin', 'Teacher', 'Student', 'Moderator'].map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </td>
                    <td className="font-mono text-[11px] text-slate-400 px-2">{u.enrolledCourses.length || '---'}</td>
                    <td>
                      <button
                        onClick={() => onBanUserToggle(u.id)}
                        className={`px-3 py-1 rounded inline-flex items-center gap-1.5 text-[10px] font-mono transition-colors cursor-pointer ${u.isBanned ? 'bg-emerald-950/20 text-emerald-400 hover:bg-emerald-400 hover:text-black border border-emerald-500/10' : 'bg-red-950/20 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/10'}`}
                      >
                        <Ban className="w-3 h-3" />
                        <span>{u.isBanned ? 'RECOVER SANCTION' : 'SUSPEND NODE'}</span>
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => setInspectedUser(u)}
                        className="px-2.5 py-1 bg-cyan-950/40 hover:bg-cyan-400 text-cyan-400 hover:text-black font-mono font-bold text-[10px] rounded border border-cyan-500/10 hover:border-cyan-400 transition cursor-pointer"
                      >
                        INSPECT
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* DYNAMIC ACCOUNT INSPECT MODAL OVERLAY */}
          {inspectedUser && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <div className="bg-[#090e1a] border-2 border-cyan-400/20 max-w-md w-full rounded-2xl p-6 relative overflow-hidden shadow-2xl animate-in zoom-in-95 space-y-4 text-left">
                <div className="flex justify-between items-start border-b border-white/5 pb-3">
                  <div className="flex items-center gap-3">
                    <img src={inspectedUser.avatar} className="w-10 h-10 rounded-full border border-slate-800" alt="" />
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase">{inspectedUser.name}</h4>
                      <p className="text-[9px] font-mono text-cyan-400">{inspectedUser.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setInspectedUser(null)}
                    className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
                  >
                    [ CLOSE ]
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                    <span className="text-[8px] text-slate-500 block">CLEARANCE NODE</span>
                    <span className={inspectedUser.isBanned ? 'text-rose-450 text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {inspectedUser.isBanned ? 'SUSPENDED/BANNED' : 'OPERATIONAL_OK'}
                    </span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                    <span className="text-[8px] text-slate-500 block">SYSTEM ROLE</span>
                    <span className="text-indigo-400 font-bold">{inspectedUser.role}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-slate-500 block">NODE SECURITY BIOGRAPHY</span>
                  <p className="text-[11px] text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-900 leading-relaxed font-sans">
                    {inspectedUser.bio || 'No dynamic bio configured for this operator.'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[8px] font-mono text-slate-500 block uppercase">Classes Owned / Clearances ({inspectedUser.enrolledCourses.length})</span>
                  <div className="max-h-32 overflow-y-auto space-y-1 bg-slate-950 border border-slate-900 p-2 rounded-lg text-[10px] font-sans">
                    {inspectedUser.enrolledCourses.length === 0 ? (
                      <p className="text-[9px] italic text-slate-600 p-1">No dynamic classes mapped to profile.</p>
                    ) : (
                      inspectedUser.enrolledCourses.map(cid => {
                        const match = courses.find(c => c.id === cid);
                        return (
                          <div key={cid} className="p-1 px-2.5 bg-slate-900/40 rounded flex justify-between items-center text-slate-350">
                            <span className="font-bold truncate max-w-[180px]">{match ? match.title : cid}</span>
                            <span className="text-[8px] text-cyan-400 font-mono">OK</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="text-[8px] font-mono text-slate-600 flex justify-between pt-1 border-t border-white/5">
                  <span>ID: {inspectedUser.id}</span>
                  <span>SYSTEM PROFILE INSPECTOR</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TEACHER APPROVALS QUEUE */}
      {activeTab === 'approvals' && (
        <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 space-y-4 animate-in fade-in duration-300">
          <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider">
            Teachers Credentials Approval System
          </h4>
          
          {pendingTeachers.length === 0 ? (
            <p className="text-center py-10 font-mono text-xs text-slate-500 italic">
              All pending dynamic KYC submissions verified. Academic queue empty.
            </p>
          ) : (
            <div className="space-y-4">
              {pendingTeachers.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-slate-905 bg-slate-900/10 flex flex-wrap justify-between items-center gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">{p.name}</p>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-500">
                      <span className="bg-slate-900 p-1 px-2 rounded">TARGET DISCIPLINE: {p.area}</span>
                      <span className="bg-slate-900 p-1 px-2 rounded">KYC COMPLIANCE: {p.verifiedID}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApproveTeacherClick(p.id, p.name)}
                      className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-sans font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve Credentials
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ACTIVE SECURITY TERM DEFENSE LOGS */}
      {activeTab === 'security' && (
        <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4 font-mono text-xs text-cyan-400 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider">
              Autonomous Threat Defense & API Sentinel Logs
            </h4>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="h-64 overflow-y-auto bg-black rounded-xl p-4 space-y-2 border border-slate-900 text-[10.5px]">
            {securityLogs.map((log) => (
              <div key={log.id} className={`p-2 rounded border leading-relaxed flex items-start gap-2.5 ${log.severity === 'CRITICAL' ? 'bg-red-950/20 border-red-900/50 text-red-400' : log.severity === 'WARNING' ? 'bg-amber-950/20 border-amber-900/50 text-amber-500' : 'bg-slate-900/30 border-slate-900 text-cyan-500'}`}>
                <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p>
                    <span className="font-bold">[{log.severity}] // {log.timestamp}</span>: {log.event}
                  </p>
                  <p className="text-slate-500 font-mono text-[9px]">
                    SOURCE IP: {log.ipAddress} | AGENT: {log.userAgent}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CAMPAIGN COUPONS BUILDER */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
          <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 space-y-4 h-fit">
            <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider">
              Launch Promotional Coupon
            </h4>
            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Coupon Promo Code</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. CYBER_ZERO_B"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Discount Magnitude (%)</label>
                <input
                  type="number"
                  required
                  min={5}
                  max={100}
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-404 bg-cyan-400 hover:bg-cyan-300 text-black font-sans font-bold text-xs tracking-wider uppercase transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Deploy Campaign Coupon
              </button>
            </form>
          </div>

          <div className="md:col-span-2 bg-slate-950/60 border border-slate-900 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider">
              Active Marketing Promo Codes
            </h4>

            <div className="space-y-3 font-sans">
              {coupons.map((c) => (
                <div key={c.code} className="p-3 border border-slate-850 bg-slate-900/10 rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-mono font-bold text-white flex items-center gap-2">
                       <span className="text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/15">{c.code}</span>
                       <span className="text-[10px] text-slate-500">({c.category})</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-400">{c.discount}% OFF</span>
                    <button
                      onClick={() => handleRemoveCoupon(c.code)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-white/5 transition cursor-pointer"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. EMBEDDED RELATIONAL DATABASE EXPLORER SHEET */}
      {activeTab === 'database' && (
        <div className="animate-in fade-in duration-305">
          <DatabaseExplorer 
            courses={courses}
            users={users}
            transactions={transactions}
            securityLogs={securityLogs}
            onDeleteCourse={onDeleteCourse}
          />
        </div>
      )}
    </div>
  );
}
