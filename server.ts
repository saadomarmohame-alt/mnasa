import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// Strict typing for synchronized live state indeed
interface LiveStreamMessage {
  id: string;
  userName: string;
  userAvatar: string;
  userRole: string;
  text: string;
  isTeacher?: boolean;
  isSimulated?: boolean;
  fileAttachment?: {
    name: string;
    size: string;
  };
}

interface CoHost {
  name: string;
  avatar: string;
  active: boolean;
}

interface LiveState {
  messages: LiveStreamMessage[];
  miniNotifications: { id: string; text_en: string; text_ar: string }[];
  heartsCount: number;
  pinnedComment: LiveStreamMessage | null;
  activeUsersCount: number;
  activeCohosts: Record<string, CoHost>;
  activeAlert: string | null;
}

// Initial seed live stream comments to populate the feed initially
const initialMessages: LiveStreamMessage[] = [
  { id: '1', userName: 'Zachary Stark', userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150', userRole: 'Student', text: 'Wait, does the kernel exploit work on Unix-flavor architectures too?' },
  { id: '2', userName: 'Dr. Soraya Vance', userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150', userRole: 'Teacher', text: 'Unix structures use slightly different stack pointer boundaries. We will see the kernel payloads live now.', isTeacher: true },
  { id: '3', userName: 'Elena Petrova', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150', userRole: 'Student', text: 'This visual interface is absolutely incredible. Watching the streams feels like being inside a luxury SpaceX console!' },
];

const liveState: LiveState = {
  messages: initialMessages,
  miniNotifications: [
    { id: 'n1', text_en: 'Shady Adel joined the live stream', text_ar: 'شادي عادل انضم للبث المباشر المثير' },
    { id: 'n2', text_en: 'Ahmed Samir liked the broadcast ❤️', text_ar: 'أحمد سمير أرسل إعجاباً تفاعلياً ❤️' }
  ],
  heartsCount: 1420,
  pinnedComment: null,
  activeUsersCount: 382,
  activeCohosts: {},
  activeAlert: null
};

// Periodic background thread to synchronize mock student chats and live engagements across ALL browsers/clients
setInterval(() => {
  // 1. Drifting viewer metrics
  const drift = Math.floor(Math.random() * 5) - 2;
  liveState.activeUsersCount = Math.max(120, liveState.activeUsersCount + drift);

  // 2. Feed simulation comments (visible to everyone)
  if (Math.random() > 0.4) {
    const questions = [
      { name: 'Kariim S.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150', role: 'Student', text_en: 'Should we run the shellcode on standard Docker layers first?', text_ar: 'هل يجب تشغيل كود الشيل في طبقات دوكر أولاً؟' },
      { name: 'Chloe Dubois', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150', role: 'Student', text_en: 'The mathematical cosine annealing gradient is beautiful! Extremely satisfying representation.', text_ar: 'المنحنى الرياضي للتدرج جميل جداً والتمثيل مرضٍ للغاية!' },
      { name: 'Fariq Al-Taji', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150', role: 'Student', text_en: 'Are notes automatically synced under our personal student notebooks?', text_ar: 'هل تتم مزامنة الملاحظات تلقائياً في دفتر كود الطالب؟' },
      { name: 'Elena Petrova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150', role: 'Student', text_en: 'Brilliant stream, the assembly pointers are so sharp.', text_ar: 'بث عبقري، ومؤشرات الأسمبلي واضحة وحادة.' }
    ];
    const chosen = questions[Math.floor(Math.random() * questions.length)];
    const isAr = Math.random() > 0.5;
    const textMsg = isAr ? chosen.text_ar : chosen.text_en;

    const newMsg: LiveStreamMessage = {
      id: `sim-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userName: chosen.name,
      userAvatar: chosen.avatar,
      userRole: chosen.role,
      text: textMsg,
      isSimulated: true
    };

    liveState.messages.push(newMsg);
    if (liveState.messages.length > 100) {
      liveState.messages.shift();
    }
  }

  // 3. Mini notifications feed (visible to everyone)
  if (Math.random() > 0.6) {
    const peoples = ['Marwan Ali', 'Sarah Conner', 'Sami Al-Yami', 'Omar Mansour', 'Rania Fawzi', 'Saeed Hammad'];
    const actions = [
      { en: 'joined the live stream', ar: 'انضم إلى البث المباشر للمنصة' },
      { en: 'sent a super heart ❤️', ar: 'أرسل قلباً فائقاً ❤️' },
      { en: 'shared the stream link', ar: 'شارك رابط البث مع الأصدقاء 🔗' },
      { en: 'liked the live stream 🔥', ar: 'أبدى إعجابه بالبث المباشر 🔥' },
      { en: 'followed the teacher 👑', ar: 'تابع حساب المعلم للاستفادة 👑' }
    ];

    const pName = peoples[Math.floor(Math.random() * peoples.length)];
    const act = actions[Math.floor(Math.random() * actions.length)];

    liveState.miniNotifications.push({
      id: `sim-not-${Date.now()}`,
      text_en: `${pName} ${act.en}`,
      text_ar: `${pName} ${act.ar}`
    });

    if (liveState.miniNotifications.length > 5) {
      liveState.miniNotifications.shift();
    }
  }
}, 7000);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Crucial: body parser middleware indeed
  app.use(express.json());

  // === DYNAMIC LIVE-SYNC API OVERRIDES ===

  // Sync state endpoint retrieves latest authoritative messages, views count, pins, cohosts, etc.
  app.get('/api/live/sync', (_req, res) => {
    res.json({
      status: 'ok',
      state: liveState
    });
  });

  // Appends a real comment or lesson file upload authored by any client
  app.post('/api/live/message', (req, res) => {
    const { id, userName, userAvatar, userRole, text, isTeacher, fileAttachment } = req.body;
    
    const newMsg: LiveStreamMessage = {
      id: id || `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userName: userName || 'Anonymous',
      userAvatar: userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
      userRole: userRole || 'Student',
      text: text || '',
      isTeacher: !!isTeacher,
      isSimulated: false // written by a real user!
    };

    if (fileAttachment) {
      newMsg.fileAttachment = {
        name: fileAttachment.name,
        size: fileAttachment.size || '1.1 MB'
      };
    }

    liveState.messages.push(newMsg);
    if (liveState.messages.length > 100) {
      liveState.messages.shift();
    }

    res.json({ success: true, message: newMsg });
  });

  // Host pinning operations
  app.post('/api/live/pin', (req, res) => {
    const { comment } = req.body;
    liveState.pinnedComment = comment || null;
    res.json({ success: true, pinnedComment: liveState.pinnedComment });
  });

  // Dynamic tap likes reaction counts incrementer
  app.post('/api/live/heart_react', (req, res) => {
    const { increment, emoji, sender } = req.body;
    const value = increment || 1;
    liveState.heartsCount += value;

    // Push custom mini notification live if a real user liked the stream
    if (emoji && sender) {
      liveState.miniNotifications.push({
        id: `react-not-${Date.now()}`,
        text_en: `${sender} sent a ${emoji} reaction!`,
        text_ar: `${sender} أرسل تفاعلاً ${emoji} للبث`
      });
      if (liveState.miniNotifications.length > 5) {
        liveState.miniNotifications.shift();
      }
    }

    res.json({ success: true, heartsCount: liveState.heartsCount });
  });

  // Cohost camera toggle feeds
  app.post('/api/live/cohost_cam', (req, res) => {
    const { userId, name, avatar, active } = req.body;
    if (!active) {
      delete liveState.activeCohosts[userId];
    } else {
      liveState.activeCohosts[userId] = { name, avatar, active: true };
    }
    res.json({ success: true, activeCohosts: liveState.activeCohosts });
  });

  // Broadcast alert sync
  app.post('/api/live/alert', (req, res) => {
    const { activeAlert } = req.body;
    liveState.activeAlert = activeAlert || null;
    res.json({ success: true, activeAlert: liveState.activeAlert });
  });

  app.post('/api/live/clear_alert', (_req, res) => {
    liveState.activeAlert = null;
    res.json({ success: true });
  });


  // === DEVELOPMENT vs. PRODUCTION STRATEGY ===
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AL ARGINTINI SERVER] Direct synced gateway actively handling endpoints inside port ${PORT}`);
  });
}

startServer();
