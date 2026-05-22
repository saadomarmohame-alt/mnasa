import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Users, Shield, Radio, Volume2, AlertTriangle, Play, Pause, Power, 
  MessageSquare, Flame, Sparkles, LogIn, LogOut, Heart, Trophy, ThumbsUp, Star,
  Paperclip, Pin, Download
} from 'lucide-react';
import { LiveStreamMessage, UserRole } from '../types';

interface LiveStreamingProps {
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  isArabic?: boolean;
}

interface BulletComment {
  id: string;
  userName: string;
  text: string;
  x: number;
  y: number;
  speed: number;
  color: string;
  size: number;
}

interface FloatingHeart {
  id: string;
  emoji: string;
  left: number;
  bottom: number;
  size: number;
  sway: number;
  speed: number;
  opacity: number;
}

interface MiniNotification {
  id: string;
  text: string;
}

export default function LiveStreaming({ userName, userAvatar, userRole, isArabic = false }: LiveStreamingProps) {
  // Hardcoded default stream chat comments
  const [messages, setMessages] = useState<LiveStreamMessage[]>([
    { id: '1', userName: 'Zachary Stark', userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150', userRole: 'Student', text: isArabic ? 'هل يعمل كود كسر حماية النوات في بيئات لينكس أيضاً؟' : 'Wait, does the kernel exploit work on Unix-flavor architectures too?' },
    { id: '2', userName: 'Dr. Soraya Vance', userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150', userRole: 'Teacher', text: isArabic ? 'نعم، تستخدم بيئات يونيكس فوارق مختلفة لمؤشرات الكومة سنراها مباشرة.' : 'Unix structures use slightly different stack pointer boundaries. We will see the kernel payloads live now.', isTeacher: true },
    { id: '3', userName: 'Elena Petrova', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150', userRole: 'Student', text: isArabic ? 'الموقع رائع جداً والبث السلس يعكس الفخامة.' : 'This visual interface is absolutely incredible. Watching the streams feels like being inside a luxury SpaceX console!' },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [activeUsersCount, setActiveUsersCount] = useState(382);
  const [isStreaming, setIsStreaming] = useState(true);
  const [heartsCount, setHeartsCount] = useState(1420);
  const [pinnedComment, setPinnedComment] = useState<LiveStreamMessage | null>(null);
  const [userWebcamActive, setUserWebcamActive] = useState(false);
  
  // Custom floating hearts list just like TikTok Live
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  
  // Custom TikTok live stream notifications inside bottom-left
  const [miniNotifications, setMiniNotifications] = useState<MiniNotification[]>([
    { id: 'n1', text: isArabic ? 'شادي عادل انضم للبث المباشر المثير' : 'Shady Adel joined the live stream' },
    { id: 'n2', text: isArabic ? 'أحمد سمير أرسل إعجاباً تفاعلياً ❤️' : 'Ahmed Samir liked the broadcast ❤️' }
  ]);

  // Active student avatars on the stream
  const [spectators, setSpectators] = useState([
    { name: 'Elena Petrova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150', role: 'Student', status: 'Online', glowColor: 'border-cyan-500' },
    { name: 'Zachary Stark', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150', role: 'Student', status: 'Online', glowColor: 'border-indigo-500' },
    { name: 'Fariq Al-Taji', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150', role: 'Student', status: 'Online', glowColor: 'border-purple-500' },
    { name: 'Chloe Dubois', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150', role: 'Student', status: 'Online', glowColor: 'border-emerald-500' },
    { name: 'Kariim S.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150', role: 'Student', status: 'Online', glowColor: 'border-yellow-500' },
  ]);

  const [activeAlert, setActiveAlert] = useState<string | null>(null);
  const [broadcastInput, setBroadcastInput] = useState('');

  // Sockets & synchronization tracking refs
  const renderedMessageIdsRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef<boolean>(false);
  const heartsCountRef = useRef<number>(1420);

  // Canvas visual pointer & Chat state references
  const streamCanvasRef = useRef<HTMLCanvasElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Danmaku Bullet comment pool ref to persist positions between canvas frame loops properly
  const bulletsRef = useRef<BulletComment[]>([]);

  // Seed initial bullets
  useEffect(() => {
    bulletsRef.current = [
      { id: 'b1', userName: 'Elena Petrova', text: 'Stunning system!', x: 400, y: 80, speed: 1.8, color: '#38bdf8', size: 12 },
      { id: 'b2', userName: 'Zachary Stark', text: 'Looking good', x: 600, y: 140, speed: 2.2, color: '#818cf8', size: 11 },
      { id: 'b3', userName: 'Ahmed K.', text: 'البرمجة الإبداعية في أبهى صورها', x: 800, y: 200, speed: 1.5, color: '#fbbf24', size: 12 }
    ];
  }, []);

  // Update floating reaction hearts loop
  useEffect(() => {
    const timer = setInterval(() => {
      setFloatingHearts((prev) => 
        prev
          .map((h) => ({
            ...h,
            bottom: h.bottom + h.speed,
            sway: h.sway + 0.05,
            opacity: h.opacity - 0.015
          }))
          .filter((h) => h.opacity > 0 && h.bottom < 400)
      );
    }, 30);
    return () => clearInterval(timer);
  }, []);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, activeAlert]);

  // Synchronize live-streams, chat messages, reactions, warnings and cohost webcams centrally
  useEffect(() => {
    let active = true;

    const pullServerState = async () => {
      try {
        const res = await fetch('/api/live/sync');
        if (!res.ok) return;
        const data = await res.json();
        if (!active || !data || !data.state) return;

        const serverState = data.state;

        // Fluctuating viewers count
        setActiveUsersCount(serverState.activeUsersCount);

        // Hearts count alignment & spawning local dynamic likes reactions indeed
        const serverHearts = serverState.heartsCount;
        if (serverHearts > heartsCountRef.current) {
          const diff = serverHearts - heartsCountRef.current;
          heartsCountRef.current = serverHearts;
          setHeartsCount(serverHearts);

          // Emit romantic floating reactions for each missed tap!
          const emojiPool = ['❤️', '🔥', '👍', '👑', '⭐️', '⚡️', '💙', '💜'];
          const countToSpawn = Math.min(diff, 6); // prevent freezing
          for (let i = 0; i < countToSpawn; i++) {
            const id = `heart-net-${Date.now()}-${Math.random()}`;
            const randEmoji = emojiPool[Math.floor(Math.random() * emojiPool.length)];
            const randLeft = 60 + Math.random() * 160;
            const randSize = 16 + Math.random() * 16;
            const randSpeed = 2 + Math.random() * 3;
            setFloatingHearts((prev) => [
              ...prev,
              { id, emoji: randEmoji, left: randLeft, bottom: 0, size: randSize, sway: Math.random() * 10, speed: randSpeed, opacity: 1 }
            ]);
          }
        } else {
          heartsCountRef.current = serverHearts;
          setHeartsCount(serverHearts);
        }

        // Host pinned comment alignment
        setPinnedComment(serverState.pinnedComment);

        // Host active warnings/alerts banners sync
        if (serverState.activeAlert !== activeAlert) {
          setActiveAlert(serverState.activeAlert);
        }

        // Mini status notification updates
        const mappedNotifs = serverState.miniNotifications.map((n: any) => ({
          id: n.id,
          text: isArabic ? n.text_ar : n.text_en
        }));
        setMiniNotifications(mappedNotifs);

        // Messages update
        const serverMessages = serverState.messages;
        setMessages(serverMessages);

        // Check for new incoming comments from other users / simulation to render in Danmaku
        serverMessages.forEach((msg: any) => {
          if (!renderedMessageIdsRef.current.has(msg.id)) {
            renderedMessageIdsRef.current.add(msg.id);

            // If it's not the first loading, swim the commenter texts in Danmaku loops!
            if (initializedRef.current) {
              const randomY = 60 + Math.random() * 140;
              const colors = ['#06b6d4', '#38bdf8', '#818cf8', '#a78bfa', '#fb7185', '#34d399', '#f43f5e', '#fbbf24'];
              const randomColor = colors[Math.floor(Math.random() * colors.length)];
              bulletsRef.current.push({
                id: `${msg.id}-bullet`,
                userName: msg.userName,
                text: msg.text,
                x: 640,
                y: randomY,
                speed: 1.2 + Math.random() * 1.5,
                color: msg.userName === userName ? '#22d3ee' : randomColor,
                size: 11.5 + Math.random() * 2
              });
            }
          }
        });

        // Align co-host camera with local toggle
        const isMyCamActiveOnServer = serverState.activeCohosts[userName] !== undefined;
        if (isMyCamActiveOnServer !== userWebcamActive) {
          setUserWebcamActive(isMyCamActiveOnServer);
        }

        initializedRef.current = true;
      } catch (err) {
        console.error('Failed to pull server synchronized state:', err);
      }
    };

    // Immediate pull
    pullServerState();

    // Synced intervals 
    const syncInterval = setInterval(pullServerState, 1500);

    return () => {
      active = false;
      clearInterval(syncInterval);
    };
  }, [activeAlert, isArabic, userName, userWebcamActive]);

  // Canvas visual dynamic looping matrix and floating Danmaku bullet chats
  useEffect(() => {
    const canvas = streamCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let w = (canvas.width = canvas.offsetWidth || 640);
    let h = (canvas.height = canvas.offsetHeight || 360);

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.width = canvas.offsetWidth || 640;
      h = canvas.height = canvas.offsetHeight || 360;
    };
    window.addEventListener('resize', handleResize);

    const columns = Math.floor(w / 16);
    const yPos = Array(columns).fill(0);

    const draw = () => {
      if (!isStreaming) {
        // Redraw offline board
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 12.5px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          isArabic ? '🔴 تم تعليق البث كود - بوابات المغادرة مغلقة موقتاً' : '🔴 TRANSMISSION PAUSED // INTENSIVE FEED SEALED', 
          w / 2, 
          h / 2
        );
        animFrame = requestAnimationFrame(draw);
        return;
      }

      // Atmospheric background color and soft cyber grid glow
      ctx.fillStyle = 'rgba(3, 7, 18, 0.15)';
      ctx.fillRect(0, 0, w, h);

      // Render Matrix terminal waterfall backdrop
      ctx.fillStyle = 'rgba(6, 182, 212, 0.16)';
      ctx.font = '9px monospace';
      yPos.forEach((y, index) => {
        const char = String.fromCharCode(33 + Math.random() * 93);
        const x = index * 16;
        ctx.fillText(char, x, y);

        if (y > h && Math.random() > 0.98) {
          yPos[index] = 0;
        } else {
          yPos[index] = y + 15;
        }
      });

      // Render overlay vector HUD graphics
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.75 + Math.sin(Date.now() * 0.001) * 15);
      ctx.lineTo(w, h * 0.75 + Math.sin(Date.now() * 0.001) * 15);
      ctx.stroke();

      // Sweep Radar display top-right
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(w - 75, 75, 40, 0, Math.PI * 2);
      ctx.stroke();
      
      const sweep = (Date.now() * 0.002) % (Math.PI * 2);
      ctx.beginPath();
      ctx.moveTo(w - 75, 75);
      ctx.lineTo(w - 75 + Math.cos(sweep) * 40, 75 + Math.sin(sweep) * 40);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = 'bold 10.5px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(
        isArabic 
          ? 'بوابة البث الحية للأكاديمية الأرجنتينية // الخادم مفعل' 
          : 'AL ARGINTINI TERMINAL DIRECT BROADCAST // COMMAND ACTIVE', 
        15, 
        28
      );

      // UPDATE & DRAW DANMAKU SCROLLING COMMENTS INDEED!
      bulletsRef.current.forEach((bullet) => {
        // Move comments to the left
        bullet.x -= bullet.speed;

        // Draw comment block outline beautifully
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)'; 
        ctx.font = `bold ${bullet.size}px sans-serif`;
        const textWidth = ctx.measureText(`${bullet.userName}: ${bullet.text}`).width;
        
        ctx.beginPath();
        ctx.roundRect(bullet.x - 6, bullet.y - bullet.size - 2, textWidth + 12, bullet.size + 10, 6);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.stroke();

        // Render bullet sender signature on camera HUD
        ctx.fillStyle = '#94a3b8';
        ctx.font = `bold ${bullet.size * 0.9}px sans-serif`;
        ctx.fillText(`${bullet.userName}: `, bullet.x, bullet.y);

        // Render comment text aligned with customized glowing parameters
        ctx.fillStyle = bullet.color;
        ctx.font = `${bullet.size}px sans-serif`;
        const labelWidth = ctx.measureText(`${bullet.userName}: `).width;
        ctx.fillText(bullet.text, bullet.x + labelWidth, bullet.y);
      });

      // Filter out bullets that swam completely off the left screen edge
      bulletsRef.current = bulletsRef.current.filter((bullet) => bullet.x > -400);

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrame);
    };
  }, [isStreaming, isArabic]);

  // Click on emoji heart buttons to post reaction directly
  const handleEmojiClick = async (em: string) => {
    const id = Date.now().toString() + '-' + Math.random();
    const randLeft = 60 + Math.random() * 160;
    const randSize = 20 + Math.random() * 18;
    const randSpeed = 2.5 + Math.random() * 3.5;
    
    // Play local optimistic user interaction indeed
    setFloatingHearts((prev) => [
      ...prev,
      { id, emoji: em, left: randLeft, bottom: 0, size: randSize, sway: Math.random() * 10, speed: randSpeed, opacity: 1 }
    ]);
    
    try {
      await fetch('/api/live/heart_react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ increment: 1, emoji: em, sender: userName })
      });
    } catch (err) {
      console.error('Failed to dispatch heart click:', err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const textPayload = inputMessage.trim();
    setInputMessage('');

    try {
      await fetch('/api/live/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          userAvatar,
          userRole,
          text: textPayload,
          isTeacher: userRole === 'Teacher' || userRole === 'Admin' || userRole === 'Super Admin'
        })
      });
    } catch (err) {
      console.error('Failed to post message safely:', err);
    }
  };

  const handleBroadcastAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastInput.trim()) return;
    const alertMessage = broadcastInput.trim();
    setBroadcastInput('');

    try {
      await fetch('/api/live/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeAlert: alertMessage })
      });
    } catch (err) {
      console.error('Failed to broadcast alert:', err);
    }
  };

  const clearAlert = async () => {
    try {
      await fetch('/api/live/clear_alert', { method: 'POST' });
    } catch (err) {
      console.error('Failed to clear stream alert:', err);
    }
  };

  const toggleBroadcasting = () => {
    setIsStreaming(!isStreaming);
  };

  const hasTeacherPrivileges = userRole === 'Teacher' || userRole === 'Admin' || userRole === 'Super Admin';

  // HELPER FOR CURRENT LOGGED IN USER ROLE BADGE (THE TAG SHOWN PROMINENTLY)
  const getUserRoleTag = (role: UserRole) => {
    if (role === 'Super Admin') return isArabic ? '👑 المدير التنفيذي' : '👑 Chief Architect';
    if (role === 'Admin') return isArabic ? '🛡️ المسؤول العام' : '🛡️ General Admin';
    if (role === 'Teacher') return isArabic ? '👨‍🏫 أستاذ الأكاديمية' : '👨‍🏫 Lead Professor';
    return isArabic ? '🎓 طالب النخبة' : '🎓 Elite Cadet';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 select-none text-slate-200" id="tiktok-livestream-module">
      
      {/* Stream Viewing Screen Card Column */}
      <div className="lg:col-span-3 space-y-4">
        
        {/* TikTok-style Broadcast Banner stats */}
        <div className="bg-gradient-to-r from-red-950/20 via-cyan-950/20 to-slate-900/10 border border-red-500/15 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <h4 className="text-xs font-mono text-red-400 font-extrabold uppercase tracking-wider">
              {isArabic ? "منصة البث الأرجنتينية التفاعلية (TikTok Live)" : "AL ARGINTINI DIRECT INTERACTIVE FEED"}
            </h4>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            {/* Request Join stream camera button (إتاحة ظهور المستخدمين في البث المباشر) */}
            <button
              onClick={() => {
                setUserWebcamActive(!userWebcamActive);
                setMiniNotifications((prev) => [
                  ...prev.slice(-4),
                  { 
                    id: Date.now().toString(), 
                    text: !userWebcamActive 
                      ? (isArabic ? 'كاميرتك نشطة الآن في البث المشترك!' : 'Your camera feed is live on the co-hosts panel!') 
                      : (isArabic ? 'لقد أغلقت كاميرتك الخاصة للبث' : 'You closed your personal co-host cam') 
                  }
                ]);
              }}
              className={`px-3 py-1.5 rounded-xl font-mono text-[9px] font-bold uppercase transition flex items-center gap-1 cursor-pointer shrink-0 ${
                userWebcamActive 
                  ? 'bg-rose-500/25 border border-rose-500 text-rose-450 text-rose-400 font-bold hover:bg-rose-600 hover:text-white' 
                  : 'bg-indigo-950/40 border border-indigo-500/30 text-indigo-400 hover:border-indigo-400 hover:bg-indigo-600 hover:text-white'
              }`}
              title="Appear on stream camera co-host feed"
            >
              <span>{userWebcamActive ? "📹 Close Cam" : "📹 Appear on Live Feed"}</span>
            </button>

            <span className="text-cyan-400">
              💬 {messages.length + bulletsRef.current.length} {isArabic ? "تعليقاً نشطاً" : "comments"}
            </span>
            <span className="text-pink-400 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
              {heartsCount} {isArabic ? "تفاعل حب" : "tap reactions"}
            </span>
          </div>
        </div>

        {/* Cinematic stream visual player aspect frame with inside elements */}
        <div className="relative aspect-video rounded-3xl overflow-hidden border border-cyan-500/20 bg-[#02050c] shadow-2xl">
          
          {/* Animated matrix streams and Danmaku visual core renders */}
          <canvas ref={streamCanvasRef} className="w-full h-full object-cover" />

          {/* Absolute HUD details elements */}
          {isStreaming && (
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 bg-red-600 font-sans text-[10px] font-bold tracking-wider text-white uppercase px-2.5 py-0.5 rounded-full shadow-lg shadow-rose-600/30 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  {isArabic ? "مباشر" : "Live"}
                </span>
                <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 text-[9.5px] font-mono text-slate-300 shadow">
                  <Users className="w-3.5 h-3.5 text-cyan-400" /> 
                  {activeUsersCount} {isArabic ? "مشاهد متصل الآن" : "tuning in"}
                </span>
              </div>

              {/* TikTok Live Watermark showing active current user login and their premium administrative Tag */}
              <div className="bg-slate-950/80 border border-cyan-500/35 px-2.5 py-1 rounded-xl text-[10px] font-mono text-cyan-300 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>{isArabic ? "المستخدم النشط:" : "Synced user:"}</span>
                <span className="text-white font-extrabold">{userName}</span>
                <span className="bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-400/30 text-[9px] text-cyan-400 font-bold uppercase">
                  {getUserRoleTag(userRole)}
                </span>
              </div>
            </div>
          )}

          {/* USER WEBCAM SCREEN FOR COORDINATIVE MULTI-USER CO-HOST FEEDS (إتاحة ظهور المستخدمين في البث المباشر) */}
          {userWebcamActive && (
            <div className="absolute top-16 right-4 w-32 h-20 bg-slate-950/90 rounded-2xl border-2 border-cyan-450 border-cyan-500/50 overflow-hidden shadow-2xl animate-in zoom-in-95 z-30 flex flex-col justify-between p-1.5 font-sans">
              <div className="flex justify-between items-center">
                <span className="text-[7.5px] font-mono text-cyan-400 bg-cyan-950/60 px-1 py-0.2 rounded border border-cyan-500/20 uppercase font-black tracking-wide">
                  {isArabic ? "بثك المشترك" : "YOUR FEED (LIVE)"}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <img src={userAvatar} className="w-8 h-8 rounded-full border-2 border-cyan-400 animate-pulse" alt={userName} />
              </div>
              <div className="flex items-center justify-between text-[7px] font-mono text-slate-400 leading-none">
                <span className="truncate max-w-[85px]">{userName}</span>
                <span className="text-emerald-400">● 100%</span>
              </div>
            </div>
          )}

          {/* RIGHT SIDE TIKTOK FLOATING REACTIONS CONTAINER CANVAS VIEWPORTS */}
          <div className="absolute bottom-16 right-4 w-44 h-72 pointer-events-none z-20 overflow-hidden" id="tiktok-reactions-overlay">
            {floatingHearts.map((h) => (
              <span
                key={h.id}
                className="absolute transition-all duration-75 select-none"
                style={{
                  left: `${h.left}px`,
                  bottom: `${h.bottom}px`,
                  fontSize: `${h.size}px`,
                  opacity: h.opacity,
                  transform: `translateX(${Math.sin(h.sway) * 22}px)`,
                }}
              >
                {h.emoji}
              </span>
            ))}
          </div>

          {/* LOWER-LEFT CORNER MINI TIMELINE NOTIFICATIONS BLOCK LIKE TIKTOK */}
          <div className="absolute bottom-16 left-4 max-w-[280px] space-y-1.5 pointer-events-none z-20" id="tiktok-alerts-box">
            {miniNotifications.slice(-4).map((n) => (
              <div 
                key={n.id} 
                className="bg-black/50 backdrop-blur-md border border-white/5 px-2.5 py-1 rounded-xl text-[9px] font-mono text-slate-200 animate-in slide-in-from-left-4 max-w-fit flex items-center gap-1.5"
              >
                <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                <span className="truncate leading-none">{n.text}</span>
              </div>
            ))}
          </div>

          {/* FLOATING ACTION REACTIONS PANEL ON BOTTOM-RIGHT FOR QUICK LIVE USABILITY */}
          {isStreaming && (
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/65 backdrop-blur-md p-1.5 rounded-full border border-white/10 z-30">
              <span className="text-[8.5px] font-mono text-slate-400 px-2 uppercase font-semibold hidden sm:inline">
                {isArabic ? "تفاعل بالحب:" : "Tap to Like:"}
              </span>
              <button 
                onClick={() => handleEmojiClick('❤️')}
                className="w-8 h-8 rounded-full bg-rose-600/20 hover:bg-rose-600 text-rose-455 text-rose-400 hover:text-white transition cursor-pointer flex items-center justify-center font-bold"
                title="Send Love"
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
              <button 
                onClick={() => handleEmojiClick('🔥')}
                className="w-8 h-8 rounded-full bg-amber-600/20 hover:bg-amber-600 text-amber-500 hover:text-white transition cursor-pointer flex items-center justify-center font-bold"
                title="Send Fire"
              >
                <Flame className="w-4 h-4 text-amber-400 hover:text-white" />
              </button>
              <button 
                onClick={() => handleEmojiClick('👑')}
                className="w-8 h-8 rounded-full bg-indigo-650 bg-indigo-500/20 hover:bg-indigo-600 text-indigo-400 hover:text-white transition cursor-pointer flex items-center justify-center font-bold"
                title="Send Crown"
              >
                <Trophy className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleEmojiClick('⚡️')}
                className="w-8 h-8 rounded-full bg-cyan-554 bg-cyan-500/20 hover:bg-cyan-600 text-cyan-400 hover:text-black transition cursor-pointer flex items-center justify-center font-bold"
                title="Send Bolt"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Instructor priorities notifications banner overlay */}
          {activeAlert && (
            <div className="absolute bottom-4 left-4 right-4 bg-slate-950/95 border-2 border-cyan-504 border-cyan-500/40 rounded-2xl p-4 backdrop-blur-md flex items-center justify-between gap-3 animate-bounce z-30 shadow-2xl">
              <div className="flex items-center gap-3">
                <Flame className="w-5.5 h-5.5 text-cyan-400 animate-pulse bg-cyan-950/60 p-1 rounded-full stroke-[2.5]" />
                <p className="text-xs font-sans text-slate-200">
                  <span className="font-bold text-cyan-400 uppercase tracking-wide mr-1.5">
                    {isArabic ? "تنبيه المعلم:" : "INSTRUCTOR ALERT:"}
                  </span>
                  <span className="text-white select-all">{activeAlert}</span>
                </p>
              </div>
              <button
                onClick={clearAlert}
                className="text-[9px] uppercase font-mono tracking-widest text-slate-400 hover:text-white transition h-fit bg-white/5 rounded px-2.5 py-1"
              >
                {isArabic ? "إغلاق" : "Dismiss"}
              </button>
            </div>
          )}
        </div>

        {/* 2. VISUAL ACTIVE USERS/STUDENTS EMBEDDED LIST */}
        <div className="bg-[#080d19]/85 border border-slate-900 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider">
                {isArabic ? "الطلاب والمشرفون المتصلون الآن" : "PEER CADETS TUNED IN LIVE"}
              </h4>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-500/10 font-bold">
                {spectators.length + 1} {isArabic ? "نشط" : "nodes synced"}
              </span>
            </div>
            
            <span className="text-[9.5px] font-mono text-slate-500 uppercase tracking-widest">
              {isArabic ? "تحديث تلقائي كل 5 ثوان" : "auto synchronized"}
            </span>
          </div>

          {/* List of participant avatar cards */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3.5">
            {/* Current loggined user itself to satisfy user demand: "And the tag, I want the tag to appear to me as an admin or as a teacher. The tag should appear to me." */}
            <div className="bg-slate-950/95 border-2 border-cyan-400 rounded-xl p-2.5 flex flex-col justify-center relative shadow-lg shadow-cyan-950/25">
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <div className="flex items-center gap-2">
                <img src={userAvatar} className="w-7 h-7 rounded-full border border-cyan-400" alt={userName} />
                <div className="text-left leading-tight truncate">
                  <p className="text-[10.5px] font-black text-cyan-300 truncate select-all">{userName}</p>
                  <span className="text-[7.5px] font-mono text-slate-400 uppercase tracking-tighter block font-bold">
                    {isArabic ? "أنت (نشط)" : "YOU (ACTIVE)"}
                  </span>
                </div>
              </div>
              <div className="mt-1.5 pt-1.5 border-t border-slate-900">
                <span className="bg-cyan-950 text-cyan-400 text-[8px] font-mono px-1.5 py-0.5 rounded border border-cyan-500/20 font-bold uppercase tracking-tighter block text-center">
                  {getUserRoleTag(userRole)}
                </span>
              </div>
            </div>

            {/* Simulated classmates peer deck */}
            {spectators.map((spec, i) => (
              <div key={i} className="bg-slate-950/40 border border-slate-900/60 rounded-xl p-2.5 flex flex-col justify-center gap-1.5 hover:border-slate-800 transition duration-150">
                <div className="flex items-center gap-2">
                  <img src={spec.avatar} className={`w-7 h-7 rounded-full border ${spec.glowColor}`} alt={spec.name} />
                  <div className="text-left leading-tight truncate">
                    <p className="text-[10.5px] font-medium text-slate-300 truncate">{spec.name}</p>
                    <span className="text-[8px] font-mono text-slate-500 uppercase block tracking-tighter shrink-0">{spec.role}</span>
                  </div>
                </div>
                <div className="pt-1 border-t border-slate-900/40">
                  <span className="text-[7.5px] font-mono text-slate-500 bg-slate-900 px-1 py-0.2 rounded text-center block">
                    {isArabic ? "طالب متفاعل" : "Class Peer"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Title and Instructor metadata cards */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4.5 rounded-2xl border border-slate-900 bg-slate-950/40">
          <div className="space-y-1 text-left">
            <h3 className="text-sm font-sans font-black text-white">
              {isArabic 
                ? "بث فئة البرمجة 101 // تحليل هيكل النواة والتفتيش ثنائي الاتجاه" 
                : "Sec_Group_01 // Assembly & Stack Redirection Pointers Live"}
            </h3>
            <p className="text-xs text-slate-400 leading-normal">
              {isArabic 
                ? "جلسة توضيحية تفاعلية مباشرة مع الدكتورة ثريا فانس لمراجعة الأكواد وبنيات لغات تجميع النواة منخفضة المستوى بوضوح كامل."
                : "Broadcasting secure nodes live with Dr. Soraya Vance. Deep learning kernel exploits & assembly offsets validation."}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/70 p-3 rounded-xl border border-white/5">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150" 
              className="w-9 h-9 rounded-full border border-cyan-500/20" 
              alt="Soraya Vance" 
            />
            <div className="text-left">
              <p className="text-xs font-bold text-slate-200">Dr. Soraya Vance</p>
              <span className="text-[8.5px] font-mono text-cyan-400 uppercase bg-cyan-950/40 px-1.5 py-0.2 rounded border border-cyan-500/20 font-bold">
                {isArabic ? "المدرب المعتمد" : "Lead Instructor"}
              </span>
            </div>
          </div>
        </div>

        {/* Instructor panel buttons if roles permit */}
        {hasTeacherPrivileges && (
          <div className="bg-[#0c0d15] border border-slate-900 rounded-2xl p-5 space-y-4 shadow-xl text-left">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#fff] font-black">
                  {isArabic ? "لوحة التحكم بالبث المباشر للمدرب" : "Professors Live Transmission Dashboard"}
                </h4>
              </div>
              <button
                onClick={toggleBroadcasting}
                className={`px-4.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition ${isStreaming ? 'bg-red-950/30 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black'}`}
              >
                <Power className="w-3.5 h-3.5 animate-pulse" />
                <span>{isStreaming ? (isArabic ? 'إيقاف البث مؤقتاً' : 'PAUSE STREAM') : (isArabic ? 'إعادة تشغيل البث' : 'RESUME STREAM')}</span>
              </button>
            </div>

            {/* Send alarm prompt instantly */}
            <form onSubmit={handleBroadcastAlert} className="flex gap-2">
              <input
                type="text"
                value={broadcastInput}
                onChange={(e) => setBroadcastInput(e.target.value)}
                placeholder={isArabic ? 'اكتب تحذيراً فورياً مع تظليل نيون أحمر وارسله لجميع الطلاب المتفرجين بلحظة واحدة...' : 'Broadcast priority notifications on video timeline now...'}
                className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-cyan-400 text-black font-sans font-black text-xs hover:bg-cyan-300 transition shrink-0 uppercase tracking-wider"
              >
                {isArabic ? "بث التحذير" : "Broadcast Alert"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Streaming Chat Sidebar Column (ظهور تعليقات المستخدمين في البث المباشر) */}
      <div className="lg:col-span-1 flex flex-col h-[600px] border border-slate-900 bg-[#060a13]/55 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
        
        {/* Chat header */}
        <div className="p-3.5 border-b border-white/5 bg-[#03060c] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono text-slate-400 uppercase font-black tracking-wider">
              {isArabic ? "ساحة النقاش المباشر" : "Interactive Live Chat"}
            </span>
          </div>
          <span className="text-[9.5px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {isArabic ? "نشط" : "LIVE_STABLE"}
          </span>
        </div>

        {/* Scroll comments */}
        <div 
          ref={chatScrollRef}
          className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-slate-800"
        >
          {/* Pinned comment banner if active */}
          {pinnedComment && (
            <div className="bg-gradient-to-r from-[#03060c] via-cyan-950/20 to-[#03060c] border border-cyan-500/40 p-3 rounded-2xl animate-in slide-in-from-top-4 flex items-start gap-2.5 text-left shadow-lg mb-4">
              <span className="text-xs shrink-0 select-none">📌</span>
              <div className="flex-1 space-y-0.5 leading-none">
                <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest block font-black">
                  {isArabic ? "تعليق مثبت" : "PINNED COMMENT"}
                </span>
                <span className="text-[10.5px] font-sans font-bold text-white block">
                  {pinnedComment.userName}
                </span>
                <p className="text-[11px] font-sans text-slate-300 leading-relaxed font-medium mt-1">
                  {pinnedComment.text}
                </p>
              </div>
              {hasTeacherPrivileges && (
                <button
                  onClick={async () => {
                    try {
                      await fetch('/api/live/pin', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ comment: null })
                      });
                    } catch (err) {
                      console.error('Failed to clear pinned comment:', err);
                    }
                  }}
                  className="text-[9px] text-slate-500 hover:text-white bg-white/5 border border-white/5 hover:border-white/10 px-1.5 rounded transition py-0.5 shrink-0 cursor-pointer"
                >
                  {isArabic ? "إزالة" : "Clear"}
                </button>
              )}
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className="space-y-1.5 animate-in slide-in-from-bottom border-b border-white/5 pb-2.5 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <img src={msg.userAvatar} className="w-5.5 h-5.5 rounded-full border border-slate-800" alt={msg.userName} />
                  <span className="text-[11px] font-sans font-bold text-slate-200 truncate max-w-[130px]">{msg.userName}</span>
                </div>
                
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Pin comment control for hosts */}
                  {hasTeacherPrivileges && (
                    <button
                      onClick={async () => {
                        try {
                          await fetch('/api/live/pin', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ comment: msg })
                          });
                        } catch (err) {
                          console.error('Failed to pin comment:', err);
                        }
                      }}
                      className="p-1 px-1.5 rounded bg-slate-950 hover:bg-slate-900 text-[8px] font-mono text-cyan-400 hover:text-white border border-cyan-500/15 cursor-pointer flex items-center gap-0.5 transition"
                      title="Pin Comment / تثبيت التعليق"
                    >
                      <Pin className="w-2.5 h-2.5" />
                      <span>{isArabic ? "ثبت" : "Pin"}</span>
                    </button>
                  )}

                  {/* Dynamically assign premium glowing colored tags on user roles */}
                  <span className={`text-[8.5px] font-mono px-1.5 py-0.2 rounded uppercase ${
                    msg.isTeacher || msg.userRole === 'Admin' || msg.userRole === 'Super Admin'
                      ? 'bg-gradient-to-r from-red-950 to-indigo-950 border border-red-500/20 text-red-400 font-bold'
                      : 'bg-slate-900/60 text-slate-400'
                  }`}>
                    {msg.isTeacher || msg.userRole === 'Admin' || msg.userRole === 'Super Admin' 
                      ? (isArabic ? 'مدرب معتمد 👑' : 'Lead Prof 👑') 
                      : (isArabic ? 'طالب ذكي' : 'Cadet')}
                  </span>
                </div>
              </div>
              
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed break-words pl-7">
                {msg.text}
              </p>

              {/* If it's a file attachment (I can also upload files) */}
              {(msg as any).fileAttachment && (
                <div className="mt-1.5 ml-7 bg-cyan-950/25 border border-cyan-555 border-cyan-500/15 p-2 rounded-xl flex items-center justify-between gap-2 text-left">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="p-1.5 bg-slate-950 border border-slate-900 text-cyan-400 rounded-lg text-xs leading-none">📁</span>
                    <div className="min-w-0 leading-tight">
                      <p className="text-[10px] font-sans font-bold text-slate-200 truncate pr-1">{(msg as any).fileAttachment.name}</p>
                      <span className="text-[8.5px] font-mono text-slate-500">{(msg as any).fileAttachment.size || "1.2 MB"}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      alert(isArabic ? `تم تحميل الملف: ${(msg as any).fileAttachment.name} بنجاح.` : `Downloaded file: ${(msg as any).fileAttachment.name} safely.`);
                    }}
                    className="p-1 px-2 bg-cyan-400 hover:bg-cyan-300 text-black rounded font-mono text-[8.5px] font-black uppercase shrink-0 transition cursor-pointer"
                  >
                    Get
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* TikTok Live Stream Input area */}
        <div className="p-3 bg-[#03060c] border-t border-white/5 flex flex-col gap-2">
          {/* Hidden File Input handler for student files upload */}
          <input
            type="file"
            id="stream-file-uploader"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              
              try {
                await fetch('/api/live/message', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    userName,
                    userAvatar,
                    userRole,
                    text: `${isArabic ? '📎 قام برفع ملف الدرس المعتمد:' : '📎 Uploaded a file attachment:'} ${file.name}`,
                    isTeacher: userRole === 'Teacher' || userRole === 'Admin' || userRole === 'Super Admin',
                    fileAttachment: {
                      name: file.name,
                      size: `${(file.size / 1024).toFixed(0)} KB`
                    }
                  })
                });
              } catch (err) {
                console.error('Failed to post file attachment:', err);
              }
            }}
          />

          <form onSubmit={handleSendMessage} className="flex gap-1.5 items-center">
            <button
              type="button"
              onClick={() => document.getElementById('stream-file-uploader')?.click()}
              className="p-2 bg-slate-950 border border-slate-900 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 rounded-xl transition cursor-pointer flex items-center justify-center shrink-0"
              title={isArabic ? "رفع ملفات / كود" : "Upload File / Attach Code"}
            >
              <Paperclip className="w-3.5 h-3.5" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isArabic ? 'اكتب تعليقك ليظهر للجميع بلحظة واحدة...' : 'Write live comment...'}
              className="flex-1 bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition"
            />
            <button
              type="submit"
              className="p-2 bg-cyan-400 hover:bg-cyan-300 text-black rounded-xl transition active:scale-95 shrink-0 cursor-pointer flex items-center justify-center font-bold"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
