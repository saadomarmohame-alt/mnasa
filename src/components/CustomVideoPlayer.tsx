import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCw, Volume2, VolumeX, Maximize2, Sparkles, AlertTriangle, Check, Code, Download, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Lesson, Course, Note } from '../types';

interface CustomVideoPlayerProps {
  course: Course;
  lesson: Lesson;
  userEmail: string;
  onLessonCompleted: (lessonId: string) => void;
  isCompleted: boolean;
}

export default function CustomVideoPlayer({ course, lesson, userEmail, onLessonCompleted, isCompleted }: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [quality, setQuality] = useState('1080p Cyber-HQ');
  const [showProgressToast, setShowProgressToast] = useState(false);
  const [savedTime, setSavedTime] = useState(0);
  
  // Custom Notes state
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteText, setNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Anti-piracy watermark floating positions
  const [watermarkPos, setWatermarkPos] = useState({ x: 20, y: 30 });

  // Load persistence and notes
  useEffect(() => {
    // Volume memory
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.playbackRate = playbackRate;
    }

    // Load saved time
    const storageKey = `argintini-progress-${course.id}-${lesson.id}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsedTime = parseFloat(saved);
      if (parsedTime > 5 && parsedTime < (videoRef.current?.duration || 1000) - 10) {
        setSavedTime(parsedTime);
        setShowProgressToast(true);
      }
    }

    // Load notes
    const notesKey = `argintini-notes-${course.id}`;
    const savedNotes = localStorage.getItem(notesKey);
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      setNotes([]);
    }

    // Reset controls state
    setIsPlaying(false);
    setIsAddingNote(false);
    setNoteText('');
  }, [lesson, course]);

  // Floating anti-piracy randomized coordinates loop
  useEffect(() => {
    const interval = setInterval(() => {
      setWatermarkPos({
        x: Math.floor(Math.random() * 55) + 15, // 15% to 70% width
        y: Math.floor(Math.random() * 60) + 20, // 20% to 80% height
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Save progress periodic loop
  useEffect(() => {
    if (!videoRef.current || currentTime <= 0) return;
    const storageKey = `argintini-progress-${course.id}-${lesson.id}`;
    localStorage.setItem(storageKey, currentTime.toString());

    // Auto mark completed when 90% watched
    if (duration > 0 && currentTime / duration > 0.92 && !isCompleted) {
      onLessonCompleted(lesson.id);
    }
  }, [currentTime, duration, lesson, course, onLessonCompleted, isCompleted]);

  // Controls Handlers
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTime = parseFloat(e.target.value);
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleRateChange = (rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const vol = parseFloat(e.target.value);
    videoRef.current.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const muteState = !isMuted;
    videoRef.current.muted = muteState;
    setIsMuted(muteState);
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen().catch(() => {});
    }
  };

  const resumeSavedTime = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = savedTime;
    setCurrentTime(savedTime);
    setShowProgressToast(false);
    videoRef.current.play().catch(() => {});
    setIsPlaying(true);
  };

  // Convert seconds to readable MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Notes implementation
  const handleAddNote = () => {
    if (!noteText.trim()) return;
    
    const newNote: Note = {
      id: `note-${Date.now()}`,
      courseId: course.id,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      timestamp: formatTime(currentTime),
      seconds: currentTime,
      content: noteText.trim()
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem(`argintini-notes-${course.id}`, JSON.stringify(updatedNotes));
    
    setNoteText('');
    setIsAddingNote(false);
    
    // Auto resume if we paused
    if (videoRef.current && isPlaying) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem(`argintini-notes-${course.id}`, JSON.stringify(updated));
  };

  const jumpToTime = (secs: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = secs;
    setCurrentTime(secs);
    if (!isPlaying) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Video Container Frame */}
      <div 
        id="argintini-mediaplayer-wrapper"
        ref={containerRef}
        className="relative aspect-video w-full rounded-2xl overflow-hidden border border-cyan-500/30 bg-black shadow-2xl shadow-cyan-950/20 group/controls"
      >
        <video
          ref={videoRef}
          src={lesson.videoUrl}
          className="w-full h-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={togglePlay}
          playsInline
        />

        {/* Real-time Dynamic Floating Anti-Piracy Watermark overlay */}
        <div 
          className="absolute select-none pointer-events-none text-xs font-mono text-white/10 z-20 transition-all duration-1000 ease-in-out"
          style={{ left: `${watermarkPos.x}%`, top: `${watermarkPos.y}%` }}
        >
          <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-md border border-white/5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>AL ARGINTINI SECURE CORE // {userEmail}</span>
          </div>
        </div>

        {/* Premium Glow Shadows Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover/controls:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Resume Watch Toast banner */}
        {showProgressToast && (
          <div className="absolute top-4 left-4 right-4 z-30 bg-slate-950/95 border border-cyan-500/40 rounded-xl p-3.5 backdrop-blur-md flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-3 duration-300">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              <p className="text-xs font-sans text-slate-200">
                You were watching <strong className="text-white">"{lesson.title}"</strong>. Resume from <span className="text-cyan-400 font-mono font-bold">{formatTime(savedTime)}</span>?
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => setShowProgressToast(false)}
                className="px-3 py-1.5 rounded-md text-xs font-mono text-slate-400 hover:text-white hover:bg-white/5 transition"
              >
                Dismiss
              </button>
              <button 
                onClick={resumeSavedTime}
                className="px-4 py-1.5 rounded-md text-xs font-sans font-medium bg-gradient-to-r from-cyan-500 to-indigo-500 text-black hover:brightness-110 transition active:scale-95 flex items-center gap-1"
              >
                Resume <Play className="w-3 h-3 fill-black" />
              </button>
            </div>
          </div>
        )}

        {/* Big Middle Play icon when paused */}
        {!isPlaying && (
          <button 
            onClick={togglePlay}
            className="absolute inset-x-0 inset-y-0 m-auto w-16 h-16 rounded-full bg-cyan-400/90 hover:bg-cyan-300 shadow-lg shadow-cyan-400/20 text-black flex items-center justify-center transition-all scale-95 hover:scale-105 active:scale-90 duration-300 z-10"
          >
            <Play className="w-7 h-7 fill-black ml-1" />
          </button>
        )}

        {/* Progress Watermark Status Indicator */}
        {isCompleted && (
          <div className="absolute top-4 right-4 z-10 bg-emerald-500/90 text-black font-sans font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-emerald-500/10 border border-emerald-400">
            <Check className="w-3.5 h-3.5 stroke-[3]" /> Completed
          </div>
        )}

        {/* Video Custom Controller UI Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3 z-30 opacity-0 group-hover/controls:opacity-100 transition-opacity duration-300 select-none bg-gradient-to-t from-black/95 via-black/80 to-transparent">
          {/* Progress timelines scrubber slider */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-cyan-400 font-semibold">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 outline-none hover:h-1.5 transition-all"
            />
            <span className="text-[10px] font-mono text-slate-400">{formatTime(duration)}</span>
          </div>

          {/* Left/Right Buttons actions panel */}
          <div className="flex items-center justify-between">
            {/* Playbacks and volume */}
            <div className="flex items-center gap-4">
              <button 
                onClick={togglePlay} 
                className="text-slate-200 hover:text-cyan-400 transition"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              <button 
                onClick={() => {
                  if (videoRef.current) videoRef.current.currentTime -= 10;
                }}
                className="text-slate-400 hover:text-white transition"
                title="Rewind 10s"
              >
                <RotateCw className="w-4.5 h-4.5 -scale-x-100" />
              </button>

              {/* Volume sliders */}
              <div className="flex items-center gap-1.5 group/volume">
                <button onClick={toggleMute} className="text-slate-400 hover:text-white transition">
                  {isMuted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-0 group-hover/volume:w-16 h-1 rounded-lg appearance-none bg-slate-800 accent-white outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* Custom quality and playback scale rate selector presets */}
            <div className="flex items-center gap-3 text-xs">
              {/* Note creator button shortcut */}
              <button
                onClick={() => {
                  if (videoRef.current && isPlaying) videoRef.current.pause();
                  setIsAddingNote(true);
                }}
                className="px-2.5 py-1 rounded border border-cyan-500/20 bg-slate-900/40 hover:bg-slate-950 hover:border-cyan-400 text-cyan-400 font-mono flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Note @ {formatTime(currentTime)}
              </button>

              {/* speed selectors */}
              <div className="relative group/speed">
                <button className="px-2 py-1 rounded bg-slate-900/60 text-slate-300 font-mono hover:text-cyan-400">
                  {playbackRate}x
                </button>
                <div className="absolute bottom-full right-0 mb-1 hidden group-hover/speed:block bg-slate-950 border border-slate-800 rounded shadow-2xl p-1 w-16 text-center select-none">
                  {[0.5, 1, 1.25, 1.5, 2, 2.5].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleRateChange(rate)}
                      className={`block w-full py-1 rounded text-[10px] font-mono hover:bg-cyan-400 hover:text-black ${playbackRate === rate ? 'text-cyan-400 bg-cyan-950/20' : 'text-slate-300'}`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>

              {/* quality selectors */}
              <div className="relative group/quality">
                <button className="px-2.5 py-1 rounded bg-blue-550 border border-slate-800 font-mono text-[10px] text-slate-300 hover:text-white uppercase">
                  {quality.split(' ')[0]}
                </button>
                <div className="absolute bottom-full right-0 mb-1 hidden group-hover/quality:block bg-slate-950 border border-slate-800 rounded shadow-2xl p-1 w-32 select-none">
                  {['1080p Cyber-HQ', '720p Neon-HD', '480p Grid-SD'].map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`block w-full text-left px-2 py-1 rounded text-[10px] font-mono hover:bg-indigo-500 hover:text-white ${quality === q ? 'text-cyan-400 bg-cyan-950/20' : 'text-slate-300'}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* fullscreen Toggle */}
              <button onClick={handleFullscreen} className="text-slate-400 hover:text-white transition">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Notes Form Area when requested */}
      {isAddingNote && (
        <div className="p-5 rounded-2xl border border-dashed border-cyan-400/40 bg-slate-950/80 backdrop-blur-md animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-3.5">
            <h4 className="text-sm font-sans font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-cyan-400 animate-pulse" /> Add Timestamped Learning Note
            </h4>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded">
              Locked to {formatTime(currentTime)}
            </span>
          </div>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Type your strategic learning insight, assembly offset pointers, or logic code reminders..."
            className="w-full h-24 bg-slate-900 border border-slate-700/60 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
            autoFocus
          />
          <div className="flex items-center justify-end gap-2 mt-3">
            <button
              onClick={() => {
                setIsAddingNote(false);
                setNoteText('');
                if (videoRef.current) videoRef.current.play().catch(() => {});
              }}
              className="px-4 py-1.5 rounded-lg text-xs font-sans text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAddNote}
              className="px-4 py-1.5 rounded-lg text-xs font-sans font-medium bg-cyan-400 hover:bg-cyan-300 text-black shadow-lg shadow-cyan-400/10 active:scale-95 transition-all"
            >
              Save Note
            </button>
          </div>
        </div>
      )}

      {/* Course Resources Panel, Notes Sidebar, and Interactive Source Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Code and attachments */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-4 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-mono tracking-wider uppercase text-slate-400 flex items-center gap-2">
              <Code className="w-4 h-4 text-cyan-400" /> Lesson Code & Attachments
            </h3>
            {lesson.isPremium && (
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/20 border border-amber-500/20 px-2 py-0.5 rounded">
                PRO SOURCE
              </span>
            )}
          </div>

          {/* Code snippet panel with auto highlighter wrapper */}
          {lesson.codeSnippet ? (
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/40">
              <div className="flex items-center justify-between bg-slate-900/80 px-4 py-2 text-[10px] font-mono text-slate-400 border-b border-slate-800">
                <span>sandbox_env_vortex.py</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(lesson.codeSnippet || '');
                    alert('Code copied to development sandbox!');
                  }}
                  className="hover:text-cyan-400 transition"
                >
                  Copy Source
                </button>
              </div>
              <pre className="p-4 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-56">
                <code>{lesson.codeSnippet}</code>
              </pre>
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-mono italic text-center py-6">
              No code assets needed for this baseline conceptual lecture.
            </p>
          )}

          {/* Resources links downloads */}
          {lesson.resources && lesson.resources.length > 0 && (
            <div className="space-y-2 mt-4">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Downloadable Materials</span>
              {lesson.resources.map((res, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-900/20 hover:border-cyan-500/20 transition-all">
                  <div className="flex items-center gap-2.5">
                    <Download className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p className="text-xs font-medium text-slate-200">{res.name}</p>
                      {res.size && <span className="text-[10px] font-mono text-slate-500">{res.size}</span>}
                    </div>
                  </div>
                  <button 
                    onClick={() => alert(`Downloading verified asset ${res.name} secure tunnel authenticated.`)}
                    className="p-1 px-3 rounded bg-cyan-950/30 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all border border-cyan-500/20 text-[10px] font-mono"
                  >
                    Fetch
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Your Course level notes catalog */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-4 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-mono tracking-wider uppercase text-slate-400 flex items-center gap-2 border-b-0 pb-0">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Notes Vault ({notes.length})
            </h3>
            <span className="text-[10px] text-slate-400 font-sans italic">Click note to seek jump</span>
          </div>

          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-8 text-slate-500 space-y-2">
              <Sparkles className="w-8 h-8 opacity-20 animate-pulse text-cyan-400" />
              <p className="text-xs">No saved study insights for this course yet.</p>
              <p className="text-[10px] text-slate-600 max-w-xs">Inside the video controller overlay, click 'Note @' to pin learning checkpoints!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {notes.map((note) => (
                <div 
                  key={note.id} 
                  onClick={() => jumpToTime(note.seconds)}
                  className="group/note p-3 bg-slate-900/30 hover:bg-slate-900/60 border border-slate-800 hover:border-cyan-500/20 rounded-xl cursor-pointer transition-all flex justify-between gap-3 animate-in fade-in duration-200"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-500/20 font-bold">
                        {note.timestamp}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 truncate max-w-[130px]" title={note.lessonTitle}>
                        {note.lessonTitle}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 font-sans leading-relaxed break-words">{note.content}</p>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteNote(note.id, e)}
                    className="text-slate-500 hover:text-red-400 p-1 rounded opacity-0 group-hover/note:opacity-100 transition duration-150 self-start shrink-0"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
