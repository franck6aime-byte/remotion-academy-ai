export interface Question {
  id: string;
  statement: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  moduleId: string;
  questions: Question[];
}

export interface ValidationCriterion {
  id: string;
  description: string;
  check: (code: string) => boolean | { passed: boolean; message: string };
}

export interface Exercise {
  id: string;
  lessonId: string;
  title: string;
  instructions: string;
  codeInitial: string;
  codeSolution: string;
  validationCriteria: { id: string; description: string; pattern: string; message: string }[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  order: number;
  slug: string;
  title: string;
  durationMinutes: number;
  xp: number;
  content: string; // Course content
  exercise?: Exercise;
}

export interface Module {
  id: string;
  order: number;
  title: string;
  description: string;
  xpTotal: number;
  lessons: Lesson[];
  quiz: Quiz;
}

export interface Badge {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface RenderItem {
  id: string;
  title: string;
  code: string;
  status: 'queued' | 'rendering' | 'done' | 'failed';
  progress: number;
  url?: string;
  durationSeconds: number;
  createdAt: string;
  source: 'exercise' | 'playground';
  error?: string;
}

export interface UserProfile {
  username: string;
  avatarUrl: string;
  xp: number;
  level: number;
  streakCount: number;
  streakLastDate?: string;
  unlockedBadges: string[]; // Badge slug list
  completedLessons: string[]; // Lesson id list
  quizScores: Record<string, number>; // quizId -> percentage
  exerciseSubmissions: Record<string, { code: string; status: 'draft' | 'passed'; feedback: string }>;
  certificates: { id: string; academyId: string; code: string; date: string }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  thinking?: string; // Optional reasoning or thinking process
}
