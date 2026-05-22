import { Course, Quiz, Transaction, CommunityPost, SecurityLog, User } from './types';

export const mockUsers: User[] = [
  {
    id: 'usr-student',
    name: 'Amir Al-Marzouki',
    email: 'amir@argintini.io',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
    role: 'Student',
    bio: 'Aspiring Full Stack Engineer & Cyber Security enthusiast. Learning the future of Web3 and Artificial Intelligence.',
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
    bio: 'Ex-Google Brain Scientist & MIT AI Labs Fellow. Author of "Quantum Architectures of Deep Learning" and cyber war pioneer.',
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
    bio: 'AL ARGINTINI Director of Academic Operations & Regulatory Compliance.',
    enrolledCourses: [],
    completedLessons: [],
    certificates: []
  },
  {
    id: 'usr-super',
    name: 'Sébastien Aurelius',
    email: 's.aurelius@argintini.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150',
    role: 'Super Admin',
    bio: 'Chief Executive Architect & Founder of AL ARGINTINI Global Learning Network.',
    enrolledCourses: [],
    completedLessons: [],
    certificates: []
  }
];

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Advanced AI & Deep Neural Networks',
    arabicTitle: 'الذكاء الاصطناعي المتقدم والشبكات العصبية العميقة',
    description: 'Master PyTorch, Transformers, LLMs, and neural weight optimization. Build, train, and deploy enterprise-level generative agents from the absolute ground up.',
    arabicDescription: 'احترف بايتورتش، والمحولات، ونماذج اللغات الكبيرة، وتحسين الأوزان العصبية. ابنِ ودرب وانشر وكلاء الذكاء الاصطناعي التوليدي من الصفر.',
    category: 'AI',
    difficulty: 'Advanced',
    duration: '28h 45m',
    rating: 4.9,
    reviewsCount: 1840,
    enrolledCount: 14205,
    price: 199,
    originalPrice: 499,
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
    instructorName: 'Dr. Soraya Vance',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150',
    instructorBio: 'Ex-Google Brain Researcher. Specialized in high performance cognitive models and neural rendering.',
    sections: [
      {
        id: 'sec-1-1',
        title: 'Core Fundamentals & Weight Architectures',
        lessons: [
          {
            id: 'lesson-1-1',
            title: 'Neural Matrix Multiplications in Python',
            duration: '14:20',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            isPremium: false,
            codeSnippet: `import torch\nimport torch.nn as nn\n\n# Constructing a premium 3-layer neural core\nclass NeuralVortex(nn.Module):\n    def __init__(self, in_features, hidden, out_features):\n        super().__init__()\n        self.core = nn.Sequential(\n            nn.Linear(in_features, hidden),\n            nn.GELU(),\n            nn.Dropout(0.15),\n            nn.Linear(hidden, out_features)\n        )\n    def forward(self, x):\n        return self.core(x)`,
            resources: [
              { name: 'PyTorch Advanced Cheatsheet.pdf', type: 'PDF', url: '#', size: '2.4 MB' },
              { name: 'VortexNeuralWeights_v1.zip', type: 'ZIP', url: '#', size: '14.8 MB' }
            ]
          },
          {
            id: 'lesson-1-2',
            title: 'Implementing GELU & Non-Linear Optimizers',
            duration: '18:45',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            isPremium: false,
            codeSnippet: `optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4, weight_decay=1e-2)\nscheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=100)`,
            resources: []
          },
          {
            id: 'lesson-1-3',
            title: 'Holographic Gradient Clipping & Decay Protection',
            duration: '22:10',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            isPremium: true,
            codeSnippet: `torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)`,
            resources: [
              { name: 'MathematicalGradClippingProof.pdf', type: 'PDF', url: '#' }
            ]
          }
        ]
      },
      {
        id: 'sec-1-2',
        title: 'Attention Transformers & Generative LLMs',
        lessons: [
          {
            id: 'lesson-1-4',
            title: 'Demystifying the Multi-Head Attention Mechanism',
            duration: '32:15',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            isPremium: true,
            codeSnippet: `class AttentionHead(nn.Module):\n    def __init__(self, d_model, head_size):\n        super().__init__()\n        self.key = nn.Linear(d_model, head_size, bias=False)\n        self.query = nn.Linear(d_model, head_size, bias=False)\n        self.value = nn.Linear(d_model, head_size, bias=False)\n        \n    def forward(self, x):\n        # Query, Key, Value computation\n        return F.softmax(q @ k.T / d**0.5) @ v`,
            resources: [
              { name: 'Attention_Is_All_You_Need.pdf', type: 'PDF', url: '#', size: '1.2 MB' }
            ]
          },
          {
            id: 'lesson-1-5',
            title: 'Fine-Tuning LoRA Adapters for Enterprise Scaling',
            duration: '25:40',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            isPremium: true,
            codeSnippet: `# Low-Rank Adaptation Matrix configuration\nrank = 8\nalpha = 16\n# Direct freeze layers\nfor p in model.parameters(): p.requires_grad = False`
          }
        ]
      }
    ],
    reviews: [
      { id: 'rev-1', userName: 'Youssef Al-Hendy', userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150', rating: 5, text: 'This course literally got me hired as an AI Lead Architect. Dr. Vance explains the hardest math with such high mental clarity. Recommended for everyone!', date: 'May 12, 2026' },
      { id: 'rev-2', userName: 'Katrina V.', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150', rating: 5, text: 'Simply gorgeous styling on this platform. The video player notes tracking is incredibly smooth. The content is pure gold.', date: 'April 29, 2026' }
    ]
  },
  {
    id: 'course-2',
    title: 'Ethical Hacking: Zero to Kernel exploiter',
    arabicTitle: 'الهكر الأخلاقي: من الصفر إلى استغلال النواة',
    description: 'Learn Assembly x86/x64, buffer overflows, kernel exploitation, and automated network defense systems. Perform elite advanced vulnerability researching.',
    arabicDescription: 'تعلم لغة الأسمبلي، وتجاوز سعة المخزن المؤقت، واستغلال النواة، وأنظمة الدفاع التلقائي للشبكات. نفذ أبحاث الثغرات الأمنية المتقدمة.',
    category: 'Ethical Hacking',
    difficulty: 'Advanced',
    duration: '34h 12m',
    rating: 4.95,
    reviewsCount: 3120,
    enrolledCount: 18950,
    price: 249,
    originalPrice: 599,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    instructorName: 'Jack Ransom (PayloadX)',
    instructorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150',
    instructorBio: 'Former DoD Red Team Commander. Specialized in active malware reverse-engineering and zero-day defense architectures.',
    sections: [
      {
        id: 'sec-2-1',
        title: 'Buffer Overflows & Stack Smashing',
        lessons: [
          {
            id: 'lesson-2-1',
            title: 'Modern Memory Layouts: Stack vs Heap',
            duration: '18:10',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            isPremium: false,
            codeSnippet: `#include <stdio.h>\n#include <string.h>\n\n// Classic vulnerable stack array\nvoid vuln_core(char* input) {\n    char buffer[64];\n    strcpy(buffer, input); // Danger: No length limit bounds\n}`,
            resources: [
              { name: 'MemoryLayoutSlides.pdf', type: 'PDF', url: '#' }
            ]
          },
          {
            id: 'lesson-2-2',
            title: 'Overwriting EIP / RIP Register Pointers',
            duration: '26:50',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            isPremium: true,
            codeSnippet: `import struct\n\n# Constructing shell payload packet\npadding = b"A" * 72\noverwrite_rip = struct.pack("<Q", 0x7fffffffe4b0) # Redirect pointer\npayload = padding + overwrite_rip`
          }
        ]
      }
    ],
    reviews: [
      { id: 'rev-3', userName: 'Sami Abu-Shanab', userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150', rating: 5, text: 'This is state of the art. Zero hand-holding. Teaches you true security architecture, reverse engineering, and assembly from lines of code.', date: 'May 19, 2026' }
    ]
  },
  {
    id: 'course-3',
    title: 'Next.js 15 & Fullstack Luxury Web Apps',
    arabicTitle: 'نكست جيه إس ١٥ وتطوير تطبيقات الويب الفاخرة',
    description: 'Build hyper-fast reactive platforms using Turbopack, React Server Components (RSC), complex state streaming, and multi-layered server caching pools.',
    arabicDescription: 'ابنِ منصات فائقة السرعة باستخدام توربوباك، ومكونات خادم ريأكت، وتدفق الحالة المعقد، وخزانات التخزين المؤقت للخادم متعددة الطبقات.',
    category: 'Web Development',
    difficulty: 'Intermediate',
    duration: '22h 10m',
    rating: 4.88,
    reviewsCount: 950,
    enrolledCount: 7820,
    price: 149,
    originalPrice: 399,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    instructorName: 'Leila Kincaid',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150',
    instructorBio: 'Senior React Engineer. Dedicated advocate for smooth web flows, visual typography, and modular codebase architectures.',
    sections: [
      {
        id: 'sec-3-1',
        title: 'React Server Components deep-dive',
        lessons: [
          {
            id: 'lesson-3-1',
            title: 'RSC Architecture & Data Stream Hydration',
            duration: '20:30',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            isPremium: false,
            codeSnippet: `// Server action module retrieving data securely\nexport async function fetchMetrics() {\n  "use server";\n  const res = await fetch('https://api.argintini.io/analytics', {\n    next: { revalidate: 3600 }\n  });\n  return res.json();\n}`
          }
        ]
      }
    ],
    reviews: []
  },
  {
    id: 'course-4',
    title: 'Cybersecurity Incident Response & AI Shields',
    arabicTitle: 'الاستجابة للحوادث الأمنية ودروع الذكاء الاصطناعي',
    description: 'Construct reactive perimeter AI firewalls capable of detecting, analyzing, and self-patching zero-day vulnerabilities in under 500 milliseconds.',
    arabicDescription: 'أنشئ جدران حماية تفاعلية قادرة على اكتشاف ثغرات اليوم الصفر وتحليلها وترقيعها ذاتياً في أقل من ٥٠٠ جزء من الثانية.',
    category: 'Cybersecurity',
    difficulty: 'Advanced',
    duration: '31h 0m',
    rating: 4.98,
    reviewsCount: 1205,
    enrolledCount: 11500,
    price: 229,
    originalPrice: 549,
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    instructorName: 'Jack Ransom (PayloadX)',
    instructorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150',
    instructorBio: 'Former DoD Red team commander specializing in high performance military cyber-defense networks.',
    sections: [
      {
        id: 'sec-4-1',
        title: 'Real-time Vector Analysis of Packets',
        lessons: [
          {
            id: 'lesson-4-1',
            title: 'Neural Scanning of TCP Streams with PyTorch',
            duration: '22:15',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            isPremium: false,
            codeSnippet: `# AI packet validation engine\ndef scan_packet(bytes_payload):\n    tensor_inp = normalize_bytes(bytes_payload)\n    prediction = cyber_shield_model(tensor_inp)\n    return "DENY" if prediction > 0.95 else "ALLOW"`
          }
        ]
      }
    ],
    reviews: []
  }
];

export const mockQuizzes: Quiz[] = [
  {
    courseId: 'course-1',
    courseTitle: 'Advanced AI & Deep Neural Networks',
    timeLimitSeconds: 300, // 5 minutes
    questions: [
      {
        id: 'q1-1',
        question: 'Which activation function is preferred in the Transformer block and helps alleviate dying ReLU symptoms by injecting smooth gradients?',
        options: [
          'Sigmoid function',
          'Standard Absolute Rectilinear (ReLU)',
          'Gaussian Error Linear Unit (GELU)',
          'Hyperbolic Tangent (Tanh)'
        ],
        correctAnswer: 2
      },
      {
        id: 'q1-2',
        question: 'What is the mathematically rigorous operation behind Multi-Head Attention layer weight tracking?',
        options: [
          'Linear Dot-Product with Scaling Factor (Softmax(Q K^T / √d_k) V)',
          'Simple Average summation of matrices',
          'Sigmoid feedback convolution recursion',
          'Fourier transform filter bypass'
        ],
        correctAnswer: 0
      },
      {
        id: 'q1-3',
        question: 'In Cosine Annealing learning rate schedules, what is the terminal step value generally targeting?',
        options: [
          'Twice the peak training weight',
          'Direct zeroing or minimum configured learning rate scale',
          'Instantaneous absolute infinity',
          'Static uniform learning rate factor'
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    courseId: 'course-2',
    courseTitle: 'Ethical Hacking: Zero to Kernel exploiter',
    timeLimitSeconds: 240, // 4 minutes
    questions: [
      {
        id: 'q2-1',
        question: 'Which CPU register receives the stack redirection instruction for program pointer flows?',
        options: [
          'EAX Register',
          'RIP / EIP (Instruction Pointer)',
          'CR3 Memory Map Directory',
          'RSP Pointer Stack Frame'
        ],
        correctAnswer: 1
      },
      {
        id: 'q2-2',
        question: 'What is the purpose of a NOP Sled (0x90 array) in ancient buffer overflows?',
        options: [
          'Force direct system shut down routines',
          'Enrich visual memory colors in debugging screen',
          'Provide padding for variable offset drifts allowing direct sliding execution of shellcode',
          'Encrypting the packet transfers from passive network sniffers'
        ],
        correctAnswer: 2
      }
    ]
  }
];

export const mockTransactions: Transaction[] = [
  { id: 'tx-1', userId: 'usr-student', userName: 'Amir Al-Marzouki', courseId: 'course-1', courseTitle: 'Advanced AI & Deep Neural Networks', amount: 199, date: '2026-05-18T10:30:00Z', status: 'Completed', paymentMethod: 'Stripe' },
  { id: 'tx-2', userId: 'usr-student', userName: 'Amir Al-Marzouki', courseId: 'course-2', courseTitle: 'Ethical Hacking: Zero to Kernel exploiter', amount: 249, date: '2026-05-20T14:45:00Z', status: 'Completed', paymentMethod: 'Paymob' },
  { id: 'tx-3', userId: 'usr-other1', userName: 'Elena Petrova', courseId: 'course-1', courseTitle: 'Advanced AI & Deep Neural Networks', amount: 199, date: '2026-05-21T09:12:00Z', status: 'Completed', paymentMethod: 'Stripe' },
  { id: 'tx-4', userId: 'usr-other2', userName: 'Fariq Al-Taji', courseId: 'course-3', courseTitle: 'Next.js 15 & Fullstack Luxury Web Apps', amount: 0, date: '2026-05-22T08:05:00Z', status: 'Completed', paymentMethod: 'Coupon', couponCode: 'ARGINTINI_VIP' },
  { id: 'tx-5', userId: 'usr-other3', userName: 'Chloe Dubois', courseId: 'course-2', courseTitle: 'Ethical Hacking: Zero to Kernel exploiter', amount: 249, date: '2026-05-22T12:00:00Z', status: 'Failed', paymentMethod: 'Stripe' }
];

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    userId: 'usr-student',
    userName: 'Amir Al-Marzouki',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
    userRole: 'Student',
    title: 'Solving Tensor Dimensional mismatch in PyTorch Layer 2',
    content: 'Hi everyone, I was writing the forward pass for our GELU optimizer and got "RuntimeError: mat1 and mat2 shapes cannot be multiplied (64x256 and 128x512)". Looks like the preceding layer needs to be modified. Has anyone scaled this class?',
    likes: 8,
    category: 'Programming',
    date: 'May 21, 2026',
    replies: [
      {
        userName: 'Dr. Soraya Vance',
        userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150',
        userRole: 'Teacher',
        text: 'Hello Amir! The linear input expectation of our second matrix needs to match self.hidden dimensions exactly (which is 256). Check if your source dataset batch inputs are normalized to 256. If not, update nn.Linear in_features to match.',
        date: 'May 21, 2026'
      }
    ]
  },
  {
    id: 'post-2',
    userId: 'usr-other2',
    userName: 'Chloe Dubois',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150',
    userRole: 'Student',
    title: 'Tips for passing the Ethical Hacking Kernel exploit module?',
    content: 'The timed exam is challenging! Getting a 100% score needs strict timing. Should I focus on RIP pointer calculations or assembly offsets? Help is highly appreciated!',
    likes: 12,
    category: 'Cybersecurity',
    date: 'May 22, 2026',
    replies: [
      {
        userName: 'Jack Ransom (PayloadX)',
        userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150',
        userRole: 'Teacher',
        text: 'Chloe, definitely master the specific rip pointer formulas (adding padding buffer size to pointer width bounds). The exam generates randomized question values, so working through the python struct tool on a whiteboard first is the quickest flow!',
        date: 'May 22, 2026'
      }
    ]
  }
];

export const mockSecurityLogs: SecurityLog[] = [
  { id: 'log-1', event: 'Enterprise Core SQL Injection shield triggered - query neutralized', timestamp: '2026-05-22T18:45:10Z', ipAddress: '194.22.41.98', severity: 'WARNING', userAgent: 'BurpSuite/Pro v2.4' },
  { id: 'log-2', event: 'Session token signature signature validated for Super Admin authorization', timestamp: '2026-05-22T19:01:22Z', ipAddress: '82.16.141.22', severity: 'INFO', userAgent: 'Mozilla/5.0 Chrome/125.0.0.0' },
  { id: 'log-3', event: 'Anti-Piracy Screen Recording Block: Watermark layer injected strictly', timestamp: '2026-05-22T19:05:00Z', ipAddress: '127.0.0.1', severity: 'INFO', userAgent: 'Safari/17.4 macOS' },
  { id: 'log-4', event: 'Rate Limiter protected course-1 streaming buffer bounds: 0.04% delay', timestamp: '2026-05-22T19:10:45Z', ipAddress: '54.21.12.98', severity: 'INFO', userAgent: 'ArgintiniStreamer/ClientEngine' },
  { id: 'log-5', event: 'Unauthorized attempt to inspect locked lesson-1-3 payload denied: code 403', timestamp: '2026-05-22T19:11:12Z', ipAddress: '198.51.100.2', severity: 'CRITICAL', userAgent: 'curl/8.4.0' }
];

export const mockAnnouncements = [
  { id: 'ann-1', teacher: 'Dr. Soraya Vance', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150', title: 'Live Session scheduled: Quantum Deep Learning weights', text: 'We will be looking at real-time dynamic training weight visualizations live in our interactive studio console this Friday at 20:00 UTC. Grab your PyTorch notebook and join early with live audio feedback!', date: 'May 22, 2026' },
  { id: 'ann-2', teacher: 'Jack Ransom (PayloadX)', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150', title: 'Zero Day exploits dataset posted!', text: 'The binary offsets analysis payload zip is now accessible in attachments under Lesson 2-2. Happy reversing! Use virtual machines only.', date: 'May 20, 2026' }
];
