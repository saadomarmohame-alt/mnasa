import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Sparkles, BookOpen, GraduationCap, Video, 
  Terminal, ShieldCheck, Star, Users, ArrowRight, Bell, 
  Globe, Menu, X, ChevronRight, Lock, DollarSign, Activity, 
  Settings, Key, Flame, LogOut, Search, Play, Laptop, ArrowLeft
} from 'lucide-react';

import { User, UserRole, Course, Quiz, Transaction, SecurityLog, Certificate } from './types';
import { mockUsers, mockCourses, mockQuizzes, mockTransactions, mockSecurityLogs } from './mockData';

// Component imports
import ThreeCanvas from './components/ThreeCanvas';
import CourseCard from './components/CourseCard';
import CustomVideoPlayer from './components/CustomVideoPlayer';
import ActiveExam from './components/ActiveExam';
import LiveStreaming from './components/LiveStreaming';
import AdminPanel from './components/AdminPanel';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import PortalGateway from './components/PortalGateway';
import CustomerSupport from './components/CustomerSupport';
import StudentAuth from './components/StudentAuth';

export default function App() {
  // Global Portals Manager
  const [currentPortal, setCurrentPortal] = useState<'gateway' | 'student' | 'teacher' | 'admin'>('gateway');

  // Global States
  const [isArabic, setIsArabic] = useState(false);
  const [securityToast, setSecurityToast] = useState<{ show: boolean; msgEn: string; msgAr: string } | null>(null);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]); // Amir is student
  const [navigation, setNavigation] = useState<'home' | 'course-detail' | 'classroom' | 'dashboard' | 'live-stream'>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  
  // Custom course section navigation
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  
  // Data State Pools (allows immediate mutations during session)
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>(mockSecurityLogs);
  const [users, setUsers] = useState<User[]>(mockUsers);
  
  // Search state filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // UI States
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<null | 'login' | 'signup'>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');

  // Notifications State pool
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Decentralized Smart Contract Certified!', text: 'Your neural certificate credentials for module 1 have been securely written to ledger blocks.', date: '12m ago', read: false },
    { id: '2', title: 'SQL Injection threat blocked', text: 'Perimeter firewall suppressed unauthorized database enumeration routines.', date: '1h ago', read: false },
    { id: '3', title: 'Dr. Soraya published Lesson 1-5', text: 'You can now study Fine-Tuning LoRA Adapters for Enterprise Scaling.', date: '3h ago', read: true }
  ]);

  // Load custom course posts on launch from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('argintini-custom-courses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Course[];
        if (parsed && parsed.length > 0) {
          setCourses(prev => {
            // Keep existing static courses but merge saved dynamic items
            const filteredPrev = prev.filter(p => !parsed.some(ps => ps.id === p.id));
            return [...parsed, ...filteredPrev];
          });
        }
      } catch (e) {
        console.error('Failed to parse custom dynamic courses.', e);
      }
    }
  }, []);

  // Auto-dismiss security warn toast
  useEffect(() => {
    if (securityToast?.show) {
      const timer = setTimeout(() => {
        setSecurityToast(null);
      }, 5500);
      return () => clearTimeout(timer);
    }
  }, [securityToast]);

  // Intercept right click and devtools combo keys to safeguard intellectual copyright
  useEffect(() => {
    const blockInspect = (e: MouseEvent) => {
      e.preventDefault();
      setSecurityToast({
        show: true,
        msgEn: "ARGENTINA ACADEMY SECURITY: Right-click context menus are disabled globally to protect curriculum videos & code templates.",
        msgAr: "منظومة حماية الأكاديمية الأرجنتينية: تم تعطيل قائمة الماوس الأيمن برمجياً لحماية الملكية الفكرية الحصرية للفيديوهات والشروحات."
      });
      logSecurityEvent("Prevented contextmenu inspect trigger", currentUser.email);
    };

    const blockKeys = (e: KeyboardEvent) => {
      const isF12 = e.keyCode === 123;
      const isI = (e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 73; // Ctrl+Shift+I
      const isC = (e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 67; // Ctrl+Shift+C
      const isJ = (e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 74; // Ctrl+Shift+J
      const isU = (e.ctrlKey || e.metaKey) && e.keyCode === 85; // Ctrl+U (source view)

      if (isF12 || isI || isC || isJ || isU) {
        e.preventDefault();
        setSecurityToast({
          show: true,
          msgEn: "⚠️ FIREWALL RESTRICTION: Dynamic debugger inspection tools and source viewing are blocked on this academic domain.",
          msgAr: "⚠️ حظر أمني: اختصارات المطورين وفحص وعرض الأكواد البرمجية معطلة لحماية ونصرة حقوق المحاضرين الفكرية."
        });
        logSecurityEvent(`Prevented devtool key intercept (Key: ${e.keyCode})`, currentUser.email);
      }
    };

    document.addEventListener('contextmenu', blockInspect);
    document.addEventListener('keydown', blockKeys);
    return () => {
      document.removeEventListener('contextmenu', blockInspect);
      document.removeEventListener('keydown', blockKeys);
    };
  }, [currentUser]);

  // Sync to database logging
  const logSecurityEvent = (eventText: string, userMail = 'anonymous_agent') => {
    const freshLog: SecurityLog = {
      id: `sec-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      event: eventText,
      severity: eventText.toLowerCase().includes('fail') || eventText.toLowerCase().includes('error') ? 'CRITICAL' : 'INFO',
      ipAddress: '192.168.1.1',
      userAgent: navigator.userAgent
    };
    setSecurityLogs(prev => [freshLog, ...prev]);
  };

  // Create course uploaded post custom handler
  const handlePostCourseCreated = (newCourse: Course) => {
    setCourses(prev => {
      const updated = [newCourse, ...prev];
      const dynamicOnly = updated.filter(c => c.isDynamicUpload);
      localStorage.setItem('argintini-custom-courses', JSON.stringify(dynamicOnly));
      return updated;
    });
    logSecurityEvent(`Curriculum course program published: ${newCourse.title}`, currentUser.email);
  };

  // Delete course custom post handler
  const handleDeleteCourse = (courseId: string) => {
    setCourses(prev => {
      const updated = prev.filter(c => c.id !== courseId);
      const dynamicOnly = updated.filter(c => c.isDynamicUpload);
      localStorage.setItem('argintini-custom-courses', JSON.stringify(dynamicOnly));
      return updated;
    });
    // Reset selection if active
    if (selectedCourseId === courseId) {
      setSelectedCourseId(null);
      setNavigation('home');
    }
    logSecurityEvent(`Curriculum course purged: ${courseId}`, currentUser.email);
  };

  // RTL Translations directory (no references to next-gen)
  const t = {
    en: {
      brand: "ARGENTINA SOFTWARE ACADEMY",
      tagline: "Sovereign Learning Systems for Engineering & Security Hubs",
      heroTitle: "ARGENTINIAN ELITE CODE ACADEMY",
      heroSubtitle: "Build cinematic modular projects, deploy hyper-dimensional neural models, and explore centralized relational database explorer sheets at high-end performance.",
      courses: "Academic Modules",
      dashboard: "Personal Terminal",
      enroll: "Unlock Module (EGP Pay-Once)",
      enrolled: "Enrolled & Secure",
      switchRole: "Auth Bypass Switcher",
      features: "Core Features",
      statsTitle: "Autonomous Performance Logs",
      whyUs: "Why Argentina Academy?",
      pricing: "Pay-Per-Course Lifetime Access",
      heroCta: "Initiate Dynamic Exploration",
      searchPlaceholder: "Search curriculum coordinates...",
      students: "Enrolled Graduates",
      passingScore: "Passing Requirement",
      proctored: "Proctor Certified",
      backToHome: "Return to Modules",
      startLearning: "Launch Lecture Stream",
      examLocked: "Exam Access: Complete 100% Course Lessons First"
    },
    ar: {
      brand: "الأكاديمية الأرجنتينية للبرمجيات",
      tagline: "أنظمة التعلم السيادية للبرمجة المتقدمة ومراكز الأمن السيبراني",
      heroTitle: "الأكاديمية الأرجنتينية المعرفية الفاخرة",
      heroSubtitle: "ابنِ مواقع تفاعلية واحترافية، ودرب نماذج ذكاء اصطناعي، واستعرض قواعد البيانات الضخمة مع نظام التصفح والبحث السري بأقصى درجات الكفاءة.",
      courses: "الوحدات الأكاديمية",
      dashboard: "محطة بياناتي الشخصية",
      enroll: "امتلاك المساق (دفع لمرة واحدة)",
      enrolled: "مسجَّل وآمن بالتأكيد",
      switchRole: "مبدل الصلاحيات السريع",
      features: "المميزات الفاخرة",
      statsTitle: "سجلات الأداء السيبراني",
      whyUs: "لماذا تختار الأكاديمية الأرجنتينية؟",
      pricing: "الدفع لكل دورة مدى الحياة",
      heroCta: "ابدأ الاستكشاف المعرفي الآن",
      searchPlaceholder: "ابحث عن كورسات الآي تي والبرمجة والأمن السيبراني...",
      students: "الخريجون المسجلون",
      passingScore: "متطلبات النجاح المعتمدة",
      proctored: "امتحان محمي وموثق",
      backToHome: "العودة لقائمة البرامج الدراسية",
      startLearning: "بدء البث والمحاضرات",
      examLocked: "الامتحان مقفل: أكمل جميع محاضرات الدورة أولاً للتقديم"
    }
  };

  const currentT = isArabic ? t.ar : t.en;

  // Active course calculations
  const activeCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const handleEnrollCourse = (courseId: string) => {
    // Generate simulated billing receipt ledger
    const courseInstance = courses.find((c) => c.id === courseId);
    if (!courseInstance) return;

    const freshReceipt: Transaction = {
      id: `TX-${Math.floor(Math.random() * 900000 + 100000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      courseId: courseInstance.id,
      courseTitle: courseInstance.title,
      amount: courseInstance.price,
      date: new Date().toLocaleDateString(),
      status: 'Completed',
      paymentMethod: 'Stripe'
    };

    setTransactions(prev => [freshReceipt, ...prev]);

    // Mutate user state profiles with dynamic enrollment keys
    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id === currentUser.id) {
          const updated = {
            ...u,
            enrolledCourses: [...u.enrolledCourses, courseId],
          };
          setCurrentUser(updated);
          return updated;
        }
        return u;
      })
    );

    logSecurityEvent(`Authorized course checkout complete. Receipt: ${freshReceipt.id}`, currentUser.email);
    alert(`Payment successful! Course clearances validated. Mapped Transaction ${freshReceipt.id}`);
  };

  const handleCancelEnrollment = (courseId: string) => {
    // Mark transactions as Refunded
    setTransactions(prev =>
      prev.map(t => {
        if (t.userId === currentUser.id && t.courseId === courseId) {
          return { ...t, status: 'Refunded' as const };
        }
        return t;
      })
    );

    // Cancel dynamic profile access
    setUsers(prevUsers =>
      prevUsers.map(u => {
        if (u.id === currentUser.id) {
          const updated = {
            ...u,
            enrolledCourses: u.enrolledCourses.filter(id => id !== courseId),
          };
          setCurrentUser(updated);
          return updated;
        }
        return u;
      })
    );

    logSecurityEvent(`Sovereign Refund clearance: Revoked course node ${courseId}`, currentUser.email);
    alert(`Refund complete. Course revoked. Your money has been fully returned to your account!`);
  };

  const handleMarkLessonComplete = (lessonId: string) => {
    if (currentUser.completedLessons.includes(lessonId)) return;

    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id === currentUser.id) {
          const updated = {
            ...u,
            completedLessons: [...u.completedLessons, lessonId],
          };
          setCurrentUser(updated);
          return updated;
        }
        return u;
      })
    );

    logSecurityEvent(`Lecture state milestone complete: ${lessonId}`, currentUser.email);
  };

  // Course watch criteria calculation progress
  const activeCourseLessons = activeCourse ? activeCourse.sections.flatMap((s) => s.lessons) : [];
  const completedInActive = activeCourseLessons.filter((l) => currentUser.completedLessons.includes(l.id)).length;
  const activeCoursePercent = activeCourseLessons.length 
    ? Math.round((completedInActive / activeCourseLessons.length) * 100) 
    : 0;

  const handleExamCompleted = (score: number, cert: Certificate) => {
    // Write dynamic certificate token to user's collection
    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id === currentUser.id) {
          const updated = {
            ...u,
            certificates: [...u.certificates, cert.id],
          };
          setCurrentUser(updated);
          return updated;
        }
        return u;
      })
    );

    // Track state logs
    logSecurityEvent(`Proctored Exam Complete! Verified Cert Token issued: ${cert.id}`, currentUser.email);
    alert(`CONGRATULATIONS! You passed with ${score}%. A blockchain certificate was securely issued to your profile.`);
  };

  const handlePostAnnouncement = (title: string, text: string) => {
    logSecurityEvent(`Bulletin Broadcast Dispatched: ${title}`, currentUser.email);
  };

  const handleUploadLessonInState = (
    courseId: string,
    sectionTitle: string,
    lessonTitle: string,
    vUrl: string,
    codeSnip: string
  ) => {
    const lessonId = `les-${Date.now()}`;
    const newLesson = {
      id: lessonId,
      title: lessonTitle,
      duration: '18:45 mins',
      videoUrl: vUrl,
      codeTemplate: codeSnip || undefined,
      isPremium: true
    };

    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          // Check if section already exists
          const sectionIdx = c.sections.findIndex((s) => s.title.toLowerCase().trim() === sectionTitle.toLowerCase().trim());
          const updatedSections = [...c.sections];

          if (sectionIdx > -1) {
            updatedSections[sectionIdx] = {
              ...updatedSections[sectionIdx],
              lessons: [...updatedSections[sectionIdx].lessons, newLesson]
            };
          } else {
            updatedSections.push({
              id: `sec-${Date.now()}`,
              title: sectionTitle,
              lessons: [newLesson]
            });
          }

          return { ...c, sections: updatedSections };
        }
        return c;
      })
    );

    logSecurityEvent(`Appended dynamic syllabus lesson: ${lessonTitle} to ${courseId}`, currentUser.email);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) return;

    if (authModal === 'login') {
      // Find matching user or instantiate temporary cadet
      const matched = users.find((u) => u.email.toLowerCase() === authEmail.toLowerCase().trim());
      if (matched) {
        if (matched.isBanned) {
          alert('ACCESS RESTRICTED: Your profile access node has been suspended by system administrators.');
          return;
        }
        setCurrentUser(matched);
        logSecurityEvent(`Session key authenticated for user: ${matched.email}`, matched.email);
      } else {
        const temp: User = {
          id: `usr-${Date.now()}`,
          name: authEmail.split('@')[0].toUpperCase(),
          email: authEmail.trim(),
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
          role: 'Student',
          bio: 'Session Cadet. Profile synced over proxy bypass.',
          enrolledCourses: [],
          completedLessons: [],
          certificates: []
        };
        setUsers(prev => [...prev, temp]);
        setCurrentUser(temp);
        logSecurityEvent(`Cadet session proxy created: ${temp.email}`, temp.email);
      }
    } else {
      // Signup
      const fresh: User = {
        id: `usr-${Date.now()}`,
        name: authName.trim() || 'New Cadet',
        email: authEmail.trim(),
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
        role: 'Student',
        bio: 'Self enrolled Cadet network credentials.',
        enrolledCourses: [],
        completedLessons: [],
        certificates: []
      };
      setUsers(prev => [...prev, fresh]);
      setCurrentUser(fresh);
      logSecurityEvent(`Fresh security token generated for newly enrolled student: ${fresh.email}`, fresh.email);
    }

    setAuthModal(null);
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
  };

  const handleUserRoleChange = (uId: string, role: 'Super Admin' | 'Admin' | 'Teacher' | 'Student' | 'Moderator') => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === uId) {
          const updated = { ...u, role };
          if (currentUser.id === uId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
    logSecurityEvent(`Operator permissions override: Set ${uId} to ${role}`, currentUser.email);
  };

  const handleBanUserToggle = (uId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === uId) {
          const updated = { ...u, isBanned: !u.isBanned };
          if (currentUser.id === uId) {
            alert('Your active login node was banned. Session terminated.');
            setCurrentPortal('gateway');
            setCurrentUser(mockUsers[0]);
          }
          return updated;
        }
        return u;
      })
    );
    logSecurityEvent(`Operator SANCTION Override executed on user profile: ${uId}`, currentUser.email);
  };

  const handleApproveTeacher = (name: string) => {
    const temp: User = {
      id: `usr-${Date.now()}`,
      name: name,
      email: `${name.toLowerCase().replace(/\s/g, '')}@argintini.io`,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150',
      role: 'Teacher',
      bio: 'Sovereign Verified Professor.',
      enrolledCourses: [],
      completedLessons: [],
      certificates: []
    };
    setUsers(prev => [...prev, temp]);
    logSecurityEvent(`Teacher application accepted. Created login profile for: ${name}`, currentUser.email);
    alert(`Instructor approved! Profile synthesized for ${name}`);
  };

  // Searching index rules
  const filteredCoursesPool = courses.filter((c) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = c.title.toLowerCase().includes(query) || (c.arabicTitle && c.arabicTitle.includes(query));
    const descMatch = c.description.toLowerCase().includes(query) || (c.arabicDescription && c.arabicDescription.includes(query));
    const catMatch = selectedCategory === 'All' || c.category === selectedCategory;
    return (titleMatch || descMatch) && catMatch;
  });

  // Render Gate selection screen if portal not chosen
  if (currentPortal === 'gateway') {
    return (
      <StudentAuth 
        isArabic={isArabic}
        setIsArabic={setIsArabic}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          
          // Auto route depending on high-level administrative/academic overrides
          if (user.role === 'Teacher') {
            setCurrentPortal('teacher');
            setNavigation('dashboard');
          } else if (user.role === 'Admin' || user.role === 'Super Admin') {
            setCurrentPortal('admin');
            setNavigation('dashboard');
          } else {
            setCurrentPortal('student');
            setNavigation('home');
          }
          
          logSecurityEvent(`Security check cleared. Logged in profile: ${user.name} [Role: ${user.role}]`, user.email);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#070b13] flex flex-col justify-between text-slate-200 relative overflow-hidden font-sans select-none" id="app-root-container">
      {/* Dynamic neon grids backdrop */}
      <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[60%] rounded-full bg-cyan-950/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-950/20 blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* COMPACT SECURE TOP NAVIGATION HEADER BAR */}
      <header className="fixed top-0 inset-x-0 h-18 bg-[#070b13]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 md:px-8 z-40 select-none">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              logSecurityEvent('User signed out of portal shell.', currentUser.email);
              setCurrentPortal('gateway');
              setNavigation('home');
            }}
            className="p-1.5 px-3 rounded-xl border border-slate-900 bg-slate-950 hover:bg-slate-900 text-xs text-slate-400 hover:text-white transition flex items-center gap-1.5"
            title="Log out and return to authorization gate"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Logo Brand Segment */}
          <div className="flex items-center gap-2">
            <div className="w-6.5 h-6.5 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-650 bg-cyan-400 flex items-center justify-center font-bold text-black text-xs select-none">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-black tracking-widest text-white uppercase block leading-none">{currentT.brand}</span>
              <span className="text-[7.5px] font-mono tracking-wider text-cyan-400 uppercase leading-none block">
                {currentPortal === 'student' ? 'Learners Hub' : currentPortal === 'teacher' ? 'Professors Studio' : 'Executive Command'} // live
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tab Links (Context adapt matching currentPortal) */}
        <nav className="hidden lg:flex items-center gap-1 px-1.5 py-1 bg-slate-950/40 border border-slate-900 rounded-xl text-xs font-sans">
          {currentPortal === 'student' ? (
            <>
              <button 
                onClick={() => setNavigation('home')}
                className={`px-4 py-2 rounded-lg font-medium transition ${navigation === 'home' || navigation === 'course-detail' || navigation === 'classroom' ? 'bg-slate-900 text-white font-bold' : 'text-slate-450 hover:text-white'}`}
              >
                {currentT.courses}
              </button>
              <button 
                onClick={() => setNavigation('live-stream')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-1.5 ${navigation === 'live-stream' ? 'bg-slate-900 text-white font-bold' : 'text-slate-450 hover:text-white'}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> Live Streaming
              </button>
              <button 
                onClick={() => setNavigation('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition ${navigation === 'dashboard' ? 'bg-slate-900 text-white font-bold' : 'text-slate-450 hover:text-white'}`}
              >
                {currentT.dashboard}
              </button>
            </>
          ) : (
            <button 
              onClick={() => setNavigation('dashboard')}
              className={`px-4 py-2 rounded-lg font-bold transition bg-slate-900 text-white`}
            >
              🛠️ Command console dashboard
            </button>
          )}
        </nav>

        {/* Right controls side trigger keys */}
        <div className="flex items-center gap-3">
          
          {/* RTL Language selector toggle */}
          <button 
            onClick={() => setIsArabic(!isArabic)} 
            className="p-1 px-2.5 rounded-xl border border-slate-900 hover:border-slate-800 bg-slate-950 font-mono text-[9px] text-cyan-404 text-cyan-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
          >
            <Globe className="w-3 h-3 text-cyan-404" /> {isArabic ? "ENGLISH" : "العربية"}
          </button>

          {/* Secure Sentinel Notifications count bell */}
          <div className="relative">
            <button 
              onClick={() => setShowNotificationModal(!showNotificationModal)}
              className="p-1.5 rounded-xl border border-slate-900 hover:border-slate-850 bg-slate-950/80 transition text-slate-400 hover:text-cyan-404 hover:text-cyan-400 cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              )}
            </button>

            {showNotificationModal && (
              <div className="absolute right-0 mt-2.5 w-72 p-4.5 bg-slate-955 bg-slate-950 border border-slate-900 rounded-2xl shadow-2xl z-50 animate-in fade-in-85 select-none">
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5 mb-2.5 font-sans">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Telemetry Bulletins</h3>
                  <button 
                    onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                    className="text-[9px] font-mono text-cyan-400 hover:underline"
                  >
                    Clear Feed
                  </button>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-none">
                  {notifications.map((n) => (
                    <div key={n.id} className="text-left space-y-1 block border-b border-white/2 pb-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[11px] font-bold text-slate-200">{n.title}</h4>
                        <span className="text-[8px] text-slate-500 font-mono">{n.date}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <span className="text-slate-800 hidden sm:inline">|</span>

          {/* Secure Gate Termination Lock log out */}
          <button 
            onClick={() => {
              logSecurityEvent('User logged out. Session keys purged.', currentUser.email);
              setCurrentPortal('gateway');
              setNavigation('home');
            }}
            className="p-1 px-3 border border-red-950 hover:border-red-500/50 bg-red-950/20 font-sans text-xs text-red-400 hover:text-white rounded-xl flex items-center gap-1 cursor-pointer transition"
            title="Terminate clearance access lock"
          >
            <LogOut className="w-3.5 h-3.5" /> 
            <span className="hidden sm:inline">Terminate Space Seal</span>
          </button>
        </div>
      </header>

      {/* COMPANION SIDE LOG IN / SIGN UP POPUP SIMULATOR MODAL */}
      {authModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border-2 border-cyan-400/20 max-w-sm w-full rounded-2xl p-6 relative overflow-hidden shadow-2xl animate-in zoom-in-95 font-sans">
            <button 
              onClick={() => setAuthModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1.5 mb-5">
              <Terminal className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
              <h3 className="text-base font-sans font-extrabold text-white uppercase tracking-wider">
                {authModal === 'login' ? 'DECKEY DECRYPTION LOGIN' : 'RECRUIT ENROLLMENT SIGNUP'}
              </h3>
              <p className="text-[10px] text-slate-40o text-slate-400 leading-relaxed max-w-xs mx-auto">
                Secure credentials verified over compliant Node gateways.
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3.5 text-xs">
              {authModal === 'signup' && (
                <div>
                  <label className="text-[9px] font-mono text-slate-500 uppercase block mb-1">Cadet Name</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Amir Al-Marzouki"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              )}

              <div>
                <label className="text-[9px] font-mono text-slate-500 uppercase block mb-1">Email Coordinates Address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@argintini.io"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono text-slate-500 uppercase block mb-1">Security Decryption Passkey</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-404 bg-cyan-45 bg-cyan-400 hover:brightness-110 text-black font-sans font-bold text-xs uppercase tracking-wider transition cursor-pointer"
              >
                {authModal === 'login' ? 'Authenticate Entry' : 'Register Secure Profile'}
              </button>
            </form>

            <div className="text-center mt-4.5 text-[10px] text-slate-500">
              {authModal === 'login' ? (
                <p>
                  No active enrollment?{' '}
                  <button onClick={() => setAuthModal('signup')} className="text-cyan-400 hover:underline">
                    Create Security token
                  </button>
                </p>
              ) : (
                <p>
                  Already holds clearance?{' '}
                  <button onClick={() => setAuthModal('login')} className="text-cyan-400 hover:underline">
                    Authenticate Entry
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MAIN PORTS VIEW ROUTER LIST */}
      <main className="flex-1 pt-18 z-10 w-full relative">
        
        {/* VIEW 1: STUDENT MAIN LECTURES OR CATALOG LIST */}
        {navigation === 'home' && currentPortal === 'student' && (
          <div className="space-y-16 pb-24">
            
            {/* INSPIRING GLOWING 3D CANVAS HERO SEGMENT */}
            <section className="relative w-full h-150 flex items-center justify-center overflow-hidden border-b border-white/5 select-none">
              
              {/* Programmable 3D particles matrix canvas layer */}
              <ThreeCanvas />

              {/* Glowing Space light cones */}
              <div className="absolute inset-0 bg-radial-gradient from-cyan-950/20 via-slate-950/90 to-slate-950 z-5" />

              <div className="max-w-4xl text-center px-4 md:px-8 space-y-6 relative z-10">
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-cyan-500/25 bg-cyan-950/25 text-[10.5px] font-mono font-bold tracking-wider uppercase text-cyan-400 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-404 bg-cyan-400" />
                  <span>{currentT.heroTitle}</span>
                </div>

                <h1 className="text-3.5xl md:text-6xl font-sans font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-450 tracking-tight leading-none uppercase">
                  {isArabic ? "التدريب الأكاديمي المتقدم ثلاثي الأبعاد" : "AL ARGINTINI SISTEMS LEARNING TERMINAL"}
                </h1>

                <p className="text-xs md:text-sm text-slate-425 text-slate-400 leading-relaxed max-w-2xl mx-auto font-sans">
                  {currentT.heroSubtitle}
                </p>

                <div className="flex justify-center flex-wrap items-center gap-4 pt-2">
                  <a 
                    href="#catalog-coordinates-directory"
                    className="px-8 py-3.5 rounded-xl bg-cyan-404 bg-cyan-400 text-black font-sans font-bold text-xs tracking-wider uppercase hover:brightness-110 shadow-lg shadow-cyan-400/10 hover:shadow-cyan-400/25 duration-300 transform active:scale-95 transition"
                  >
                    {currentT.heroCta}
                  </a>
                  <button 
                    onClick={() => setNavigation('live-stream')}
                    className="px-6 py-3.5 rounded-xl border border-slate-800 hover:border-cyan-400 bg-slate-900/40 text-xs font-mono text-slate-300 hover:text-white transition flex items-center gap-2 cursor-pointer"
                  >
                    <Video className="w-4 h-4 text-rose-500 animate-pulse" /> Watch Real-time Station Broadcaster
                  </button>
                </div>
              </div>

              {/* Interactive mouse drag hints */}
              <div className="absolute bottom-5 inset-x-0 text-center font-mono text-[9px] text-slate-500 tracking-wider">
                INTERACT WITH DYNAMIC NEURAL CLUSTER MATRIX
              </div>
            </section>

            {/* UNIFIED TELEMENTRY NUMERS STATS BOX */}
            <section className="px-4 md:px-8 max-w-7xl mx-auto select-none">
              <div className="p-8 rounded-3xl bg-slate-950/70 border border-slate-900 grid grid-cols-2 md:grid-cols-4 gap-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
                
                <div className="space-y-1">
                  <p className="text-slate-500 font-mono text-[9px] uppercase tracking-wider">{currentT.students}</p>
                  <p className="text-2.5xl font-mono font-extrabold text-white">142,520+</p>
                  <span className="text-[10px] text-cyan-400 font-sans">98% success validation</span>
                </div>

                <div className="space-y-1 border-l border-slate-905 border-slate-900">
                  <p className="text-slate-500 font-mono text-[9px] uppercase tracking-wider">Firewall Supressions</p>
                  <p className="text-2.5xl font-mono font-extrabold text-emerald-450 text-emerald-400">0.05ms Block</p>
                  <span className="text-[10px] text-slate-505 text-slate-500 font-sans">Zero Database breaches</span>
                </div>

                <div className="space-y-1 border-l border-slate-905 border-slate-900">
                  <p className="text-slate-500 font-mono text-[9px] uppercase tracking-wider">Dynamic certifications</p>
                  <p className="text-2.5xl font-mono font-extrabold text-amber-400">18,485 issued</p>
                  <span className="text-[10px] text-amber-500/80 font-mono">QR space verified</span>
                </div>

                <div className="space-y-1 border-l border-slate-905 border-slate-900">
                  <p className="text-slate-500 font-mono text-[9px] uppercase tracking-wider">Global edge nodes</p>
                  <p className="text-2.5xl font-mono font-extrabold text-white">32 Online</p>
                  <span className="text-[10px] text-cyan-400 font-sans font-semibold">AES-256 secure streams</span>
                </div>
              </div>
            </section>

            {/* MAIN CATALOG DIRECTORY SECTIONS */}
            <section id="catalog-coordinates-directory" className="px-4 md:px-8 max-w-7xl mx-auto space-y-8 scroll-mt-20">
              
              {/* filter elements */}
              <div className="flex flex-wrap items-center justify-between gap-6 border-b border-slate-900 pb-5">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">{currentT.courses}</span>
                  <h2 className="text-xl md:text-3xl font-sans font-extrabold text-white leading-none">
                    {isArabic ? "تصفح البرامج الدراسية التقنية" : "DECRYPT ACADEMIC SYLLABUS DIRECTORY"}
                  </h2>
                </div>

                {/* Inputs Search */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative w-full md:w-64 bg-slate-950/60 rounded-xl overflow-hidden border border-slate-800">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={currentT.searchPlaceholder}
                      className="w-full bg-transparent pl-9 pr-3 py-3 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Category tags options row */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
                {['All', 'AI', 'Ethical Hacking', 'Web Development', 'Cybersecurity'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4.5 py-2.5 rounded-xl text-xs font-mono transition shrink-0 cursor-pointer ${selectedCategory === cat ? 'bg-gradient-to-r from-cyan-950/45 to-indigo-950/45 border border-cyan-500/35 text-cyan-404 text-cyan-400 font-bold' : 'bg-slate-950/20 border border-slate-900 text-slate-400 hover:text-white hover:border-slate-800'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Rendering cards blocks grid list */}
              {filteredCoursesPool.length === 0 ? (
                <div className="py-20 text-center text-slate-500">
                  <ShieldAlert className="w-12 h-12 text-slate-750 mx-auto opacity-20 animate-pulse mb-3" />
                  <p className="text-xs font-mono text-slate-400">NO SYLLABUS MATCHES YOUR RECON PARAMETERS.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCoursesPool.map((c) => (
                    <CourseCard
                      key={c.id}
                      course={c}
                      isArabic={isArabic}
                      isEnrolled={currentUser.enrolledCourses.includes(c.id)}
                      onSelect={() => {
                        setSelectedCourseId(c.id);
                        setNavigation('course-detail');
                      }}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* LUXURY ACADEMIC BENTO SHOWCASE */}
            <section className="px-4 md:px-8 max-w-7xl mx-auto space-y-8 select-none">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{currentT.whyUs}</span>
                <h3 className="text-xl md:text-3.5xl font-sans font-extrabold text-white uppercase col-span-2">Standard Technical Operations</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Bento Speed custom play */}
                <div className="md:col-span-2 rounded-2xl p-6.5 bg-slate-950/60 border border-slate-900 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <Laptop className="w-7 h-7 text-cyan-400 animate-pulse bg-cyan-950/50 p-1 rounded-lg" />
                    <h4 className="text-sm md:text-base font-sans font-bold text-slate-100 uppercase">Speed Controlled Streaming</h4>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
                      Adjust velocity from 0.5x to 2.5x with interactive custom source code viewer, persistence session tracking, and full watermarking.
                    </p>
                  </div>
                  <div className="relative aspect-video rounded-xl bg-slate-900/60 border border-slate-850 p-2 flex items-center justify-center">
                    <Play className="w-12 h-12 text-cyan-404 text-cyan-400 fill-cyan-400/10" />
                  </div>
                </div>

                {/* Secure MCQs exams */}
                <div className="rounded-2xl p-6.5 bg-slate-950/60 border border-slate-900 flex flex-col justify-between">
                  <div className="space-y-2">
                    <GraduationCap className="w-7 h-7 text-amber-400 animate-bounce bg-amber-950/40 p-1 rounded-lg" />
                    <h4 className="text-sm font-sans font-bold text-slate-100 uppercase">Timed Proctor Certification</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Prove your skills in secure web development, ethical hacking, and neural training under strict criteria constraint parameters.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-850 bg-slate-900/30 font-mono text-[10px] space-y-1.5 mt-4">
                    <div className="flex justify-between"><span>EXAM WEIGHT:</span><span className="text-cyan-400 font-bold">100%</span></div>
                    <div className="flex justify-between"><span>PASSING CRITERIA:</span><span className="text-emerald-400 font-bold">70% OR HIGHER</span></div>
                    <div className="flex justify-between"><span>SIGNING METHOD:</span><span className="text-amber-500 font-bold">SHA-256 LEDGER ID</span></div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: COURSE DETAILS */}
        {navigation === 'course-detail' && currentPortal === 'student' && (
          <div className="px-4 md:px-8 max-w-7xl mx-auto py-12 space-y-12 pb-24 animate-in fade-in duration-300">
            <button 
              onClick={() => setNavigation('home')}
              className="text-xs font-mono text-cyan-400 px-3 py-1.5 border border-slate-850 hover:border-slate-800 hover:text-white transition rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              ← Back to courses
            </button>

            {/* Overview details hero card */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-850 bg-slate-950/60 p-6 md:p-10 flex flex-col md:flex-row justify-between gap-8 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl text-sky-400" />
              
              <div className="space-y-5 max-w-xl md:max-w-2xl relative z-10 text-left">
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="bg-cyan-950/30 px-3 py-0.5 rounded border border-cyan-500/20 text-cyan-400">
                    {activeCourse.category}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{activeCourse.duration} syllabus duration</span>
                </div>

                <h1 className="text-2xl md:text-4xl font-sans font-extrabold text-white leading-tight uppercase leading-none">
                  {isArabic ? activeCourse.arabicTitle : activeCourse.title}
                </h1>
                
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-sans">
                  {isArabic ? activeCourse.arabicDescription : activeCourse.description}
                </p>

                {/* Course Features Highlight list */}
                <div className="space-y-2 bg-slate-900/40 p-4 rounded-2xl border border-slate-905 border-slate-900/60 font-sans text-left">
                  <h4 className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                    {isArabic ? "المميزات الفاخرة للبرنامج الأكاديمي" : "SOVEREIGN PROGRAM FEATURES"}
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {(activeCourse.features && activeCourse.features.length > 0 
                      ? activeCourse.features 
                      : [
                          isArabic ? "شهادة اعتماد أكاديمية موثقة" : "Verifiable Sovereign Certification",
                          isArabic ? "مراجعة الكود البرمجي ثنائي الاتجاه" : "Dual-Check Code Review",
                          isArabic ? "دعم تشغيلي فوري على مدار الساعة" : "Autonomous Real-time Telemetry Lab"
                        ]
                    ).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-404 bg-cyan-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-2 font-mono text-xs">
                  <div className="flex items-center gap-1">
                    <Star className="w-4.5 h-4.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-white">{activeCourse.rating} rating</span>
                  </div>
                  <div className="text-slate-500">|</div>
                  <div className="text-slate-400">
                    {(activeCourse.enrolledCount || 1042).toLocaleString()} {isArabic ? 'خريج مسجل' : 'Cadets Enrolled'}
                  </div>
                </div>
              </div>

              {/* enrollment status triggers */}
              <div className="shrink-0 bg-slate-950/90 border border-slate-850 rounded-2xl p-6 w-full md:w-80 flex flex-col justify-between space-y-5 relative z-10 shadow-2xl shadow-cyan-950/10 text-left">
                <div className="space-y-2">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">CLEARANCE PRICING KEYS</span>
                  <div className="space-y-1">
                    <div className="text-2xl font-mono font-black text-emerald-400">{activeCourse.price} EGP <span className="text-xs text-slate-500 font-sans">(ج.م)</span></div>
                    <div className="text-[11px] font-mono text-slate-400 flex flex-col gap-0.5">
                      <span className="text-indigo-400">{Math.round(activeCourse.price / 13.3)} SAR (ر.س)</span>
                      <span className="text-sky-400">${Math.round(activeCourse.price / 50)} USD ($)</span>
                    </div>
                  </div>
                  <div className="text-[9px] font-mono text-slate-600 line-through">
                    Original Price: {activeCourse.originalPrice} EGP
                  </div>
                </div>

                {currentUser.enrolledCourses.includes(activeCourse.id) ? (
                  <div className="space-y-2 w-full">
                    <button
                      onClick={() => {
                        setNavigation('classroom');
                        if (activeCourse.sections[0]?.lessons[0]) {
                          setActiveLessonId(activeCourse.sections[0].lessons[0].id);
                        }
                        logSecurityEvent(`Entering classroom deck: ${activeCourse.title}`);
                      }}
                      className="w-full py-3 bg-cyan-400 hover:brightness-110 text-black font-sans font-bold text-xs uppercase tracking-wider transition rounded-xl text-center block cursor-pointer"
                    >
                      {currentT.startLearning}
                    </button>
                    
                    <button
                      onClick={() => handleCancelEnrollment(activeCourse.id)}
                      className="w-full py-2.5 rounded-xl border border-red-900/50 bg-red-950/20 hover:bg-red-950/40 text-red-400 hover:text-red-300 font-sans font-bold text-[10.5px] uppercase tracking-wider transition text-center block cursor-pointer"
                    >
                      {isArabic ? "إلغاء الاشتراك واسترداد الأموال" : "Refund & Cancel Course"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEnrollCourse(activeCourse.id)}
                    className="w-full py-3.5 rounded-xl bg-cyan-404 bg-cyan-400 hover:bg-cyan-300 text-black font-sans font-bold text-xs uppercase tracking-wider transition hover:brightness-110 shadow-lg cursor-pointer text-center"
                  >
                    {currentT.enroll}
                  </button>
                )}

                <div className="text-center font-mono text-[9px] text-slate-500 uppercase tracking-widest border-t border-slate-900 pt-3">
                  STREAMS CONSTRAINED WITH AUTH SEALS
                </div>
              </div>
            </div>

            {/* CURRICULUM ACCORDION INDICES */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
              <div className="lg:col-span-2 bg-slate-950/60 border border-slate-800 rounded-2xl p-5 md:p-7 space-y-6">
                <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400">Program Curriculum Outline ({activeCourse.sections.length} Sections)</h3>

                <div className="space-y-4">
                  {activeCourse.sections.map((sec, sIdx) => (
                    <div key={sec.id} className="space-y-2 border-b border-white/5 pb-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-sans font-bold text-white uppercase tracking-wider">{sIdx + 1}. {sec.title}</span>
                        <span className="text-[10px] font-mono text-slate-500">{sec.lessons.length} topics</span>
                      </div>

                      <div className="grid grid-cols-1 gap-1.5 mt-2">
                        {sec.lessons.map((les, lIdx) => {
                          const isEnrolled = currentUser.enrolledCourses.includes(activeCourse.id);
                          const isCompleted = currentUser.completedLessons.includes(les.id);

                          return (
                            <div 
                              key={les.id} 
                              className={`p-3 rounded-lg flex items-center justify-between text-xs transition ${isEnrolled ? 'hover:bg-cyan-950/10 cursor-pointer text-slate-200' : 'text-slate-500'}`}
                              onClick={() => {
                                if (isEnrolled) {
                                  setNavigation('classroom');
                                  setActiveLessonId(les.id);
                                } else {
                                  alert('Register clearance for this module first.');
                                }
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-400' : 'bg-cyan-400/60'}`} />
                                <span>{sIdx + 1}.{lIdx + 1} {les.title}</span>
                              </div>
                              <div className="flex items-center gap-2 font-mono text-[10px]">
                                <span>{les.duration}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bio details card info */}
              <div className="lg:col-span-1 bg-slate-950/60 border border-slate-800 rounded-2xl p-6 space-y-4 h-fit">
                <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500">Instructor of record</h3>
                <div className="flex items-center gap-4 border-b border-slate-900 pb-4">
                  <img src={activeCourse.instructorAvatar} className="w-12 h-12 rounded-full border border-cyan-500/15 shrink-0" alt={activeCourse.instructorName} />
                  <div>
                    <h4 className="text-sm font-sans font-extrabold text-white">{activeCourse.instructorName}</h4>
                    <span className="text-[9px] font-mono text-cyan-400 uppercase">Aviation Certified Principal</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{activeCourse.instructorBio}</p>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 3: CLASSROOM SCREEN */}
        {navigation === 'classroom' && currentPortal === 'student' && (
          <div className="px-4 md:px-8 max-w-7xl mx-auto py-8 space-y-8 pb-24 animate-in fade-in duration-300">
            <div className="flex justify-between items-center gap-4">
              <button 
                onClick={() => setNavigation('course-detail')}
                className="text-xs font-mono text-cyan-400 px-3 py-1.5 border border-slate-850 hover:border-slate-800 hover:text-white transition rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                ← Exit Classroom Stream
              </button>
              
              <div className="flex items-center gap-3 text-xs bg-slate-900/40 p-1 px-3.5 rounded-xl border border-slate-850 font-mono">
                <span className="text-slate-500">WATCH PROGRESS:</span>
                <span className="text-cyan-400 font-bold">{activeCoursePercent}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
              {/* Streaming Video segment */}
              <div className="lg:col-span-2 space-y-6">
                {(() => {
                  const lessonsList = activeCourse.sections.flatMap(s => s.lessons);
                  const currentPlayingClassroomLesson = lessonsList.find(l => l.id === activeLessonId) || lessonsList[0];
                  const isCompleted = currentUser.completedLessons.includes(currentPlayingClassroomLesson?.id);

                  if (!currentPlayingClassroomLesson) return <p className="text-stone-300">Loading lecture content...</p>;

                  return (
                    <CustomVideoPlayer
                      course={activeCourse}
                      lesson={currentPlayingClassroomLesson}
                      userEmail={currentUser.email}
                      isCompleted={isCompleted}
                      onLessonCompleted={(lId) => handleMarkLessonComplete(lId)}
                    />
                  );
                })()}

                {/* Secure MCQs Quizzes block */}
                <div className="p-6.5 rounded-2xl border border-dashed border-amber-500/35 bg-amber-955/5 background-blur-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5.5 h-5.5 text-amber-400 animate-pulse" />
                      <h4 className="text-sm font-sans font-bold text-slate-100 uppercase tracking-wider">Timed Exam Verification Chamber</h4>
                    </div>
                    {activeCoursePercent >= 100 ? (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/25 border border-emerald-500/10 px-2 py-0.5 rounded">EXAM ACCREDITATION SECURED</span>
                    ) : (
                      <span className="text-[10px] font-mono text-amber-500 bg-amber-950/25 border border-amber-500/10 px-2 py-0.5 rounded">EXAM CONDITIONAL</span>
                    )}
                  </div>

                  {activeCoursePercent >= 100 ? (
                    (() => {
                      const matchedQuiz = mockQuizzes.find(q => q.courseId === activeCourse.id);
                      if (!matchedQuiz) return <p className="text-xs text-slate-500">No qualifying MCQ exam mapped for this course.</p>;

                      return (
                        <ActiveExam
                          quiz={matchedQuiz}
                          studentName={currentUser.name}
                          userId={currentUser.id}
                          onExamCompleted={(score, cert) => handleExamCompleted(score, cert)}
                        />
                      );
                    })()
                  ) : (
                    <div className="p-4 bg-slate-900/30 rounded-xl flex items-center gap-2.5 font-mono text-[10.5px] text-slate-400 border border-slate-950">
                      <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
                      <p className="leading-snug">Exam clearance locked. Please mark all syllabus lectures complete to unlock timed certification exam (Current progress: {activeCoursePercent}%).</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Classroom Timeline list selection */}
              <div className="lg:col-span-1 bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4 shrink-0 h-fit max-h-[140vh] overflow-y-auto">
                <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 border-b border-slate-900 pb-2.5">Syllabus Curriculum Steps</h3>

                <div className="space-y-4">
                  {activeCourse.sections.map((sec, sIdx) => (
                    <div key={sec.id} className="space-y-1.5">
                      <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest block">{sIdx + 1}. {sec.title}</span>
                      
                      <div className="grid grid-cols-1 gap-1">
                        {sec.lessons.map((les) => {
                          const isCurrent = les.id === activeLessonId;
                          const isCompleted = currentUser.completedLessons.includes(les.id);

                          return (
                            <button
                              key={les.id}
                              onClick={() => {
                                setActiveLessonId(les.id);
                              }}
                              className={`text-left p-2.5 rounded text-[11.5px] font-medium transition cursor-pointer flex justify-between items-center gap-3 ${isCurrent ? 'bg-cyan-950/30 border-l border-cyan-400 text-cyan-400 font-bold' : 'text-slate-300 hover:bg-slate-900/25'}`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isCompleted ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                                <span className="truncate">{les.title}</span>
                              </div>
                              <span className="text-[9.5px] font-mono text-slate-500 shrink-0">{les.duration}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: PERSONAL DASHBOARD ROLE HOUSING (CLEAN ISOLATED VIEW CHANNELS) */}
        {navigation === 'dashboard' && (
          <div className="px-4 md:px-8 max-w-7xl mx-auto py-12 space-y-8 pb-24 animate-in fade-in duration-300">
            {/* Context adapters indicator bars */}
            <div className="p-6.5 rounded-3xl border border-slate-850 bg-slate-950/40 relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl text-sky-400" />
              <div className="flex items-center gap-4 relative z-10 self-start sm:self-center">
                <img src={currentUser.avatar} className="w-14 h-14 rounded-full border-2 border-cyan-500/20" alt={currentUser.name} />
                <div className="space-y-0.5 text-left">
                  <h2 className="text-xl md:text-2xl font-sans font-black text-white uppercase leading-none select-all">{currentUser.name}</h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] font-mono text-cyan-404 text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/15 uppercase">
                      {currentUser.role} isolated workspace
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 select-all">{currentUser.email}</span>
                  </div>
                </div>
              </div>

              {/* Personal Quick Stats panel */}
              <div className="flex gap-6 sm:self-center relative z-10 font-mono text-xs text-center border-l-0 sm:border-l sm:border-slate-850 pl-0 sm:pl-6 shrink-0">
                {currentPortal === 'student' ? (
                  <>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Classes Owned</span>
                      <span className="text-sm font-bold text-white">{currentUser.enrolledCourses.length} programs</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Classes Complete</span>
                      <span className="text-sm font-bold text-cyan-400">{currentUser.completedLessons.length} units</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">NFT Certs held</span>
                      <span className="text-sm font-bold text-amber-400">{currentUser.certificates.length} tokens</span>
                    </div>
                  </>
                ) : (
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Sentinel Authority Node Status</span>
                    <span className="text-xs font-bold text-emerald-400 tracking-wider">CLEARANCE VERIFIED // HOST OK</span>
                  </div>
                )}
              </div>
            </div>

            {/* SECURE ISOLATION BOUNDARIES */}
            {currentPortal === 'student' && currentUser.role === 'Student' && (
              <StudentDashboard
                courses={courses}
                user={currentUser}
                onSelectCourse={(cId) => {
                  setSelectedCourseId(cId);
                  setNavigation('course-detail');
                }}
                onLaunchLesson={(cId, lId) => {
                  setSelectedCourseId(cId);
                  setActiveLessonId(lId);
                  setNavigation('classroom');
                }}
              />
            )}

            {currentPortal === 'teacher' && (
              <TeacherDashboard
                courses={courses}
                activeTeacherName={currentUser.name}
                onPostAnnouncement={(title, text) => handlePostAnnouncement(title, text)}
                onUploadLesson={(cId, sTitle, lTitle, vUrl, codeSnip) => handleUploadLessonInState(cId, sTitle, lTitle, vUrl, codeSnip)}
                onPostCourseCreated={(newC) => handlePostCourseCreated(newC)}
                users={users}
                transactions={transactions}
                securityLogs={securityLogs}
                onDeleteCourse={(courseId) => handleDeleteCourse(courseId)}
              />
            )}

            {currentPortal === 'admin' && (
              <AdminPanel
                users={users}
                transactions={transactions}
                securityLogs={securityLogs}
                courses={courses}
                onUserRoleChange={(uId, roleObj) => handleUserRoleChange(uId, roleObj)}
                onBanUserToggle={(uId) => handleBanUserToggle(uId)}
                onApproveTeacher={(nm) => handleApproveTeacher(nm)}
                onDeleteCourse={(courseId) => handleDeleteCourse(courseId)}
              />
            )}
          </div>
        )}

        {/* VIEW 5: LIVE VIRTUAL STREAMING BROADCAST STATION */}
        {navigation === 'live-stream' && currentPortal === 'student' && (
          <div className="px-4 md:px-8 max-w-7xl mx-auto py-12 space-y-12 pb-24 animate-in fade-in duration-300">
            <div className="space-y-1 text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-rose-500">Global Stream Chamber</span>
              <h2 className="text-xl md:text-3.5xl font-sans font-extrabold text-white leading-none">
                 ⚡ ACTIVE INTERACTIVE STATIONS
              </h2>
              <p className="text-xs text-slate-400 leading-normal">Real-time academic lecture streaming synced over encrypted compliance keys.</p>
            </div>

            <LiveStreaming
              userName={currentUser.name}
              userAvatar={currentUser.avatar}
              userRole={currentUser.role}
              isArabic={isArabic}
            />
          </div>
        )}
      </main>

      {/* FOOTER METRICS LOGS */}
      <footer className="w-full bg-[#0a0f1d] border-t border-slate-900 py-10 px-4 md:px-8 relative z-10 select-none text-[11px] font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-start gap-2 text-left uppercase">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold tracking-wider">ARGENTINA SOFTWARE ACADEMY LMS</span>
              <span className="text-cyan-400 font-bold">•</span>
              <span>All Session Streams Locked & Authenticated</span>
            </div>
            <p className="text-[9.5px] text-slate-600 leading-normal max-w-xl lowercase font-sans">
              {isArabic 
                ? "حقوق الملكية الفكرية ومحتوى منصة الأكاديمية الأرجنتينية محمية بموجب القوانين والتشريعات الدولية لمكافحة القرصنة وتنزيل المحتوى. يمنع منعاً باتاً فحص الأكواد أو تصوير الدروس."
                : "Protected by international IP laws. Any illegal downloading, stream scraping, or code extraction triggers automated profile locks and is reported directly to legal units."}
            </p>
          </div>
          <div className="text-right space-y-1">
            <div className="text-white font-bold text-xs">
              {isArabic ? "© 2026 الأكاديمية الأرجنتينية للبرمجيات. جميع الحقوق محفوظة." : "© 2026 ARGENTINA SOFTWARE ACADEMY. ALL RIGHTS RESERVED."}
            </div>
            <span className="block text-[10px] text-slate-600 uppercase">
              Operational Status: Standard Clear // Crypt Key AES-256
            </span>
          </div>
        </div>
      </footer>

      {/* Floating dynamic Customer Success Care suite widget */}
      <CustomerSupport 
        currentUser={currentUser} 
        onLogSecurityEvent={logSecurityEvent} 
        isArabic={isArabic} 
      />

      {/* Dynamic interactive anti-inspect alarm system */}
      {securityToast?.show && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 w-full max-w-xl px-4 select-none">
          <div className="bg-[#090b14] border-2 border-red-500/85 text-slate-100 p-4.5 rounded-2xl shadow-2xl flex items-start gap-3.5 relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 left-0 w-2 h-full bg-red-500 animate-pulse" />
            <div className="space-y-1.5 text-left">
              <h5 className="text-[10px] font-mono tracking-widest text-red-500 uppercase font-black">
                ⚔️ [ {isArabic ? "درع حماية الأكاديمية الأرجنتينية" : "ARGENTINIAN SHIELD ALERT"} ]
              </h5>
              <p className="text-xs leading-relaxed font-sans font-extrabold text-white">
                {isArabic ? securityToast.msgAr : securityToast.msgEn}
              </p>
            </div>
            <button
              onClick={() => setSecurityToast(null)}
              className="ml-auto text-xs text-slate-400 hover:text-white font-mono cursor-pointer bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl"
            >
              [ {isArabic ? "إغلاق" : "CONFIRM"} ]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
