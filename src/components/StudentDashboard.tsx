import { useState, useEffect } from 'react';
import { Award, BookOpen, Clock, Calendar, ChevronRight, FileCode, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';
import { Course, Certificate, Note, User } from '../types';
import InteractiveCert from './InteractiveCert';

interface StudentDashboardProps {
  courses: Course[];
  user: User;
  onSelectCourse: (courseId: string) => void;
  onLaunchLesson: (courseId: string, lessonId: string) => void;
}

export default function StudentDashboard({ courses, user, onSelectCourse, onLaunchLesson }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'progress' | 'certificates' | 'announcements'>('progress');
  const [earnedCertificates, setEarnedCertificates] = useState<Certificate[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  // Load Certificates and Personal Notes Bookmarks on render
  useEffect(() => {
    // Collect notes across all local courses
    const allNotes: Note[] = [];
    courses.forEach((c) => {
      const savedNotes = localStorage.getItem(`argintini-notes-${c.id}`);
      if (savedNotes) {
        allNotes.push(...JSON.parse(savedNotes));
      }
    });
    setNotes(allNotes);

    // Filter certificates for our student user
    const certsKey = `argintini-certs-${user.id}`;
    const storedCerts = localStorage.getItem(certsKey);
    if (storedCerts) {
      setEarnedCertificates(JSON.parse(storedCerts));
    } else {
      // Inject seed completed certificates
      const seedCert: Certificate = {
        id: 'cert-1',
        userId: user.id,
        userName: user.name,
        courseId: 'course-1',
        courseTitle: 'Advanced AI & Deep Neural Networks',
        issueDate: 'May 18, 2026',
        score: 94,
        credentialId: 'ARG-8841-K891B',
      };
      setEarnedCertificates([seedCert]);
      localStorage.setItem(certsKey, JSON.stringify([seedCert]));
    }
  }, [user, courses]);

  // Handle course progress calculations dynamically
  const getCourseProgress = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return 0;
    
    const lessonsList = course.sections.flatMap((s) => s.lessons);
    if (lessonsList.length === 0) return 0;

    const completedInThisCourse = lessonsList.filter((l) => user.completedLessons.includes(l.id));
    return Math.round((completedInThisCourse.length / lessonsList.length) * 100);
  };

  const enrolledCoursesList = courses.filter((c) => user.enrolledCourses.includes(c.id));

  // Load announcements from global mock datasets
  const announcementsList = [
    { teacher: 'Dr. Soraya Vance', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150', title: 'Live Class scheduler Friday: Weight matrices and gradients', text: 'We will look at PyTorch neuron weight matrices cascading programmatically at 20:00 UTC using customized developer widgets. Get your local workspace ready.', date: 'May 22, 2026' },
    { teacher: 'Jack Ransom (PayloadX)', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150', title: 'Zero Day datasets uploads released', text: 'Malware assembly offsets ZIP datasets appended under resources sections to Lesson 2-1.', date: 'May 20, 2026' }
  ];

  return (
    <div className="space-y-6">
      {/* Lightbox for Holographic interactive Certificate details popups */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black/94 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
          <div className="w-full max-w-4xl max-h-[95vh] overflow-y-auto pr-1">
            <InteractiveCert certificate={selectedCert} onClose={() => setSelectedCert(null)} />
          </div>
        </div>
      )}

      {/* Grid layouts tabs switcher */}
      <div className="flex gap-2 border-b border-slate-905 pb-1 select-none">
        {[
          { id: 'progress', label: 'My Academic Studies' },
          { id: 'certificates', label: 'Dynamic Cert Lockers' },
          { id: 'announcements', label: 'Bulletin Timeline' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-sans font-medium hover:text-white transition cursor-pointer ${activeTab === tab.id ? 'bg-gradient-to-r from-cyan-950/50 to-indigo-950/50 border border-cyan-500/30 text-cyan-400 font-bold' : 'text-slate-400'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ACADEMIC STUDIES TAB */}
      {activeTab === 'progress' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {/* Ongoing Courses matrix lists (Col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider">
              Continuing Active Modules ({enrolledCoursesList.length})
            </h4>

            {enrolledCoursesList.length === 0 ? (
              <div className="p-8 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20 text-center text-slate-500">
                <BookOpen className="w-10 h-10 mx-auto opacity-20 animate-pulse text-cyan-400 mb-2" />
                <p className="text-xs">No active enrolled curriculum folders.</p>
                <p className="text-[10px] text-slate-600 mt-1">Explore our futuristic syllabus pathways on the homepage catalogue!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {enrolledCoursesList.map((c) => {
                  const progressVal = getCourseProgress(c.id);

                  return (
                    <div 
                      key={c.id} 
                      className="p-5 rounded-2xl border border-slate-800 bg-slate-950/40 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300 cursor-pointer"
                      onClick={() => onSelectCourse(c.id)}
                    >
                      <div className="flex gap-4">
                        <img src={c.thumbnail} className="w-18 h-18 rounded-xl object-cover border border-slate-900 shrink-0" alt={c.title} />
                        <div className="space-y-1 flex-1">
                          <span className="text-[8.5px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/30 px-1.5 py-0.2 rounded border border-cyan-500/15">
                            {c.category}
                          </span>
                          <h4 className="text-sm font-sans font-bold text-white leading-snug group-hover:text-cyan-400 transition">
                            {c.title}
                          </h4>
                          
                          {/* Progress slider bar dynamic */}
                          <div className="space-y-1 pt-2">
                            <div className="flex justify-between items-center text-[10px] font-mono">
                              <span className="text-slate-500 uppercase">Syllabus Complete</span>
                              <span className="text-cyan-400 font-bold">{progressVal}%</span>
                            </div>
                            <div className="w-full h-1 bg-slate-900 rounded-lg overflow-hidden border border-white/2">
                              <div 
                                className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-500 transition-all duration-1000"
                                style={{ width: `${progressVal}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition duration-250 self-center" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Timestamp Notes bookmark links folder (Col-span-1) */}
          <div className="lg:col-span-1 bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4 h-fit">
            <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-cyan-400 animate-pulse" /> Notebook Checkpoints ({notes.length})
            </h4>

            {notes.length === 0 ? (
              <p className="text-[10px] text-slate-500 text-center py-10 italic">
                No local checklist notes captured. Inside any video streaming lesson, type note targets to create resume anchors!
              </p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => onLaunchLesson(note.courseId, note.lessonId)}
                    className="p-3 rounded-xl border border-slate-900 bg-slate-900/10 hover:border-cyan-500/20 hover:bg-slate-900/40 cursor-pointer transition select-none flex justify-between items-center gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/30 border border-cyan-500/20 px-1.5 rounded py-0.2 select-all">
                        {note.timestamp} Jump
                      </span>
                      <p className="text-xs font-sans text-slate-200 truncate">{note.content}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* DYNAMIC DIGITAL CERTIFICATE VAULTS */}
      {activeTab === 'certificates' && (
        <div className="space-y-4 animate-in fade-in duration-300 bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
          <div className="border-b border-slate-900 pb-3 flex justify-between items-center">
            <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider">
              Acquired Blockchain Education Credentials ({earnedCertificates.length})
            </h4>
            <span className="text-[10px] text-emerald-400 font-mono">ALL CONTRACTS DECENTRALIZED SYNC</span>
          </div>

          {earnedCertificates.length === 0 ? (
            <div className="text-center py-12 space-y-4 max-w-sm mx-auto">
              <Award className="w-12 h-12 text-slate-600 animate-pulse mx-auto" />
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                You do not hold active cryptographic cert credentials yet. Pass any final program exams with a score of <strong className="text-cyan-400">70% or more</strong> to earn certificates!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {earnedCertificates.map((cert) => (
                <div 
                  key={cert.id} 
                  className="p-4 rounded-xl border border-amber-500/15 bg-slate-900/5 hover:bg-slate-900/10 hover:border-amber-500/40 transition-all duration-300 flex justify-between items-center gap-4 cursor-pointer"
                  onClick={() => setSelectedCert(cert)}
                >
                  <div className="flex gap-3">
                    <div className="p-2.5 bg-amber-950/20 text-amber-400 border border-amber-500/10 rounded-lg shrink-0">
                      <Award className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-mono text-amber-500 tracking-wider">LEDGER HASH: {cert.credentialId}</span>
                      <h4 className="text-xs font-sans font-bold text-white leading-snug">{cert.courseTitle}</h4>
                      <p className="text-[9px] text-slate-400">Registered issue date: {cert.issueDate}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-sans font-bold text-[10px] transition shrink-0">
                    Inspected Vault
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SYLLABUS DISPATCH TIMELINE BULLETINS */}
      {activeTab === 'announcements' && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4 animate-in fade-in duration-300">
          <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" /> Syllabus Bulletins & Notices Timeline ({announcementsList.length})
          </h4>

          <div className="space-y-4">
            {announcementsList.map((ann, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-900 bg-slate-900/15 flex gap-3 animate-in fade-in">
                <img src={ann.avatar} className="w-9 h-9 rounded-full border border-slate-800 shrink-0" alt={ann.teacher} />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/20 border border-cyan-500/10 rounded px-1.5 py-0.2">{ann.teacher}</span>
                    <span className="text-[10px] font-mono text-slate-500">{ann.date}</span>
                  </div>
                  <h4 className="text-xs font-sans font-bold text-white select-all">{ann.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{ann.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
