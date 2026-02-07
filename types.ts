
export interface LessonExample {
  title: string;
  detail: string;
  icon?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonItem {
  id: string;
  title: string;
  content: string; 
  explanation: string; 
  examples: LessonExample[]; 
  soundText: string;
  quiz?: QuizQuestion[]; // 10 questions per lesson
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  lessons: LessonItem[];
}

export type ViewState = 'dashboard' | 'subject' | 'lesson' | 'quiz' | 'result';
