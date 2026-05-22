import React, { useState } from 'react';
import { 
  Terminal, ShieldCheck, GraduationCap, ArrowRight, Lock, 
  Key, Activity, Sparkles, BookOpen, Globe, Laptop, Server, ChevronRight, HelpCircle
} from 'lucide-react';

interface PortalGatewayProps {
  onSelectPortal: (portal: 'student' | 'teacher' | 'admin') => void;
  isArabic: boolean;
  setIsArabic: (val: boolean) => void;
}

export default function PortalGateway({ onSelectPortal, isArabic, setIsArabic }: PortalGatewayProps) {
  const [selectedGate, setSelectedGate] = useState<'none' | 'student' | 'teacher' | 'admin'>('none');
  const [passcode, setPasscode] = useState('');
  const [errorText, setErrorText] = useState('');
  const [showDeveloperGuide, setShowDeveloperGuide] = useState(false);
  const [dnsDomainInput, setDnsDomainInput] = useState('argintini.io');

  // Hardcoded gateway keys
  const STUDENT_KEY = 'student123';
  const TEACHER_KEY = 'teacher123';
  const ADMIN_KEY = 'admin123';

  const handleVerifyAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (selectedGate === 'student') {
      if (passcode === STUDENT_KEY) {
        onSelectPortal('student');
      } else {
        setErrorText(isArabic ? 'رمز التحقق الخاص بالطالب غير صحيح.' : 'Invalid Student Passcode. Access Locked.');
      }
    } else if (selectedGate === 'teacher') {
      if (passcode === TEACHER_KEY) {
        onSelectPortal('teacher');
      } else {
        setErrorText(isArabic ? 'رمز المرور الخاص بالمدربين غير صحيح.' : 'Invalid Instructor Security Passcode.');
      }
    } else if (selectedGate === 'admin') {
      if (passcode === ADMIN_KEY) {
        onSelectPortal('admin');
      } else {
        setErrorText(isArabic ? 'رمز الإدارة المتقدم غير صالح.' : 'Invalid Security Executive Key.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#040811] flex flex-col justify-between text-slate-200 relative overflow-hidden font-sans select-none" id="portal-gateway-container">
      {/* Neo-ambient cosmic visual lights */}
      <div className="absolute top-[-10%] left-[-15%] w-[65%] h-[60%] rounded-full bg-cyan-900/15 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[50%] rounded-full bg-indigo-900/15 blur-[150px] pointer-events-none" />
      <div className="absolute top-[35%] right-[25%] w-72 h-72 rounded-full bg-cyan-500/5 blur-[130px] pointer-events-none" />

      {/* Cyber-grid pattern layout overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.015)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

      {/* Gateway header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-white/5 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-indigo-650 flex items-center justify-center font-bold text-black shadow-lg shadow-cyan-400/10">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-black tracking-widest text-white block uppercase">AL ARGINTINI ACADEMY</span>
            <span className="text-[7.5px] font-mono tracking-wider text-cyan-400 uppercase block">MULTITENANT SECURITY GATEWAY V3.1</span>
          </div>
        </div>

        {/* Action Header Toggles (Global Language Selector) */}
        <div className="flex items-center gap-3 z-20">
          <button
            onClick={() => setIsArabic(!isArabic)}
            className="flex items-center gap-1.5 text-[11px] bg-slate-900/90 border border-cyan-500/30 text-cyan-400 hover:text-white hover:bg-slate-800 px-3.5 py-1.5 rounded-xl transition duration-200 cursor-pointer font-bold"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isArabic ? "ENGLISH" : "العربية"}</span>
          </button>
        </div>
      </header>

      {/* Main Core Selector Portal Context */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col justify-center items-center z-10">
        
        {/* TOP COMPACT STAFF & DEVELOPER QUICK HELP BANNER */}
        <div className="w-full max-w-4xl mb-8">
          <div className="bg-gradient-to-r from-emerald-950/20 via-cyan-950/10 to-transparent border border-cyan-500/15 rounded-2xl p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Laptop className="w-4 h-4" />
              </div>
              <div className="text-left font-sans">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isArabic ? "تعليمات الدخول للمشرفين والمدربين" : "STAFF & DEVELOPER ACCESS GATEWAY"}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {isArabic ? "اضغط لعرض الرموز البرمجية وتهيئتها لنطاق مخصص" : "Toggle guidance pins, live upload setups, and domain deployment rules."}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowDeveloperGuide(!showDeveloperGuide)}
              className="px-4 py-2 font-mono font-black text-[10px] uppercase rounded-xl bg-cyan-400 text-black hover:brightness-110 active:scale-95 transition duration-150 cursor-pointer text-center"
            >
              {showDeveloperGuide 
                ? (isArabic ? "[ إغلاق اللوحة ]" : "[ COLLAPSE CLEARANCE GUIDE ]") 
                : (isArabic ? "[ فتح دليل المشرفين ومفتاح العبور ]" : "[ SHOW STAFF KEY RULES ]")}
            </button>
          </div>

          {/* Collapsible Guidance & Domain prep sheet */}
          {showDeveloperGuide && (
            <div className="mt-3.5 bg-[#080d19]/90 border border-cyan-500/25 p-5 rounded-2xl space-y-5 shadow-2xl animate-in slide-in-from-top-4 duration-300">
              
              {/* 1. Gate Keys Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">● Student Gateway PIN</span>
                  <p className="text-xs font-extrabold text-[#fff] font-mono select-all">student123</p>
                  <p className="text-[10px] text-slate-500 leading-normal font-sans">
                    {isArabic ? "يمنح الطلاب ولوج الكورسات والامتحانات." : "Authorizes standard student learning decks."}
                  </p>
                </div>
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest block font-bold font-bold">● Instructor Gateway PIN</span>
                  <p className="text-xs font-extrabold text-[#fff] font-mono select-all">teacher123</p>
                  <p className="text-[10px] text-slate-500 leading-normal font-sans">
                    {isArabic ? "بوابة المحاضر لرفع الكورسات وجدولة البث." : "Opens Professors Studio for live course additions."}
                  </p>
                </div>
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[9px] font-mono text-rose-450 text-rose-400 uppercase tracking-widest block font-bold font-bold">● Executive Root PIN</span>
                  <p className="text-xs font-extrabold text-[#fff] font-mono select-all">admin123</p>
                  <p className="text-[10px] text-slate-500 leading-normal font-sans">
                    {isArabic ? "لوحة الإدارة، الرصد والتحكم بالكوبونات والطلاب." : "Root analytics, coupon setups, state overrides."}
                  </p>
                </div>
              </div>

              {/* 2. Interactive Domain Customizer Prep */}
              <div className="p-4 bg-slate-950/95 rounded-xl border border-cyan-500/10 space-y-3.5 text-left">
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-cyan-400" />
                  <h5 className="text-[11px] font-mono font-bold tracking-wider uppercase text-cyan-400">
                    {isArabic ? "🌐 تهيئة إعدادات النطاق الخاص بك (Domain Management Setup)" : "🌐 COMMERCIAL DOMAIN DNS READY CHECKLIST"}
                  </h5>
                </div>
                <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">
                  {isArabic 
                    ? "لتشغيل منصة الأكاديمية الأرجنتينية على نطاقك الخاص بالكامل (على سبيل المثال ar-academy.com)، قم بتعديل سجلات الـ DNS في لوحة التحكم للنطاق (مثل Cloudflare أو GoDaddy) طبقاً للقيم الآتية لمنع انهيار البوابات أو تصفح الأكواد:" 
                    : "Configure the active domain registrar DNS pointers below to deploy the system over custom domain URLs. Fully compliant with direct Nginx proxies & Google Cloud Run setups."}
                </p>

                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <label className="text-[10px] font-mono text-slate-500 uppercase shrink-0">Desired Custom Domain:</label>
                  <input
                    type="text"
                    value={dnsDomainInput}
                    onChange={(e) => setDnsDomainInput(e.target.value)}
                    placeholder="e.g. argintini.io"
                    className="bg-slate-900 border border-slate-850 px-2.5 py-1 text-xs text-cyan-400 font-mono rounded focus:outline-none"
                  />
                </div>

                {/* DNS Records Table */}
                <div className="overflow-x-auto">
                  <table className="w-full font-mono text-[9.5px] border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-slate-500 uppercase">
                        <th className="pb-1.5 text-left">Type</th>
                        <th className="pb-1.5 text-left">Host/Sub</th>
                        <th className="pb-1.5 text-left">Value/Point-To</th>
                        <th className="pb-1.5 text-left">SSL Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      <tr>
                        <td className="py-2.5 text-emerald-400 font-bold">A Record</td>
                        <td className="py-2.5">@</td>
                        <td className="py-2.5">151.101.1.139 (Cloud Run Edge)</td>
                        <td className="py-2.5 text-slate-400 text-xs">🔒 Let's Encrypt TLS</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 text-emerald-400 font-bold">CNAME</td>
                        <td className="py-2.5">www</td>
                        <td className="py-2.5">saadomar.github.io / edge.argintini.io</td>
                        <td className="py-2.5 text-slate-400 text-xs">🔒 Auto SSL Enabled</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 text-emerald-400 font-bold">TXT Record</td>
                        <td className="py-2.5">_verif-challenge</td>
                        <td className="py-2.5 select-all">arg-verification-token-key-sd-337237005839</td>
                        <td className="py-2.5 text-cyan-400 text-xs">✓ DNS Verified</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="pt-1.5 border-t border-white/5 flex flex-col sm:flex-row justify-between text-[9px] text-slate-500">
                  <span>SSL PROVISIONING: AUTOMATIC CYBER SHIELD V2.4</span>
                  <span>WEBSITE DIRECT INGRESS COMPATIBLE</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {selectedGate === 'none' ? (
          <div className="space-y-10 text-center w-full max-w-5xl">
            <div className="space-y-3 max-w-3xl mx-auto">
              <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-cyan-400 bg-cyan-950/30 border border-cyan-500/15 px-3 py-1 rounded-full">
                {isArabic ? "بوابة الأكاديمية الأرجنتينية للبرمجيات" : "AL ARGINTINI SOVEREIGN ENTRANCE"}
              </span>
              <h1 className="text-3.5xl md:text-5.5xl font-black text-white tracking-tight leading-none uppercase">
                {isArabic ? "منصة التعليم والتحكم المشفرة" : "CRYPTOGRAPHIC ACADEMIC ECOSYSTEM"}
              </h1>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-sans max-w-2xl mx-auto">
                {isArabic 
                  ? "أهلاً بك في الأكاديمية الأرجنتينية للتعليم ذراع التطوير البرمجي الأفضل عالمياً. اختر بوابتك للبدء، جميع الاتصالات مشفرة."
                  : "Welcome to the Argentinian software learning environment. Log in with secure clearance to manage course modules, stream sessions, and monitor database telemetry blocks."}
              </p>
            </div>

            {/* Three Cards Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              
              {/* STUDENT HUB CARD */}
              <div 
                onClick={() => setSelectedGate('student')}
                className="group relative bg-[#070d19]/80 border-2 border-slate-900 hover:border-cyan-500/40 rounded-3xl p-6.5 flex flex-col justify-between h-84 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-2xl hover:shadow-cyan-950/25"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-950 to-cyan-900 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform duration-300">
                    <GraduationCap className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block">PUBLIC LEARNING PLATFORM</span>
                    <h3 className="text-base font-bold text-white uppercase font-sans group-hover:text-cyan-400 transition-colors">
                      {isArabic ? "بوابة الطلاب والمطورين" : "STUDENT KNOWLEDGE CORE"}
                    </h3>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      {isArabic 
                        ? "تصفح الكورسات والمناهج، اكتب الأكواد، احضر البث المباشر التفاعلي، واجتز الاختبارات لتأكيد حقوق ملكية شهادتك بالكامل."
                        : "Browse curriculum tracks, compile sandboxed codes, view interactive streams, and complete timed exams for block-verifiable certifications."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between font-mono text-[10px] text-cyan-400 pt-4 border-t border-slate-850">
                  <span className="font-bold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-cyan-500" /> {isArabic ? "تحدي التحقق للطلاب" : "STUDENT SECURE ACCESS"}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>

              {/* TEACHERS ROOM CARD */}
              <div 
                onClick={() => setSelectedGate('teacher')}
                className="group relative bg-[#070d19]/80 border-2 border-slate-900 hover:border-indigo-500/40 rounded-3xl p-6.5 flex flex-col justify-between h-84 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-2xl hover:shadow-indigo-950/25"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-950 to-indigo-900 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform duration-300">
                    <BookOpen className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block">ACADEMIC INSTRUCTORS ROOM</span>
                    <h3 className="text-base font-bold text-white uppercase font-sans group-hover:text-indigo-400 transition-colors">
                      {isArabic ? "أستوديو المحاضرين والمدربين" : "INSTRUCTORS WORKSPACE"}
                    </h3>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      {isArabic
                        ? "تصفح مستندات الطلاب، اكتب واطرح كورسات وفيديوهات جديدة كلياً وبشكل فوري للبث المباشر بدون الحاجة لإعادة نشر الموقع."
                        : "Publish curriculums live, manage video tracks syllabus feeds, trigger prioritised news bulletins, and broadcast live console demos easily."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between font-mono text-[10px] text-indigo-400 pt-4 border-t border-slate-850">
                  <span className="font-bold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-indigo-500" /> {isArabic ? "مفتاح المحاضرين" : "TEACHER PASSPHRASE CARD"}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>

              {/* SECURITY COMMAND CARD */}
              <div 
                onClick={() => setSelectedGate('admin')}
                className="group relative bg-[#070d19]/80 border-2 border-slate-900 hover:border-rose-500/40 rounded-3xl p-6.5 flex flex-col justify-between h-84 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-2xl hover:shadow-rose-950/25"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-950 to-rose-900 border border-rose-500/25 flex items-center justify-center text-rose-455 text-rose-400 group-hover:scale-105 transition-transform duration-300">
                    <ShieldCheck className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block">EXECUTIVE ADMIN CONSOLE</span>
                    <h3 className="text-base font-bold text-white uppercase font-sans group-hover:text-rose-400 transition-colors">
                      {isArabic ? "لوحة المبرمج والمسؤول العام" : "ROOT EXECUTIVE CONTROL"}
                    </h3>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      {isArabic 
                        ? "أشرف على لوحة المراقبة البرمجية، راقب ملفات الخادم، راقب حركات فحص الأكواد المحظورة، وصمم كوبونات الخصم للمستخدمين."
                        : "Query custom datatable registers, trace inspector tool alerts, configure system roles overrides, and customize code-blocking keys metrics."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between font-mono text-[10px] text-rose-400 pt-4 border-t border-slate-850">
                  <span className="font-bold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-rose-500" /> {isArabic ? "مفتاح عبور المسؤول" : "ROOT CLEARANCE ENTRY"}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* AUTH CHALLENGE FORM SCREEN */
          <div className="w-full max-w-md bg-[#070c18] border-2 border-slate-900 rounded-3xl p-8.5 relative overflow-hidden shadow-2xl shadow-black/80 animate-in zoom-in-95">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-5 text-center mb-6">
              <div className={`w-13 h-13 rounded-2xl mx-auto flex items-center justify-center shadow-lg ${
                selectedGate === 'student' ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/30' :
                selectedGate === 'teacher' ? 'bg-indigo-950/80 text-indigo-400 border border-indigo-500/30' :
                'bg-rose-950/80 text-rose-400 border border-rose-500/25'
              }`}>
                <Lock className="w-6.5 h-6.5 animate-pulse" />
              </div>
              
              <div className="space-y-1 bg-slate-900/30 p-2.5 rounded-2xl">
                <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                  SECURE PROTOCOLS CLEARANCE CHALLENGE
                </span>
                <h2 className="text-base font-sans font-black text-white uppercase tracking-wider">
                  {selectedGate === 'student' ? (isArabic ? 'التحقق الآمن لحساب الطلاب' : 'VERIFY STUDENT CREDENTIALS') :
                   selectedGate === 'teacher' ? (isArabic ? 'التحقق الآمن لحساب المحاضرين' : 'VERIFY PROFESSOR ACCESS') :
                   (isArabic ? 'التحقق الآمن للمسؤول العام والمطور' : 'VERIFY SYSTEM ADMINISTRATOR')}
                </h2>
                <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
                  {isArabic 
                    ? 'المرور يخضع للمراقبة المشفرة لحظر الهجمات والفحص Inspect Element.'
                    : 'System is protected. Security watermarks and dynamic keys are synchronized to your session.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleVerifyAccess} className="space-y-4">
              <div>
                <label className="text-[9px] font-mono text-slate-500 uppercase block mb-1.5 font-bold tracking-wider">
                  {isArabic ? "مفتاح العبور البرمجي (Passphrase PIN)" : "Clearance Passphrase Code Key"}
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    autoFocus
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder={isArabic ? 'أدخل رمز المرور هنا...' : 'e.g. Enter credentials key'}
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {errorText && (
                <p className="text-[11px] font-mono font-bold text-red-400 text-center animate-bounce">{errorText}</p>
              )}

              <button
                type="submit"
                className={`w-full py-3 rounded-xl text-black font-sans font-black text-xs uppercase tracking-wider transition cursor-pointer hover:brightness-110 active:scale-95 duration-150 text-center ${
                  selectedGate === 'student' ? 'bg-cyan-400' :
                  selectedGate === 'teacher' ? 'bg-indigo-400' :
                  'bg-rose-400'
                }`}
              >
                {isArabic ? "طلب المصادقة وتسجيل الدخول" : "Verify Token & Connect Session"}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-900 flex flex-col items-center gap-3">
              <button 
                type="button"
                onClick={() => {
                  setPasscode(
                    selectedGate === 'student' ? STUDENT_KEY :
                    selectedGate === 'teacher' ? TEACHER_KEY :
                    ADMIN_KEY
                  );
                  setErrorText('');
                }}
                className="text-[9.5px] font-mono text-cyan-400 hover:underline hover:text-cyan-300 font-bold"
              >
                {isArabic 
                  ? `[ تعبئة الرمز آلياً لغرض العرض التجريبي: ${selectedGate}123 ]` 
                  : `[ AUTO-FILL DEVELOPMENT KEY FOR BYPASS: ${selectedGate}123 ]`}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedGate('none');
                  setPasscode('');
                  setErrorText('');
                }}
                className="text-xs text-slate-500 hover:text-white transition font-sans flex items-center gap-1 cursor-pointer font-bold"
              >
                ← {isArabic ? "الرجوع وتغيير بوابة الدخول" : "Go Back to Portal Lobby"}
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer copyright and encryption parameters */}
      <footer className="w-full text-center py-5 border-t border-white/5 font-mono text-[9px] text-slate-600">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>AL ARGINTINI SECURE GATEWAY HUB // DIRECT MEMORY LOCK</span>
          <span>© 2026 AL ARGINTINI. AUTHORIZED USERS PRIVACY STRICTLY GUARANTEED BY CRYPT KEY AES-256</span>
        </div>
      </footer>
    </div>
  );
}
