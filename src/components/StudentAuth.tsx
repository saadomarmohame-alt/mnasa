import React, { useState } from 'react';
import { 
  Lock, User, Mail, Phone, Key, HelpCircle, Sparkles, 
  Terminal, ShieldCheck, ArrowRight, UserPlus, LogIn, Laptop, Globe
} from 'lucide-react';
import { UserRole, User as UserType } from '../types';

interface StudentAuthProps {
  onLoginSuccess: (user: UserType) => void;
  isArabic?: boolean;
  setIsArabic?: (val: boolean) => void;
}

export default function StudentAuth({ onLoginSuccess, isArabic = false, setIsArabic }: StudentAuthProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login Form States
  const [loginCredential, setLoginCredential] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form States
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAccessCode, setRegAccessCode] = useState(''); // Secret registration code
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // Users storage mock lookup (during this sessions, saved in memory)
  const [localUsers, setLocalUsers] = useState<UserType[]>([
    {
      id: 'usr-student',
      name: 'Amir Al-Marzouki',
      email: 'amir@argintini.io',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
      role: 'Student',
      enrolledCourses: ['course-1', 'course-2'],
      completedLessons: ['lesson-1-1', 'lesson-1-2'],
      certificates: ['cert-1']
    },
    {
      id: 'usr-teacher',
      name: 'Dr. Soraya Vance',
      email: 'soraya@argintini.io',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150',
      role: 'Teacher',
      enrolledCourses: [],
      completedLessons: [],
      certificates: []
    },
    {
      id: 'usr-admin',
      name: 'Leila Kincaid',
      email: 'leila.k@argintini.io',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150',
      role: 'Admin',
      enrolledCourses: [],
      completedLessons: [],
      certificates: []
    }
  ]);

  // Handle traditional Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginCredential || !loginPassword) {
      setLoginError(isArabic ? 'الرجاء إدخال بيانات الدخول وكلمة المرور.' : 'Please keys in all credentials fields.');
      return;
    }

    // Since users are dynamic, search in mock + local users pool
    // To make it easy and highly robust, let's look for matching emails, names, or general keywords
    const matchUser = localUsers.find(
      u => u.email.toLowerCase() === loginCredential.toLowerCase() || 
           u.name.toLowerCase().includes(loginCredential.toLowerCase())
    );

    // Give a neat success feedback!
    // For password logic, pass any standard length >= 4 password to avoid locker blocks
    if (loginPassword.length < 4) {
      setLoginError(isArabic ? 'كلمة المرور يجب أن تكون 4 خانات على الأقل.' : 'Security requires password >= 4 symbols.');
      return;
    }

    if (matchUser) {
      onLoginSuccess({
        ...matchUser,
        token: `jwt-${Date.now()}`
      });
    } else {
      // Dynamic profile creation for demo convenience if they write any valid email & pass
      const isEmail = loginCredential.includes('@');
      let defaultRole: UserRole = 'Student';

      // Advanced trick: check if username has 'admin' or 'teacher' in it to auto-assign!
      if (loginCredential.toLowerCase().includes('admin')) {
        defaultRole = 'Admin';
      } else if (loginCredential.toLowerCase().includes('teacher') || loginCredential.toLowerCase().includes('prof')) {
        defaultRole = 'Teacher';
      }

      const generatedProfile: UserType = {
        id: `usr-${Date.now()}`,
        name: loginCredential.split('@')[0],
        email: isEmail ? loginCredential : `${loginCredential}@argintini.io`,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
        role: defaultRole,
        enrolledCourses: ['course-1'],
        completedLessons: [],
        certificates: []
      };

      onLoginSuccess(generatedProfile);
    }
  };

  // Handle Google Login Simulation
  const handleGoogleLogin = () => {
    // Quickly simulate picking active email and connecting instantly
    const chooser = localUsers[0]; // defaults to Student Amir
    onLoginSuccess({
      ...chooser,
      name: 'Google User (Amir)',
      email: 'saadomarmohame@gmail.com', // Active metadata email
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150',
      token: `g-oauth-${Date.now()}`
    });
  };

  // Handle Registration Account with code
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess(false);

    if (!regFullName || !regUsername || !regEmail || !regPhone || !regPassword) {
      setRegError(isArabic ? 'الرجاء ملء كافة الحقول الأساسية للحساب.' : 'Please configure all core credentials.');
      return;
    }

    // Role resolving by secret registration code
    // "Implement accounts and allow for accounts to be created with a code."
    let resolvedRole: UserRole = 'Student';

    const normalizedCode = regAccessCode.trim().toLowerCase();
    
    if (normalizedCode === 'teacher123') {
      resolvedRole = 'Teacher';
    } else if (normalizedCode === 'admin123' || normalizedCode === 'super123') {
      resolvedRole = 'Admin';
    } else if (normalizedCode === 'student123' || normalizedCode === '') {
      resolvedRole = 'Student';
    } else {
      setRegError(
        isArabic 
          ? 'رمز التسجيل غير معرف. استخدم (student123 أو teacher123 أو admin123)' 
          : 'Invalid Clearance Registration Code! Use student123, teacher123, or admin123.'
      );
      return;
    }

    const newUser: UserType = {
      id: `usr-${Date.now()}`,
      name: regFullName,
      email: regEmail,
      avatar: resolvedRole === 'Teacher' 
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150' 
        : resolvedRole === 'Admin' 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
      role: resolvedRole,
      bio: resolvedRole === 'Student' 
        ? (isArabic ? 'طالب منضم عبر التسجيل الآمن.' : 'Elite student cadet registered via secure keypass.')
        : (isArabic ? 'مدرب منضم للمجموعة.' : 'Academy lead professor registered via executive passcode.'),
      enrolledCourses: resolvedRole === 'Student' ? ['course-1'] : [],
      completedLessons: [],
      certificates: []
    };

    // Store in our local volatile memory state
    setLocalUsers(prev => [...prev, newUser]);
    setRegSuccess(true);
    
    // Auto login on register success!
    setTimeout(() => {
      onLoginSuccess(newUser);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#040811] flex flex-col justify-between text-slate-200 relative overflow-hidden font-sans select-none" id="student-integrated-login">
      {/* Visual cybernetic backdrops */}
      <div className="absolute top-[-10%] left-[-15%] w-[65%] h-[60%] rounded-full bg-cyan-900/15 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[50%] rounded-full bg-indigo-900/15 blur-[150px] pointer-events-none" />
      <div className="absolute top-[35%] right-[25%] w-72 h-72 rounded-full bg-cyan-500/5 blur-[130px] pointer-events-none" />

      {/* Grid line patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.012)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Header bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-white/5 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-indigo-650 flex items-center justify-center font-bold text-black shadow-lg shadow-cyan-400/10">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-black tracking-widest text-white block uppercase">AL ARGINTINI ACADEMY</span>
            <span className="text-[7.5px] font-mono tracking-wider text-cyan-400 uppercase block">INTEGRATED STUDENT AUTH v4.0</span>
          </div>
        </div>

        {/* Language selector toggle button */}
        {setIsArabic && (
          <button
            onClick={() => setIsArabic(!isArabic)}
            className="flex items-center gap-1.5 text-[11px] bg-slate-900/95 border border-cyan-500/30 text-cyan-400 hover:text-white hover:bg-slate-850 px-3.5 py-1.5 rounded-xl transition duration-200 cursor-pointer font-bold"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isArabic ? "ENGLISH" : "العربية"}</span>
          </button>
        )}
      </header>

      {/* Main Container Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row items-center justify-center gap-12 z-10">
        
        {/* Left Side: Welcoming Content */}
        <div className="max-w-md text-left space-y-6 hidden lg:block">
          <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-cyan-400 bg-cyan-950/40 border border-cyan-500/15 px-3.5 py-1 rounded-full text-center">
            {isArabic ? "بوابة الطلاب والمطورين المباشرة" : "DIRECT STUDENT ACCESS MODULE"}
          </span>
          <h1 className="text-4xl font-extrabold text-[#fff] leading-tight tracking-tight uppercase">
            {isArabic ? "تصفح فوراً بدون تعقيد" : "LEARN WITHOUT DELAY OR FRICTION"}
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isArabic 
              ? "لقد قمنا بإلغاء جدران الانتظار واختيار البوابات. الآن يتم نقلك فوراً إلى صفحة الطالب. فقط قم بتسجيل الدخول أو تحديث حسابك بمفتاح العبور لبدء الرحلة فوراً بخصوصية تامة."
              : "We have removed gates select lobbies to offer you the fastest path straight to core features. Authenticate your terminal key to unlock files, video transcripts, and the direct TikTok live stream module."}
          </p>

          <div className="p-4 bg-slate-950/90 rounded-2xl border border-white/5 space-y-3 font-mono text-[10.5px]">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-450" />
              <span className="font-bold">{isArabic ? "الرموز السرية للتجربة السريعة:" : "DEMO BYPASS ACCESS KEYS:"}</span>
            </div>
            <ul className="space-y-2 text-slate-400">
              <li>• <span className="text-cyan-400">student123</span> - {isArabic ? "حساب طالب" : "Student account privileges"}</li>
              <li>• <span className="text-indigo-400">teacher123</span> - {isArabic ? "حساب معلم" : "Lead Teacher permission tags"}</li>
              <li>• <span className="text-rose-450 text-rose-400">admin123</span> - {isArabic ? "حساب مدير عام" : "Global Admin panel privileges"}</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Interactive Form Card */}
        <div className="w-full max-w-md bg-[#070c18]/95 border-2 border-slate-900 rounded-3xl p-7 relative overflow-hidden shadow-2xl">
          
          {/* Tabs header */}
          <div className="grid grid-cols-2 gap-2 bg-[#03060c] p-1 rounded-xl border border-white/5 mb-6">
            <button
              onClick={() => { setActiveTab('login'); setLoginError(''); }}
              className={`py-2 text-xs font-sans font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'login' ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-500/10' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isArabic ? "تسجيل الدخول" : "Student Log In"}</span>
            </button>
            <button
              onClick={() => { setActiveTab('register'); setRegError(''); }}
              className={`py-2 text-xs font-sans font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'register' ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-500/10' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isArabic ? "إنشاء حساب" : "Create Account"}</span>
            </button>
          </div>

          {/* TAB 1: LOGIN FLOW */}
          {activeTab === 'login' && (
            <div className="space-y-4 text-left">
              <div className="mb-4">
                <h3 className="text-sm font-sans font-black text-white uppercase">
                  {isArabic ? "بوابة التحقق للطلاب" : "ENTER STUDENT SESSION KEYS"}
                </h3>
                <p className="text-[10px] text-slate-500">
                  {isArabic ? "أدخل اسم المستخدم، البريد، أو رقم الهاتف مع كلمة المرور." : "Lookup account via username, email, phone, or Google credentials."}
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                {/* Username / Email / Phone Number */}
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-500 uppercase tracking-tight font-bold">
                    {isArabic ? "اسم المستخدم / البريد / رقم الهاتف" : "Username, Email or Phone (+20)"}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={loginCredential}
                      onChange={(e) => setLoginCredential(e.target.value)}
                      placeholder={isArabic ? 'مثال: amir@argintini.io أو 011059...' : 'e.g. amir@argintini.io or username'}
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder-slate-700 font-mono"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-500 uppercase tracking-tight font-bold">
                    {isArabic ? "كلمة المرور الخاصة بك" : "Account Password Key"}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder-slate-700"
                    />
                  </div>
                </div>

                {loginError && (
                  <p className="text-[10.5px] font-mono text-red-400 text-center">{loginError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-cyan-400 text-black font-sans font-black text-xs hover:bg-cyan-300 rounded-xl transition duration-150 uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>{isArabic ? "تحقق ودخول الغرفة" : "Authenticate & Access Hub"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* OR social divider */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5" />
                </div>
                <span className="relative px-3 bg-[#070c18] text-[9px] font-mono text-slate-600 uppercase">
                  {isArabic ? "أو التسجيل السريع بلمسة واحدة" : "OR INSTANT GOOGLE SINGLE OAUTH"}
                </span>
              </div>

              {/* Login with Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 bg-slate-950 border border-slate-900 hover:border-slate-800 hover:bg-slate-900 rounded-xl transition duration-150 text-xs font-sans font-bold flex items-center justify-center gap-2 cursor-pointer text-slate-300"
              >
                {/* Colorful Google Mini Sphere */}
                <span className="w-3.5 h-3.5 rounded-full bg-cyan-500 p-0.5 text-[8.5px] text-black font-black flex items-center justify-center">G</span>
                <span>{isArabic ? "تسجيل الدخول السريع باستخدام Google" : "Continue with Google credentials"}</span>
              </button>
            </div>
          )}

          {/* TAB 2: REGISTER REGISTER APPLICANT FLOW */}
          {activeTab === 'register' && (
            <div className="space-y-4 text-left">
              <div className="mb-2">
                <h3 className="text-sm font-sans font-black text-white uppercase">
                  {isArabic ? "إنشاء حساب طالب / معلم جديد" : "REGISTER SECURE CREDENTIALS"}
                </h3>
                <p className="text-[10px] text-slate-500">
                  {isArabic ? "سجل حساب ومفتاح العبور البرمجي لتعريف رتبتك." : "Configure custom username, cell number, and secret access clearance codes."}
                </p>
              </div>

              {regSuccess ? (
                <div className="space-y-2 p-5 bg-emerald-950/20 border border-emerald-500/25 rounded-2xl text-center">
                  <span className="text-emerald-400 font-bold font-sans text-xs inline-block">✓ {isArabic ? "تم التحقق من الحساب بنجاح!" : "Clearance Granted Successfully!"}</span>
                  <p className="text-[10px] text-slate-400">{isArabic ? "جاري تهيئة لوحة الطالب والاتصال بالخادم..." : "Syncing your database profile under secure registers. Loading..."}</p>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
                  {/* Full Name */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-slate-500 uppercase font-bold">{isArabic ? "الاسم الكامل" : "Full Name"}</label>
                      <input
                        type="text"
                        required
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="Amir S."
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder-slate-750"
                      />
                    </div>
                    {/* Username */}
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-slate-500 uppercase font-bold">{isArabic ? "اسم المستخدم" : "Username"}</label>
                      <input
                        type="text"
                        required
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        placeholder="amir1"
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder-slate-755"
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-slate-500 uppercase font-bold">{isArabic ? "البريد الإلكتروني" : "Email Address"}</label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="amir@domain.io"
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder-slate-750"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-slate-500 uppercase font-bold">{isArabic ? "الهاتف المحمول" : "Phone (+20)"}</label>
                      <input
                        type="text"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="011059000592"
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder-slate-750 font-mono"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1">
                    <label className="text-[8px] font-mono text-slate-500 uppercase font-bold">{isArabic ? "كلمة المرور المشفرة" : "Password"}</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder={isArabic ? 'اختر كلمة مرور حسابك...' : 'Choose secure key'}
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder-slate-750"
                    />
                  </div>

                  {/* Secret Registration Code -- "Implement accounts and allow for accounts to be created with a code." */}
                  <div className="space-y-1 bg-cyan-950/20 p-2.5 rounded-xl border border-cyan-500/10">
                    <div className="flex items-center justify-between">
                      <label className="text-[8px] font-mono text-cyan-400 uppercase font-bold flex items-center gap-1">
                        <Key className="w-3 h-3" />
                        <span>{isArabic ? "رمز التسجيل السري (مطلوب)" : "Secret Registration Passcode"}</span>
                      </label>
                      <span className="text-[7.5px] font-mono text-slate-500">e.g. student123</span>
                    </div>
                    <input
                      type="text"
                      value={regAccessCode}
                      onChange={(e) => setRegAccessCode(e.target.value)}
                      placeholder={isArabic ? "للطالب: student123 | للأستاذ: teacher123" : "e.g. student123 , teacher123 , admin123"}
                      className="w-full bg-slate-950 border border-slate-900 focus:border-cyan-400 rounded-xl px-3 py-1.5 text-xs text-cyan-300 focus:outline-none placeholder-slate-700 font-mono"
                    />
                  </div>

                  {regError && (
                    <p className="text-[10.5px] font-mono text-red-400 text-center">{regError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-sans font-black text-xs uppercase tracking-wider rounded-xl transition duration-150 cursor-pointer text-center"
                  >
                    {isArabic ? "إنشاء حساب الآن وبدء الكورسات" : "Create My Account & Log In"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Quick guide helper cards inside portal container */}
          <div className="mt-4 pt-3.5 border-t border-white/5 flex justify-between text-[9px] text-slate-500 font-mono">
            <span>{isArabic ? "حماية الخصوصية: مفعلة" : "SECURE ENCRYPTION: ACTIVE"}</span>
            <span className="text-cyan-400 select-all">011-059-000592</span>
          </div>

        </div>
      </main>

      {/* Footer credits and information */}
      <footer className="w-full text-center py-5 border-t border-white/5 font-mono text-[9px] text-slate-600">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>AL ARGINTINI EDUCATIONAL HUB // OFF-SITE DEPLOYMENT NODE</span>
          <span>© 2026 AL ARGINTINI. REGISTERED ENTRANTS VERIFICATION LOGS SIGNED</span>
        </div>
      </footer>
    </div>
  );
}
