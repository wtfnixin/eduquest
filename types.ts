// Fix: Import `ReactNode` and use it for the `icon` property to solve the "Cannot find namespace 'JSX'" error.
import type { ReactNode } from 'react';

export interface Subject {
  name: string; // English name for API
  nameKey: string; // Key for translation
  icon: ReactNode;
  color: string;
  topics: string[];
}

export interface LessonPart {
  type: 'story' | 'challenge';
  content: string;
}

export interface Lesson {
  title: string;
  story: LessonPart[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Badge {
  name: string;
  icon: string; // Emoji or URL
  description: string;
  points: number;
}

export interface UserProgress {
  points: number;
  badges: Badge[];
  completedTopics: {
    [subjectName: string]: string[];
  };
}

export interface Language {
    name: string;
    code: string;
}

export type View = 'classSelector' | 'dashboard' | 'lesson' | 'quiz';