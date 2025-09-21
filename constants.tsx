import React from 'react';
import type { Subject, Badge, Language } from './types';

// SVG Icons for Subjects
const MathIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-5.747h18M14.121 16.364l-8.485-8.485M5.636 16.364l8.485-8.485" />
  </svg>
);

const ScienceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547 2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l.477 2.387a2 2 0 001.806.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l2.387-.477a2 2 0 00.547-1.022a2 2 0 00-1.022-1.022l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
  </svg>
);

const SocialScienceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.543l.586-.586a2 2 0 012.828 0l2.172 2.172a2 2 0 010 2.828l-2.172 2.172a2 2 0 01-2.828 0l-.586-.586m3.536 0l2.828-2.829a2 2 0 012.828 0l.586.586" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    </svg>
);

const EnglishIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 21.75h4.5a2.25 2.25 0 002.25-2.25V15M3 3v1.5A2.5 2.5 0 005.5 7H10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v1.5A2.5 2.5 0 0111.5 7H7" />
    </svg>
);

const HindiIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 12C7.343 12 6 10.657 6 9s1.343-3 3-3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9h3a3 3 0 013 3v3m-6 3h6M9 18s-1.5-1.5-1.5-3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 12A8.25 8.25 0 113.75 12" />
    </svg>
);


export const SUBJECTS: Subject[] = [
  { 
    name: 'Mathematics', 
    nameKey: 'mathematics',
    icon: <MathIcon />, 
    color: 'bg-blue-500', 
    topics: [] 
  },
  { 
    name: 'Science', 
    nameKey: 'science',
    icon: <ScienceIcon />, 
    color: 'bg-green-500', 
    topics: [] 
  },
  { 
    name: 'Social Science', 
    nameKey: 'socialScience',
    icon: <SocialScienceIcon />, 
    color: 'bg-yellow-500', 
    topics: []
  },
  { 
    name: 'English',
    nameKey: 'english',
    icon: <EnglishIcon />, 
    color: 'bg-red-500', 
    topics: []
  },
  { 
    name: 'Hindi',
    nameKey: 'hindi',
    icon: <HindiIcon />, 
    color: 'bg-orange-500', 
    topics: []
  },
];

export const ALL_BADGES: Badge[] = [
    { name: 'Newbie', icon: '🔰', description: 'Just getting started!', points: 10 },
    { name: 'Apprentice', icon: '🧑‍🎓', description: 'Completed 5 lessons.', points: 50 },
    { name: 'Scholar', icon: '🧐', description: 'Mastered a subject!', points: 100 },
    { name: 'Explorer', icon: '🧭', description: 'Explored all subjects.', points: 200 },
    { name: 'Guru', icon: '👑', description: 'Achieved the highest level!', points: 500 },
];

export const LANGUAGES: Language[] = [
    { name: 'English', code: 'en' },
    { name: 'Hindi', code: 'hi' },
    { name: 'Bengali', code: 'bn' },
    { name: 'Tamil', code: 'ta' },
    { name: 'Telugu', code: 'te' },
    { name: 'Punjabi', code: 'pa' },
    { name: 'Odia', code: 'or' },
];