import React, { useState, useMemo } from 'react';
import { 
  Database, Search, Filter, ArrowUpRight, ShieldCheck, 
  Trash, Plus, RefreshCw, Layers, Users, DollarSign, Activity, BookOpen
} from 'lucide-react';
import { Course, User, Transaction, SecurityLog } from '../types';

interface DatabaseExplorerProps {
  courses: Course[];
  users: User[];
  transactions: Transaction[];
  securityLogs: SecurityLog[];
  onDeleteCourse?: (id: string) => void;
}

export default function DatabaseExplorer({ 
  courses, 
  users, 
  transactions, 
  securityLogs, 
  onDeleteCourse 
}: DatabaseExplorerProps) {
  const [dbTab, setDbTab] = useState<'courses' | 'users' | 'billing' | 'telemetry'>('courses');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortField, setSortField] = useState<string>('id');
  const [sortAsc, setSortAsc] = useState(true);

  // Generate some high-quality mock data for performance simulations (large DB feel)
  const simulatedLargeCoursesCount = 1240;
  const simulatedLargeUsersCount = 142500;
  const simulatedLargeTransactionsCount = 38920;

  // Filter & sort operations for current session items
  const sortedAndFilteredCourses = useMemo(() => {
    return courses
      .filter(c => {
        const query = search.toLowerCase();
        const matchesQuery = c.title.toLowerCase().includes(query) || 
                             c.id.toLowerCase().includes(query) || 
                             c.category.toLowerCase().includes(query);
        const matchesCat = categoryFilter === 'All' || c.category === categoryFilter;
        return matchesQuery && matchesCat;
      })
      .sort((a: any, b: any) => {
        let valA = a[sortField] ?? '';
        let valB = b[sortField] ?? '';
        if (typeof valA === 'string') {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortAsc ? valA - valB : valB - valA;
      });
  }, [courses, search, categoryFilter, sortField, sortAsc]);

  const sortedAndFilteredUsers = useMemo(() => {
    return users
      .filter(u => {
        const query = search.toLowerCase();
        return u.name.toLowerCase().includes(query) || 
               u.email.toLowerCase().includes(query) || 
               u.role.toLowerCase().includes(query);
      });
  }, [users, search]);

  const sortedAndFilteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const query = search.toLowerCase();
        return t.userName.toLowerCase().includes(query) || 
               t.courseTitle.toLowerCase().includes(query) || 
               t.id.toLowerCase().includes(query);
      });
  }, [transactions, search]);

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-6" id="db-explorer-root">
      {/* Database stats banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-2xl flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">RELATIONAL TABLES</span>
            <p className="text-xl font-mono font-bold text-white">4 Tables Active</p>
          </div>
          <Database className="w-5 h-5 text-cyan-400" />
        </div>

        <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-2xl flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">INDEXED COURSES</span>
            <p className="text-xl font-mono font-bold text-white">{sortedAndFilteredCourses.length} <span className="text-slate-500 text-xs">/ {simulatedLargeCoursesCount}</span></p>
          </div>
          <BookOpen className="w-5 h-5 text-indigo-400" />
        </div>

        <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-2xl flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">RECONSTRUCTED GRADS</span>
            <p className="text-xl font-mono font-bold text-white">{users.length} <span className="text-slate-500 text-xs">/ {simulatedLargeUsersCount}</span></p>
          </div>
          <Users className="w-5 h-5 text-pink-400" />
        </div>

        <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-2xl flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">PERSISTENT TRANSACTION LOGS</span>
            <p className="text-xl font-mono font-bold text-white">{transactions.length} <span className="text-slate-500 text-xs">/ {simulatedLargeTransactionsCount}</span></p>
          </div>
          <DollarSign className="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      {/* Database control deck */}
      <div className="border border-slate-900 bg-slate-950/80 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-3 border-b border-slate-900">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-950/40 text-cyan-400 rounded-lg">
              <Database className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider">AL ARGINTINI Global Storage System Explorer</h3>
              <p className="text-[10px] text-slate-400 font-mono">REAL-TIME ATOMIC TRANSACTION LOGS & SYLLABUS SCHEMAS</p>
            </div>
          </div>

          <div className="flex bg-slate-900/30 p-1 rounded-xl border border-slate-850 self-end select-none">
            {[
              { id: 'courses', label: 'Courses DB', count: courses.length },
              { id: 'users', label: 'Users DB', count: users.length },
              { id: 'billing', label: 'Billing Ledger', count: transactions.length },
              { id: 'telemetry', label: 'System Logs', count: securityLogs.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setDbTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-[10.5px] font-mono transition cursor-pointer ${dbTab === tab.id ? 'bg-cyan-400 text-black font-extrabold' : 'text-slate-400 hover:text-white'}`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Database query searches controls */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full bg-slate-900/35 rounded-xl border border-slate-850 overflow-hidden">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Query relational ${dbTab} database fields...`}
              className="w-full bg-transparent pl-9 pr-3 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>

          {dbTab === 'courses' && (
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-[10px] font-mono text-slate-500">CATEGORY:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                {['All', 'AI', 'Ethical Hacking', 'Web Development', 'Cybersecurity'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* TABLE CONTENT RENDERINGS */}
        <div className="overflow-x-auto rounded-xl border border-slate-900 bg-slate-950">
          
          {/* 1. COURSES TABLE */}
          {dbTab === 'courses' && (
            <table className="w-full text-xs text-left text-slate-300">
              <thead>
                <tr className="bg-slate-900/40 border-b border-slate-900 text-slate-500 text-[9.5px] font-mono uppercase tracking-wider">
                  <th className="p-3 cursor-pointer select-none" onClick={() => toggleSort('id')}>CO_ID {sortField === 'id' && (sortAsc ? '▲' : '▼')}</th>
                  <th className="p-3 cursor-pointer select-none" onClick={() => toggleSort('title')}>TITLE {sortField === 'title' && (sortAsc ? '▲' : '▼')}</th>
                  <th className="p-3 cursor-pointer select-none" onClick={() => toggleSort('category')}>CATEGORY {sortField === 'category' && (sortAsc ? '▲' : '▼')}</th>
                  <th className="p-3 cursor-pointer select-none text-right" onClick={() => toggleSort('price')}>PRICE {sortField === 'price' && (sortAsc ? '▲' : '▼')}</th>
                  <th className="p-3 cursor-pointer select-none text-right" onClick={() => toggleSort('enrolledCount')}>GRAD ENROLLED {sortField === 'enrolledCount' && (sortAsc ? '▲' : '▼')}</th>
                  <th className="p-3">INSTRUCTOR NODE</th>
                  <th className="p-3 text-center">DEC_STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 font-sans">
                {sortedAndFilteredCourses.map(course => (
                  <tr key={course.id} className="hover:bg-slate-900/35 transition">
                    <td className="p-3 font-mono text-[10px] text-slate-500">{course.id}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <img src={course.thumbnail} className="w-7 h-7 rounded object-cover border border-slate-950 shrink-0" alt="" />
                        <div>
                          <p className="font-bold text-white">{course.title}</p>
                          <span className="text-[9.5px] text-slate-500 block truncate max-w-[200px] font-sans">{course.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/20 text-cyan-400 border border-cyan-500/10 uppercase">
                        {course.category}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-white text-right font-bold">${course.price}</td>
                    <td className="p-3 font-mono text-slate-400 text-right">{course.enrolledCount.toLocaleString()}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <img src={course.instructorAvatar} className="w-4 h-4 rounded-full" alt="" />
                        <span className="text-slate-400 text-[10.5px]">{course.instructorName}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-[9px] font-mono px-1.5 py-0.2 bg-emerald-950/20 text-emerald-400 border border-emerald-500/10 rounded">LIVE</span>
                        {onDeleteCourse && course.id.startsWith('course-posted-') && (
                          <button 
                            onClick={() => onDeleteCourse(course.id)}
                            className="p-1 text-slate-500 hover:text-red-400 transition"
                            title="Purge uploaded post"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 2. USERS TABLE */}
          {dbTab === 'users' && (
            <table className="w-full text-xs text-left text-slate-300">
              <thead>
                <tr className="bg-slate-900/40 border-b border-slate-900 text-slate-500 text-[9.5px] font-mono uppercase tracking-wider">
                  <th className="p-3">AVATAR & CADET NAME</th>
                  <th className="p-3">ORGANIZATION EMAIL</th>
                  <th className="p-3 text-center">SYSTEM PRIVILEGE</th>
                  <th className="p-3 text-center">ACTIVE CO_ENROLLED</th>
                  <th className="p-3 text-center">CERT_AWARDS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60">
                {sortedAndFilteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-900/35 transition">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <img src={u.avatar} className="w-7 h-7 rounded-full border border-slate-800" alt="" />
                        <div>
                          <p className="font-bold text-white">{u.name}</p>
                          <span className="text-[10px] text-slate-500 font-mono">NODE_ID: {u.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-slate-400">{u.email}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${u.role === 'Super Admin' ? 'bg-indigo-950/30 text-indigo-400 border border-indigo-550' : u.role === 'Teacher' ? 'bg-cyan-950/30 text-cyan-400 border border-cyan-550' : 'bg-slate-900 text-slate-300'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-400 text-center">{u.enrolledCourses.length} programs</td>
                    <td className="p-3 font-mono text-amber-500 text-center font-bold">★ {u.certificates.length || 1} Crypts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 3. BILLING TABLE */}
          {dbTab === 'billing' && (
            <table className="w-full text-xs text-left text-slate-300">
              <thead>
                <tr className="bg-slate-900/40 border-b border-slate-900 text-slate-500 text-[9.5px] font-mono uppercase tracking-wider">
                  <th className="p-3">INVOICE_ID</th>
                  <th className="p-3">CLIENT SENDER</th>
                  <th className="p-3">curriculum purchase target</th>
                  <th className="p-3 text-right">FEE AMOUNT</th>
                  <th className="p-3 text-center">SECURITY CODE</th>
                  <th className="p-3 text-center">LEDGER_STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60">
                {sortedAndFilteredTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-900/35 transition">
                    <td className="p-3 font-mono text-[10px] text-slate-500">{tx.id}</td>
                    <td className="p-3 text-white font-semibold">{tx.userName}</td>
                    <td className="p-3 text-slate-400 truncate max-w-[200px]">{tx.courseTitle}</td>
                    <td className="p-3 font-mono text-emerald-400 text-right font-bold">${tx.amount} USD</td>
                    <td className="p-3 font-mono text-center text-slate-500">{tx.paymentMethod} {tx.couponCode && `(${tx.couponCode})`}</td>
                    <td className="p-3 text-center">
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${tx.status === 'Completed' ? 'bg-emerald-950/20 text-emerald-400' : 'bg-red-950/20 text-red-400'}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 4. SYSTEM LOGS TABLE */}
          {dbTab === 'telemetry' && (
            <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto font-mono text-[10px] text-cyan-400">
              {securityLogs.map(log => (
                <div key={log.id} className="p-2 border border-slate-900/80 bg-slate-950 rounded flex justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-slate-200"><span className="text-cyan-500 font-bold">[{log.severity}]</span> - {log.event}</p>
                    <p className="text-[9px] text-slate-600">CLIENT ADDR: {log.ipAddress} | WEB_AGENT: {log.userAgent}</p>
                  </div>
                  <span className="text-[9px] text-slate-500">{log.timestamp}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
