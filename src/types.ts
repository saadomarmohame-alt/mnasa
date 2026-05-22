export type UserRole = 'Super Admin' | 'Admin' | 'Teacher' | 'Student' | 'Moderator';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  token?: string;
  bio?: string;
  enrolledCourses: string[]; // Course IDs
  completedLessons: string[]; // Lesson IDs
  certificates: string[]; // Certificate IDs
  isBanned?: boolean;
}

export interface ResourceAttachment {
  name: string;
  type: 'PDF' | 'ZIP' | 'LINK';
  url: string;
  size?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  isPremium: boolean;
  codeSnippet?: string;
  resources?: ResourceAttachment[];
}

export interface CourseSection {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  text: string;
  date: string;
}

export interface Course {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  rating: number;
  reviewsCount: number;
  enrolledCount: number;
  price: number;
  originalPrice: number;
  thumbnail: string;
  instructorName: string;
  instructorAvatar: string;
  instructorBio: string;
  sections: CourseSection[];
  reviews: Review[];
  features?: string[];
  isDynamicUpload?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
}

export interface Quiz {
  courseId: string;
  courseTitle: string;
  questions: QuizQuestion[];
  timeLimitSeconds: number;
}

export interface ExamAttempt {
  courseId: string;
  userId: string;
  score: number;
  passed: boolean;
  date: string;
}

export interface Note {
  id: string;
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  timestamp: string; // MM:SS minutes
  seconds: number;
  content: string;
}

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  score: number;
  credentialId: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Refunded' | 'Failed';
  paymentMethod: 'Stripe' | 'Paymob' | 'Coupon';
  couponCode?: string;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  title: string;
  content: string;
  likes: number;
  replies: {
    userName: string;
    userAvatar: string;
    userRole: UserRole;
    text: string;
    date: string;
  }[];
  category: 'General' | 'Programming' | 'Cybersecurity' | 'Troubleshooting';
  date: string;
}

export interface LiveStreamMessage {
  id: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  text: string;
  isTeacher?: boolean;
}

export interface SecurityLog {
  id: string;
  event: string;
  timestamp: string;
  ipAddress: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  userAgent: string;
}
