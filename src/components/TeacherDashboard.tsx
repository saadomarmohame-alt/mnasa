import React, { useState } from 'react';
import { 
  Award, Plus, FileText, Upload, Check, MessageSquare, 
  Star, Sparkles, Volume2, Calendar, Database, Eye, Share2 
} from 'lucide-react';
import { Course, Lesson, User, CourseSection, SecurityLog } from '../types';
import SocialCourseComposer from './SocialCourseComposer';
import DatabaseExplorer from './DatabaseExplorer';

interface TeacherDashboardProps {
  courses: Course[];
  activeTeacherName: string;
  onPostAnnouncement: (title: string, text: string) => void;
  onUploadLesson: (courseId: string, sectionTitle: string, lessonTitle: string, videoUrl: string, codeSnippet: string) => void;
  onPostCourseCreated: (course: Course) => void;
  users: User[];
  transactions: any[];
  securityLogs: SecurityLog[];
  onDeleteCourse?: (id: string) => void;
}

export default function TeacherDashboard({ 
  courses, 
  activeTeacherName, 
  onPostAnnouncement, 
  onUploadLesson,
  onPostCourseCreated,
  users,
  transactions,
  securityLogs,
  onDeleteCourse
}: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState<'courses' | 'publish_post' | 'uploader' | 'announcements' | 'database'>('courses');
  
  // Announcement creator state
  const [annTitle, setAnnTitle] = useState('');
  const [annText, setAnnText] = useState('');
  const [annSuccess, setAnnSuccess] = useState(false);

  // Lesson uploader form state
  const [targetCourseId, setTargetCourseId] = useState(courses[0]?.id || '');
  const [secTitle, setSecTitle] = useState('Core Fundamentals & Weight Architectures');
  const [lesTitle, setLesTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annText.trim()) return;
    onPostAnnouncement(annTitle.trim(), annText.trim());
    setAnnSuccess(true);
    setAnnTitle('');
    setAnnText('');
    setTimeout(() => setAnnSuccess(false), 3000);
  };

  const handleUploadLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCourseId || !lesTitle.trim()) return;
    
    onUploadLesson(
      targetCourseId,
      secTitle.trim(),
      lesTitle.trim(),
      videoUrl.trim(),
      codeSnippet.trim()
    );

    setUploadSuccess(true);
    setLesTitle('');
    setCodeSnippet('');
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const filteredCourses = courses.filter(c => 
    c.instructorName.includes('Soraya') || 
    c.instructorName.includes(activeTeacherName) || 
    activeTeacherName === 'Sébastien Aurelius'
  );

  return (
    <div className="space-y-6" id="teacher-dashboard-main">
      {/* Tab select toolbars */}
      <div className="flex flex-wrap gap-2 border-b border-slate-900 pb-1.5 select-none text-xs">
        {[
          { id: 'courses', label: 'Taught Modules', icon: Award },
          { id: 'publish_post', label: 'Publish Course Post', icon: Share2 },
          { id: 'uploader', label: 'Append Lecture Stream', icon: Upload },
          { id: 'announcements', label: 'Announcements Timeline', icon: Calendar },
          { id: 'database', label: 'Sovereign DB Query', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4.5 py-2.5 rounded-xl font-sans font-medium hover:text-white transition flex items-center gap-2 cursor-pointer ${isActive ? 'bg-gradient-to-r from-cyan-950/50 to-indigo-950/50 border border-cyan-500/30 text-cyan-400 font-bold' : 'text-slate-400'}`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. TAUGHT COURSES SUB-VIEW */}
      {activeTab === 'courses' && (
        <div className="space-y-6 animate-in fade-in duration-305">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCourses.map((c) => (
              <div key={c.id} className="p-5 rounded-2xl border border-slate-850 bg-slate-950/40 relative overflow-hidden group">
                <div className="flex gap-4">
                  <img src={c.thumbnail} className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-800" alt={c.title} />
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/20 px-1.5 py-0.2 rounded border border-cyan-500/15">
                      {c.category}
                    </span>
                    <h4 className="text-sm font-sans font-bold text-white leading-snug group-hover:text-cyan-400 transition">
                      {c.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed truncate max-w-[250px]">{c.description}</p>
                  </div>
                </div>

                {/* stats aggregates */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center font-mono text-[10px] pt-3.5 border-t border-slate-900/80">
                  <div className="bg-slate-900/30 p-2 rounded-lg">
                    <span className="text-slate-500 block text-[9px] uppercase">Students</span>
                    <span className="text-white font-bold">{(c.enrolledCount || 1042).toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-900/30 p-2 rounded-lg">
                    <span className="text-slate-500 block text-[9px] uppercase">Rating</span>
                    <span className="text-amber-400 font-bold flex items-center justify-center gap-0.5">
                      {c.rating || 5.0} <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                    </span>
                  </div>
                  <div className="bg-slate-900/30 p-2 rounded-lg">
                    <span className="text-slate-500 block text-[9px] uppercase">Lectures Count</span>
                    <span className="text-cyan-400 font-bold">
                      {c.sections.reduce((count, s) => count + s.lessons.length, 0)} items
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Student Reviews Feed */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" /> Active Student Course Ratings Feed
            </h4>
            
            <div className="space-y-4 font-sans">
              {filteredCourses.flatMap(c => c.reviews.map(r => ({ ...r, courseTitle: c.title }))).map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-xl border border-slate-900/80 bg-slate-900/10 flex gap-3 animate-in fade-in">
                  <img src={rev.userAvatar} className="w-8 h-8 rounded-full border border-slate-800 shrink-0" alt={rev.userName} />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white">{rev.userName}</p>
                      <span className="text-[9px] font-mono text-slate-500">{rev.date}</span>
                    </div>
                    <span className="text-[9px] font-mono text-cyan-400 tracking-wider">ON: {rev.courseTitle}</span>
                    <div className="flex gap-0.5 py-0.5">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed italic">"{rev.text}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. DYNAMIC SOCIAL MEDIA COLPOSER (FACEBOOK/INSTAGRAM STYLE) */}
      {activeTab === 'publish_post' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <SocialCourseComposer 
            instructorName={activeTeacherName}
            instructorAvatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150"
            onPostCreated={(newC) => {
              onPostCourseCreated(newC);
              setActiveTab('courses'); // Redirect back to courses list
            }}
          />
        </div>
      )}

      {/* 3. SYLLABUS LECTURE APPENDER */}
      {activeTab === 'uploader' && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-5 max-w-2xl mx-auto animate-in fade-in duration-300">
          <div className="border-b border-slate-900 pb-3">
            <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Upload className="w-4.5 h-4.5 text-cyan-400 animate-pulse" /> Append Lesson Lecture to Module
            </h4>
            <p className="text-[10px] text-slate-400">Add an MP4 video lesson and source code template to an existing course syllabus.</p>
          </div>

          {uploadSuccess && (
            <div className="p-3 bg-emerald-950/35 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2 animate-in slide-in-from-top-2">
              <Check className="w-4.5 h-4.5 stroke-[2.5]" /> Published successfully! Lecture added under target syllabus block.
            </div>
          )}

          <form onSubmit={handleUploadLesson} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Target Course Program</label>
                <select
                  value={targetCourseId}
                  onChange={(e) => setTargetCourseId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Course Sub-Section</label>
                <input
                  type="text"
                  required
                  value={secTitle}
                  onChange={(e) => setSecTitle(e.target.value)}
                  placeholder="e.g. Core Fundamentals"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Lecture Visual Title</label>
                <input
                  type="text"
                  required
                  value={lesTitle}
                  onChange={(e) => setLesTitle(e.target.value)}
                  placeholder="e.g. Dynamic Register Exploitation"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Lecture Raw MP4 Video Link</label>
                <input
                  type="url"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1 text-slate-400 flex justify-between items-center">
                  <span>Companion Source Code</span>
                  <span className="text-[9px] text-slate-650 font-normal lowercase italic text-sky-400">Optionally blank</span>
                </label>
                <textarea
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  placeholder="e.g. class NeuralVortex(nn.Module): ..."
                  className="w-full h-32 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-black font-sans font-bold text-xs tracking-wider uppercase transition flex items-center justify-center gap-1.5 active:scale-95 duration-150 cursor-pointer"
            >
              <Upload className="w-4 h-4" /> Publish Lesson Module
            </button>
          </form>
        </div>
      )}

      {/* 4. SYLLABUS ANNOUNCEMENTS BROADCAST */}
      {activeTab === 'announcements' && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-5 max-w-2xl mx-auto animate-in fade-in duration-300">
          <div className="border-b border-slate-900 pb-3">
            <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4.5 h-4.5 text-cyan-400" /> Dispatch Global Syllabus Announcement Bulletin
            </h4>
            <p className="text-[10px] text-slate-400">Instantly displayed on enrolled students dashboards timelines.</p>
          </div>

          {annSuccess && (
            <div className="p-3 bg-emerald-950/35 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2 animate-in slide-in-from-top-2">
              <Check className="w-4.5 h-4.5 stroke-[2.5]" /> Bulletin dispatched! Displayed on active timelines.
            </div>
          )}

          <form onSubmit={handlePostAnnouncement} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Headline Bulletin Title</label>
              <input
                type="text"
                required
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                placeholder="e.g. Sandbox system upgrades scheduled"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Syllabus Context Information Text</label>
              <textarea
                required
                value={annText}
                onChange={(e) => setAnnText(e.target.value)}
                placeholder="Describe your announcement guidelines..."
                className="w-full h-32 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-404 bg-cyan-45 bg-cyan-400 text-black font-sans font-bold text-xs tracking-wider uppercase transition flex items-center justify-center gap-1.5 active:scale-95 duration-150 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" /> Dispatch Bulletin announcement
            </button>
          </form>
        </div>
      )}

      {/* 5. DATABASE QUERY EXPLORER */}
      {activeTab === 'database' && (
        <div className="animate-in fade-in duration-300">
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
