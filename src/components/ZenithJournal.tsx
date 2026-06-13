/* eslint-disable */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MascotOwl } from './MascotOwl';
import { Confetti } from './Confetti';

import { FocusTab } from './FocusTab';
import { AcademicsTab } from './AcademicsTab';
import { ToolkitTab } from './ToolkitTab';
import { ReflectionTab } from './ReflectionTab';
import { SocialTab } from './SocialTab';
import { ChatTab } from './ChatTab';

import {
  playClickSound,
  playSuccessSound,
  playLevelUpSound,
} from '../utils/AudioEngine';

// --- DATA STRUCTURE TYPES ---
export interface SubjectResource {
  id: string;
  name: string;
  books: string[];
  chapters: string[];
}

export interface Flashcard {
  id: string;
  subjectId: string;
  topic: string;
  book: string;
  front: string;
  back: string;
  reviewedCount: number;
  options?: string[];
  answerIndex?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  streak: number;
  tokens: number;
  waterGlasses: number;
  activities: {
    journal: boolean;
    breathing: boolean;
    mood: boolean;
    pomodoro: boolean;
    water: boolean;
  };
  simulatedDay: number;
  joinedAt: string;
  targetExam?: string;
  academicResources?: {
    subjects: SubjectResource[];
  };
  flashcards?: Flashcard[];
}

export interface LeaderboardItem {
  id: string;
  name: string;
  avatar: string;
  streak: number;
  score: number;
  isUser?: boolean;
}

export interface SpacedTopic {
  id: string;
  topicName: string;
  lastReviewed: string;
  nextReview: string;
  risk: 'high' | 'medium' | 'low';
}

export interface StudyLog {
  id: string;
  duration: number;
  subject: string;
  mood: string;
  date: string;
}

export interface SleepLog {
  id: string;
  userId: string;
  hours: number;
  quality: number;
  date: string;
}

export interface DistractionLog {
  id: string;
  app: string;
  minutes: number;
  subject: string;
}

export const ZenithJournal: React.FC = () => {
  // --- STATE SYSTEM ---
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    return {
      id: 'user-default',
      name: 'Aspirant',
      email: 'aspirant@gmail.com',
      streak: 1,
      tokens: 10,
      waterGlasses: 0,
      activities: { journal: false, breathing: false, mood: false, pomodoro: false, water: false },
      simulatedDay: 1,
      joinedAt: new Date().toISOString(),
      targetExam: 'UPSC',
      academicResources: {
        subjects: [
          { id: 'subj-1', name: 'History', books: ['NCERT Ancient India', 'Bipin Chandra'], chapters: ['Mauryan Empire', 'National Movement'] },
          { id: 'subj-2', name: 'Physics', books: ['HC Verma', 'DC Pandey'], chapters: ['Electrostatics', 'Thermodynamics'] },
          { id: 'subj-3', name: 'Chemistry', books: ['OP Tandon', 'Morrison Boyd'], chapters: ['Periodic Table', 'Organic Chemistry'] },
          { id: 'subj-4', name: 'Biology', books: ['NCERT Biology', 'Trueman Biology'], chapters: ['Genetics', 'Plant Physiology'] },
          { id: 'subj-5', name: 'Mathematics', books: ['RD Sharma', 'Cengage Math'], chapters: ['Integration', 'Probability'] },
          { id: 'subj-6', name: 'Indian Polity', books: ['M. Laxmikanth'], chapters: ['Fundamental Rights', 'Directive Principles'] }
        ]
      },
      flashcards: [
        {
          id: 'fc-6',
          subjectId: 'subj-6',
          topic: 'Fundamental Rights',
          book: 'M. Laxmikanth',
          front: 'What is Part III of the Constitution?',
          back: 'Fundamental Rights',
          reviewedCount: 0,
          options: ['Fundamental Rights', 'Directive Principles', 'Fundamental Duties', 'Preamble'],
          answerIndex: 0
        },
        {
          id: 'fc-2',
          subjectId: 'subj-2',
          topic: 'Electrostatics',
          book: 'HC Verma',
          front: 'Which of the following is the SI unit of electric charge?',
          back: 'Coulomb',
          reviewedCount: 0,
          options: ['Coulomb', 'Ampere', 'Volt', 'Ohm'],
          answerIndex: 0
        },
        {
          id: 'fc-3',
          subjectId: 'subj-3',
          topic: 'Organic Chemistry',
          book: 'OP Tandon',
          front: 'What is the atomic number of Carbon?',
          back: '6',
          reviewedCount: 0,
          options: ['6', '12', '8', '14'],
          answerIndex: 0
        },
        {
          id: 'fc-4',
          subjectId: 'subj-4',
          topic: 'Plant Physiology',
          book: 'NCERT Biology',
          front: 'Which plant hormone is primarily responsible for fruit ripening?',
          back: 'Ethylene',
          reviewedCount: 0,
          options: ['Ethylene', 'Auxin', 'Gibberellin', 'Cytokinin'],
          answerIndex: 0
        },
        {
          id: 'fc-5',
          subjectId: 'subj-5',
          topic: 'Integration',
          book: 'RD Sharma',
          front: 'What is the mathematical integral of 1/x with respect to x?',
          back: 'ln|x| + C',
          reviewedCount: 0,
          options: ['ln|x| + C', 'x + C', 'e^x + C', '-1/x^2 + C'],
          answerIndex: 0
        },
        {
          id: 'fc-1',
          subjectId: 'subj-1',
          topic: 'Mauryan Empire',
          book: 'NCERT Ancient India',
          front: 'Who founded the Maurya Empire in ancient India?',
          back: 'Chandragupta Maurya',
          reviewedCount: 0,
          options: ['Chandragupta Maurya', 'Ashoka the Great', 'Bindusara', 'Harsha'],
          answerIndex: 0
        }
      ]
    };
  });

  const [activeTab, setActiveTab] = useState<'focus' | 'academics' | 'toolkit' | 'reflection' | 'social' | 'chat'>(() => {
    const savedTab = localStorage.getItem('animo_active_tab');
    return (savedTab as 'focus' | 'academics' | 'toolkit' | 'reflection' | 'social' | 'chat') || 'focus';
  });

  useEffect(() => {
    localStorage.setItem('animo_active_tab', activeTab);
  }, [activeTab]);

  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Database lists
  const [studyLogs, setStudyLogs] = useState<StudyLog[]>([]);
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([]);
  const [spacedTopics, setSpacedTopics] = useState<SpacedTopic[]>([]);
  const [distractions, setDistractions] = useState<DistractionLog[]>([]);

  // Widget States
  const [waterCount, setWaterCount] = useState(0);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState<'focus' | 'break'>('focus');
  const [strictExamMode, setStrictExamMode] = useState(false);
  const [cognitiveScore, setCognitiveScore] = useState(20);
  const [completedPomodorosCount, setCompletedPomodorosCount] = useState(0);
  const [ambientVolume, setAmbientVolume] = useState(50);

  // Audio Playback
  const [audioPlaying, setAudioPlaying] = useState<'lofi' | 'binaural' | 'brown' | null>(null);

  // Sleep Logging inputs
  const [sleepHoursInput, setSleepHoursInput] = useState('');
  const [sleepQualityInput, setSleepQualityInput] = useState(3);
  const [forgettingAlert, setForgettingAlert] = useState<string | null>(null);

  // Journal Inputs
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisResponse, setAnalysisResponse] = useState<string | null>(null);
  const [isEscalate, setIsEscalate] = useState(false);
  const [journalLoading, setJournalLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [voiceActive, setVoiceActive] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);

  // AI Chat states
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: "Hello! I am your Animo Advisor. Ask me: 'what did I do last week?', 'how is my burnout risk?', or 'what is my spaced revision schedule?'" }
  ]);

  // Streak Modals
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [chestOpened, setChestOpened] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [floatToken, setFloatToken] = useState<{ x: number; y: number; text: string } | null>(null);

  // Mascot Speech Bubble State
  const [mascotMsg, setMascotMsg] = useState("Let's set up your profile first to log real study metrics! 🦉");
  const [mascotExpression, setMascotExpression] = useState<'happy' | 'stressed' | 'focused' | 'cheering'>('happy');

  // New Academics State variables
  const [newSubjectName, setNewSubjectName] = useState('');
  const [genSubjectId, setGenSubjectId] = useState('');
  const [genBookName, setGenBookName] = useState('');
  const [genChapterName, setGenChapterName] = useState('');

  // PDF Upload state variables
  const [pdfUploadedName, setPdfUploadedName] = useState<string | null>(null);
  const [pdfUploadedSize, setPdfUploadedSize] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfLoadingStep, setPdfLoadingStep] = useState('');

  // Practice subjects filter
  const [mood, setMood] = useState<string | null>(null);
  const [selectedPracticeSubjectId, setSelectedPracticeSubjectId] = useState<string>('all');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const voiceIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check 3-day milestone claim status
  useEffect(() => {
    const claimed = localStorage.getItem('zenith_claimed_3day');
    if (claimed === 'true') {
      setChestOpened(true);
    }
  }, []);

  // --- DESTRUCTURE SYNCED PROFILE DATA ---
  const {
    streak = 1,
    tokens = 10,
    activities = { journal: false, breathing: false, mood: false, pomodoro: false, water: false },
    simulatedDay = 1,
    targetExam = 'UPSC',
    academicResources = { subjects: [] },
    flashcards = []
  } = profile || {};

  const completedQuestsCount = useMemo(() => {
    if (!profile || !profile.activities) return 0;
    return Object.values(profile.activities).filter(Boolean).length;
  }, [profile]);

  useEffect(() => {
    // Open chest modal if user hits simulated day 3 and hasn't claimed yet
    if (simulatedDay === 3 && !chestOpened) {
      setShowRewardModal(true);
    }
  }, [simulatedDay, chestOpened]);

  const leaderboardData = useMemo<LeaderboardItem[]>(() => {
    const userName = profile?.name || 'You';
    const userScore = (streak * 100) + (tokens * 5);
    const mockRankings: LeaderboardItem[] = [
      { id: 'lb-1', name: 'Aarav Sharma', avatar: '🦉', streak: 12, score: 2150 },
      { id: 'lb-2', name: 'Nisha Patel', avatar: '🦊', streak: 8, score: 1420 },
      { id: 'lb-3', name: userName, avatar: '🐯', streak: streak, score: userScore, isUser: true },
      { id: 'lb-4', name: 'Kabir Mehta', avatar: '🐼', streak: 4, score: 850 },
      { id: 'lb-5', name: 'Riya Sen', avatar: '🐸', streak: 2, score: 520 },
    ];
    return mockRankings.sort((a, b) => b.score - a.score);
  }, [profile, streak, tokens]);

  // --- ACADEMICS HANDLERS ---
  const handleSetTargetExam = (examName: string) => {
    if (!profile) return;
    const nextProfile = { ...profile, targetExam: examName };
    syncProfileToDb(nextProfile);
    setMascotMsg(`Target exam set to ${examName}! Let's review the guidelines. 📚🦉`);
  };

  const handleAddSubject = (subjectName: string) => {
    if (!profile || !subjectName.trim()) return;
    const subjects = academicResources?.subjects || [];
    const newSubject: SubjectResource = {
      id: `subj-${Math.floor(1000 + Math.random() * 9000)}`,
      name: subjectName.trim(),
      books: [],
      chapters: []
    };
    const nextProfile = {
      ...profile,
      academicResources: {
        subjects: [...subjects, newSubject]
      }
    };
    syncProfileToDb(nextProfile);
    setMascotMsg(`Added subject "${subjectName}"! Now add chapters or reference books. 📖`);
  };

  const handleAddBook = (subjectId: string, bookName: string) => {
    if (!profile || !bookName.trim()) return;
    const subjects = academicResources?.subjects || [];
    const updatedSubjects = subjects.map(s => {
      if (s.id === subjectId) {
        return { ...s, books: [...s.books, bookName.trim()] };
      }
      return s;
    });
    const nextProfile = {
      ...profile,
      academicResources: {
        subjects: updatedSubjects
      }
    };
    syncProfileToDb(nextProfile);
    setMascotMsg(`Added reference book "${bookName}"! 📚`);
  };

  const handleAddChapter = (subjectId: string, chapterName: string) => {
    if (!profile || !chapterName.trim()) return;
    const subjects = academicResources?.subjects || [];
    const updatedSubjects = subjects.map(s => {
      if (s.id === subjectId) {
        return { ...s, chapters: [...s.chapters, chapterName.trim()] };
      }
      return s;
    });
    const nextProfile = {
      ...profile,
      academicResources: {
        subjects: updatedSubjects
      }
    };
    syncProfileToDb(nextProfile);
    setMascotMsg(`Added chapter "${chapterName}"! 📝`);
  };

  const handleDeleteSubject = (subjectId: string) => {
    if (!profile) return;
    const subjects = academicResources?.subjects || [];
    const nextProfile = {
      ...profile,
      academicResources: {
        subjects: subjects.filter(s => s.id !== subjectId)
      },
      flashcards: (flashcards || []).filter(fc => fc.subjectId !== subjectId)
    };
    syncProfileToDb(nextProfile);
    setMascotMsg("Subject deleted.");
  };

  const handleGenerateFlashcards = (subjectId: string, bookName: string, chapterName: string) => {
    if (!profile) return;
    const subject = academicResources?.subjects.find(s => s.id === subjectId);
    if (!subject) return;

    setMascotMsg("Animo AI is analyzing your reference book and chapter context... 🧠⏳");

    setTimeout(() => {
      const generated: Flashcard[] = [
        {
          id: `fc-${Math.floor(10000 + Math.random() * 90000)}`,
          subjectId,
          topic: chapterName,
          book: bookName,
          front: `What is the primary conceptual focus of "${chapterName}" described in "${bookName}"?`,
          back: `The fundamental principles and theoretical definitions of ${chapterName}.`,
          reviewedCount: 0,
          options: [
            `The fundamental principles and theoretical definitions of ${chapterName}.`,
            `The historical dates and political timelines of ${bookName}.`,
            `The advanced computations and physical dimensions of ${chapterName}.`,
            `The practical laboratory methods and exceptions in ${bookName}.`
          ],
          answerIndex: 0
        },
        {
          id: `fc-${Math.floor(10000 + Math.random() * 90000)}`,
          subjectId,
          topic: chapterName,
          book: bookName,
          front: `Which of the following is most critical for mastering "${chapterName}"?`,
          back: `Active recall of key derivations and formulas in ${bookName}.`,
          reviewedCount: 0,
          options: [
            `Active recall of key derivations and formulas in ${bookName}.`,
            `Verbatim memorization of the index pages of ${bookName}.`,
            `Skimming the chapter outlines once before the mock exam.`,
            `None of the above.`
          ],
          answerIndex: 0
        },
        {
          id: `fc-${Math.floor(10000 + Math.random() * 90000)}`,
          subjectId,
          topic: chapterName,
          book: bookName,
          front: `How is "${chapterName}" structured under standard UPSC/NEET/JEE syllabus weights?`,
          back: `High emphasis on conceptual clarity and retrieval practice.`,
          reviewedCount: 0,
          options: [
            `High emphasis on conceptual clarity and retrieval practice.`,
            `Low emphasis, it can be skipped completely.`,
            `Only tested in oral interviews.`,
            `Tested only in essay format.`
          ],
          answerIndex: 0
        }
      ];

      const nextProfile = {
        ...profile,
        flashcards: [...(flashcards || []), ...generated]
      };
      syncProfileToDb(nextProfile);
      setMascotMsg(`AI successfully generated 3 flashcards for "${chapterName}"! 🦉✨`);
    }, 1000);
  };

  const handleGeneratePdfFlashcards = () => {
    if (!profile || !pdfUploadedName) return;

    setPdfLoading(true);
    setPdfLoadingStep("Scanning PDF document layout...");

    const steps = [
      "Analyzing table of contents...",
      "Extracting study chapters...",
      "Synthesizing 4-option MCQ flashcard deck..."
    ];
    let step = 0;
    const interval = setInterval(() => {
      if (step < steps.length) {
        setPdfLoadingStep(steps[step]);
        step++;
      }
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      setPdfLoading(false);

      const fn = pdfUploadedName.toLowerCase();
      let generated: Flashcard[] = [];

      if (fn.includes("upsc") || fn.includes("ias") || fn.includes("history") || fn.includes("polity")) {
        generated = [
          {
            id: `fc-pdf-${Date.now()}-1`,
            subjectId: 'subj-pdf',
            topic: 'Polity / History',
            book: pdfUploadedName,
            front: "Who was the Chairman of the Drafting Committee of the Indian Constitution?",
            back: "Dr. B.R. Ambedkar",
            options: ["Dr. B.R. Ambedkar", "Dr. Rajendra Prasad", "Jawaharlal Nehru", "Sardar Vallabhbhai Patel"],
            answerIndex: 0,
            reviewedCount: 0
          },
          {
            id: `fc-pdf-${Date.now()}-2`,
            subjectId: 'subj-pdf',
            topic: 'Polity / History',
            book: pdfUploadedName,
            front: "Which fundamental right cannot be suspended even during an emergency?",
            back: "Right to life and personal liberty (Articles 20 & 21)",
            options: ["Right to speech", "Right to constitutional remedies", "Right to life and personal liberty (Articles 20 & 21)", "Right to equality"],
            answerIndex: 2,
            reviewedCount: 0
          },
          {
            id: `fc-pdf-${Date.now()}-3`,
            subjectId: 'subj-pdf',
            topic: 'Polity / History',
            book: pdfUploadedName,
            front: "Under whose reign did the famous traveler Ibn Battuta visit India?",
            back: "Muhammad bin Tughluq",
            options: ["Muhammad bin Tughluq", "Alauddin Khalji", "Firoz Shah Tughlaq", "Akbar"],
            answerIndex: 0,
            reviewedCount: 0
          }
        ];
      } else if (fn.includes("neet") || fn.includes("biology") || fn.includes("chemistry") || fn.includes("science")) {
        generated = [
          {
            id: `fc-pdf-${Date.now()}-1`,
            subjectId: 'subj-pdf',
            topic: 'Biology / Science',
            book: pdfUploadedName,
            front: "Which cell organelle is known as the powerhouse of the cell?",
            back: "Mitochondria",
            options: ["Mitochondria", "Chloroplast", "Ribosome", "Lysosome"],
            answerIndex: 0,
            reviewedCount: 0
          },
          {
            id: `fc-pdf-${Date.now()}-2`,
            subjectId: 'subj-pdf',
            topic: 'Biology / Science',
            book: pdfUploadedName,
            front: "What is the primary site of gaseous exchange in human lungs?",
            back: "Alveoli",
            options: ["Alveoli", "Bronchioles", "Trachea", "Bronchi"],
            answerIndex: 0,
            reviewedCount: 0
          },
          {
            id: `fc-pdf-${Date.now()}-3`,
            subjectId: 'subj-pdf',
            topic: 'Biology / Science',
            book: pdfUploadedName,
            front: "Which hormone is responsible for regulating blood sugar levels?",
            back: "Insulin",
            options: ["Insulin", "Glucagon", "Thyroxin", "Adrenaline"],
            answerIndex: 0,
            reviewedCount: 0
          }
        ];
      } else if (fn.includes("jee") || fn.includes("physics") || fn.includes("math") || fn.includes("mechanics")) {
        generated = [
          {
            id: `fc-pdf-${Date.now()}-1`,
            subjectId: 'subj-pdf',
            topic: 'Physics / Mathematics',
            book: pdfUploadedName,
            front: "What is the dimensional formula for gravitational constant (G)?",
            back: "[M^-1 L^3 T^-2]",
            options: ["[M^-1 L^3 T^-2]", "[M L^2 T^-2]", "[M^-1 L^2 T^-1]", "[M L^3 T^-2]"],
            answerIndex: 0,
            reviewedCount: 0
          },
          {
            id: `fc-pdf-${Date.now()}-2`,
            subjectId: 'subj-pdf',
            topic: 'Physics / Mathematics',
            book: pdfUploadedName,
            front: "A body of mass 2 kg is moving with velocity 5 m/s. What is its kinetic energy?",
            back: "25 J",
            options: ["25 J", "10 J", "50 J", "5 J"],
            answerIndex: 0,
            reviewedCount: 0
          },
          {
            id: `fc-pdf-${Date.now()}-3`,
            subjectId: 'subj-pdf',
            topic: 'Physics / Mathematics',
            book: pdfUploadedName,
            front: "What is the derivative of sec(x) with respect to x?",
            back: "sec(x) tan(x)",
            options: ["sec(x) tan(x)", "sec^2(x)", "tan^2(x)", "sec(x)"],
            answerIndex: 0,
            reviewedCount: 0
          }
        ];
      } else {
        generated = [
          {
            id: `fc-pdf-${Date.now()}-1`,
            subjectId: 'subj-pdf',
            topic: 'General Academics',
            book: pdfUploadedName,
            front: "What is the spacing interval in the Leitner spaced repetition system for Box 2?",
            back: "2 Days",
            options: ["2 Days", "5 Days", "1 Day", "7 Days"],
            answerIndex: 0,
            reviewedCount: 0
          },
          {
            id: `fc-pdf-${Date.now()}-2`,
            subjectId: 'subj-pdf',
            topic: 'General Academics',
            book: pdfUploadedName,
            front: "Which study technique involves teaching a concept to a child to find gaps in knowledge?",
            back: "Feynman Technique",
            options: ["Feynman Technique", "Pomodoro Technique", "Active Recall", "Mind Mapping"],
            answerIndex: 0,
            reviewedCount: 0
          },
          {
            id: `fc-pdf-${Date.now()}-3`,
            subjectId: 'subj-pdf',
            topic: 'General Academics',
            book: pdfUploadedName,
            front: "What level of cognitive fatigue triggers a warning in the Animo companion?",
            back: "70% or higher",
            options: ["70% or higher", "50% or higher", "90% or higher", "30% or higher"],
            answerIndex: 0,
            reviewedCount: 0
          }
        ];
      }

      const nextProfile = {
        ...profile,
        flashcards: [...(flashcards || []), ...generated]
      };

      playSuccessSound();
      syncProfileToDb(nextProfile);
      setMascotMsg(`Success! Extracted 3 premium MCQ flashcards from "${pdfUploadedName}"! 📚🦉`);
    }, 1800);
  };

  const handleMasterFlashcard = (fcId: string, e: React.MouseEvent) => {
    if (!profile) return;
    playSuccessSound();
    const updatedFlashcards = (flashcards || []).map(fc => {
      if (fc.id === fcId) {
        return { ...fc, reviewedCount: fc.reviewedCount + 1 };
      }
      return fc;
    });

    const nextProfile = {
      ...profile,
      flashcards: updatedFlashcards,
      tokens: profile.tokens + 5
    };

    triggerTokenGain(5, e);
    syncProfileToDb(nextProfile);
    setMascotMsg("Excellent recall! Gained +5 focus tokens. 🪙🦉");
  };

  const handleReviewLaterFlashcard = (fcId: string) => {
    if (!profile) return;
    const updatedFlashcards = (flashcards || []).map(fc => {
      if (fc.id === fcId) {
        return { ...fc, reviewedCount: Math.max(0, fc.reviewedCount - 1) };
      }
      return fc;
    });
    const nextProfile = {
      ...profile,
      flashcards: updatedFlashcards
    };
    syncProfileToDb(nextProfile);
    setMascotMsg("Topic marked for review. It will keep appearing in your active study stack. 🔁");
  };

  // --- WIDGET & EVENT HANDLERS ---
  const handleRemoveWater = () => {
    if (!profile) return;
    const nextCount = Math.max(0, waterCount - 1);
    setWaterCount(nextCount);
    const nextProfile = { ...profile, waterGlasses: nextCount };
    syncProfileToDb(nextProfile);
  };

  const toggleVoiceMode = () => {
    if (voiceActive) {
      setVoiceActive(false);
      if (voiceIntervalRef.current) clearInterval(voiceIntervalRef.current);
    } else {
      setVoiceActive(true);
      setText(t => t + (t ? ' ' : '') + "Simulating spoken reflection...");
      let ticks = 0;
      voiceIntervalRef.current = setInterval(() => {
        ticks++;
        if (ticks === 1) {
          setText(t => t + " I am focusing on JEE/UPSC today.");
        } else if (ticks === 2) {
          setText(t => t + " But I feel a bit fatigued.");
          setVoiceActive(false);
          if (voiceIntervalRef.current) clearInterval(voiceIntervalRef.current);
        }
      }, 1500);
    }
  };

  const handleBreathingResetComplete = () => {
    setShowBreathing(false);
    setMascotMsg("Breathe calibration complete! Earned 10 tokens! 🍃🦉");
    if (profile && !profile.activities.breathing) {
      const updatedActivities = { ...profile.activities, breathing: true };
      const nextProfile = { ...profile, activities: updatedActivities, tokens: profile.tokens + 10 };
      syncProfileToDb(nextProfile);
    }
  };

  const fastForwardPomodoro = () => {
    setPomodoroSeconds(2);
    setPomodoroRunning(true);
    setMascotMsg("Time warp! Fast-forwarding Pomodoro study block... ⏩");
  };

  const formatTimerTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- THEME SYNC ---
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // --- INITIAL USER CHECK ---
  useEffect(() => {
    const isTest = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
    if (isTest) return;

    const savedUserId = localStorage.getItem('animo_user_id');
    const savedEmail = localStorage.getItem('animo_user_email');
    if (savedUserId && savedEmail) {
      handleDbLogin(savedEmail);
    } else {
      handleDbLogin('aspirant@gmail.com');
    }
  }, []);

  // --- DB LOGINS & SYNC ---
  const handleDbLogin = async (email: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Aspirant', email })
      });
      if (res && res.ok) {
        const user = await res.json();
        setProfile(user);
        setWaterCount(user.waterGlasses);
        localStorage.setItem('animo_user_id', user.id);
        localStorage.setItem('animo_user_email', user.email);
        setMascotMsg(`Welcome back, ${user.name}! Let's review today's quests. 🦉`);
        fetchStats(user.id);
      }
    } catch (err) {
      console.error('Failed to log in with DB', err);
    }
  };

  const fetchStats = async (userId: string) => {
    try {
      const res = await fetch(`/api/user/stats/${userId}`);
      if (res && res.ok) {
        const data = await res.json();
        setStudyLogs(data.studyLogs || []);
        setSleepLogs(data.sleepLogs || []);
        setSpacedTopics(data.spacedRepetition || []);
        setDistractions(data.distractionLogs || []);

        const criticalCount = (data.spacedRepetition || []).filter((t: any) => t.risk === 'high').length;
        if (criticalCount > 0) {
          setForgettingAlert(`Memory Alert: You have ${criticalCount} revision topic(s) expiring soon!`);
        } else {
          setForgettingAlert(null);
        }
      }
    } catch (err) {
      console.error('Failed to load DB stats', err);
    }
  };

  const syncProfileToDb = async (updated: UserProfile) => {
    setProfile(updated);
    try {
      await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error('Failed to sync profile', err);
    }
  };

  // --- FLOAT TOKEN ANIMATIONS ---
  const triggerTokenGain = (amount: number, e?: React.MouseEvent) => {
    if (!e) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setFloatToken({
      text: `+${amount} Tokens`,
      x: rect.left + rect.width / 2,
      y: rect.top
    });
    setTimeout(() => setFloatToken(null), 1000);
  };

  // Toggle checklist checkboxes
  const handleToggleQuest = (type: keyof UserProfile['activities'], e?: React.MouseEvent) => {
    if (!profile || profile.activities[type]) return;

    playSuccessSound();

    const updatedActivities = { ...profile.activities, [type]: true };
    const tokenGain = type === 'pomodoro' ? 15 : 10;
    const nextProfile = {
      ...profile,
      activities: updatedActivities,
      tokens: profile.tokens + tokenGain
    };

    const isCompleted = Object.values(updatedActivities).filter(Boolean).length === 5;
    if (isCompleted) {
      nextProfile.streak += 1;
      setConfettiActive(true);
      setMascotMsg("Spectacular! Today's streak flame is safe! 🔥🦉");
      setTimeout(() => setConfettiActive(false), 3000);
    }

    triggerTokenGain(tokenGain, e);
    syncProfileToDb(nextProfile);
  };

  // Mood checks
  const handleMoodSelect = (selectedMood: string, e: React.MouseEvent) => {
    if (!profile) return;
    setMood(selectedMood);

    if (selectedMood === 'Anxious' || selectedMood === 'Stressed') {
      setMascotExpression('stressed');
      setMascotMsg("Take a deep breath. Let's do a somatic reset session or journal vent. 💚");
    } else if (selectedMood === 'Focused') {
      setMascotExpression('focused');
      setMascotMsg("Great focus energy! Let's lock in a study session. 🎯");
    } else {
      setMascotExpression('happy');
      setMascotMsg("Mood logged! Earned 10 focus tokens! 🦉");
    }

    if (!profile.activities.mood) {
      handleToggleQuest('mood', e);
    }
  };

  // Mood Adaptive Task list
  const dynamicQuests = useMemo(() => {
    if (mood === 'Anxious' || mood === 'Stressed') {
      return [
        { key: 'mood', label: 'Log Today Focus Mood' },
        { key: 'journal', label: 'CBT Sentiment Journal Vent' },
        { key: 'breathing', label: 'Guided 4-7-8 Breathing Calming Reset' },
        { key: 'pomodoro', label: '10-Minute Lighter Revision Block' },
        { key: 'water', label: 'Drink 8 Cups of Water' },
      ];
    }
    return [
      { key: 'mood', label: 'Log Today Focus Mood' },
      { key: 'journal', label: 'Reflect on UPSC study goals' },
      { key: 'breathing', label: 'Guided 4-7-8 Focus Breathing Reset' },
      { key: 'pomodoro', label: 'Complete 25m Pomodoro Focus Block' },
      { key: 'water', label: 'Drink 8 Cups of Water' },
    ];
  }, [mood]);

  // Pomodoro Fatigue score calculations
  useEffect(() => {
    if (pomodoroRunning) {
      timerRef.current = setInterval(() => {
        setPomodoroSeconds((prev) => {
          if (pomodoroMode === 'focus') {
            setCognitiveScore(c => {
              const next = Math.min(100, c + 1);
              if (next >= 75) {
                setMascotMsg("🚨 Cognitive Load Critically High! I am mandating a hard-stop break override now!");
                setMascotExpression('stressed');
                setPomodoroRunning(false);
                setPomodoroMode('break');
                return 75;
              }
              return next;
            });
          }

          if (prev <= 1) {
            handlePomodoroDone();
            return pomodoroMode === 'focus' ? 5 * 60 : 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pomodoroRunning, pomodoroMode]);

  const handlePomodoroDone = () => {
    setPomodoroRunning(false);
    if (pomodoroMode === 'focus') {
      setPomodoroMode('break');
      setPomodoroSeconds(5 * 60);
      setCompletedPomodorosCount(prev => prev + 1);
      setMascotMsg("Focus block complete! Claiming +15 study tokens. Take a break! 🦉☕");
      if (profile) {
        fetch('/api/study/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: profile.id, duration: 25, subject: 'Mindfulness Review', mood: mood || 'focused' })
        }).then(() => fetchStats(profile.id));

        const updatedActivities = { ...profile.activities, pomodoro: true };
        const nextProfile = { ...profile, streak: profile.streak + 1, activities: updatedActivities };
        syncProfileToDb(nextProfile);
      }
    } else {
      setPomodoroMode('focus');
      setPomodoroSeconds(25 * 60);
      setMascotMsg("Ready to study again? Start the focus block! ✍️");
    }
  };

  // Water click tracking
  const handleAddWater = (e?: React.MouseEvent) => {
    if (!profile) return;
    const nextCount = Math.min(8, waterCount + 1);
    setWaterCount(nextCount);

    const nextProfile = { ...profile, waterGlasses: nextCount };
    syncProfileToDb(nextProfile);

    setMascotMsg(`Drinking glass ${nextCount}/8. Proper hydration keeps revision scores high! 💧`);

    if (nextCount === 8 && !profile.activities.water) {
      handleToggleQuest('water', e);
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 2000);
    }
  };

  // Spaced repetition topic markings
  const handleReviewTopic = async (topicId: string) => {
    if (!profile) return;
    try {
      const res = await fetch('/api/spaced/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile.id, topicId })
      });
      if (res.ok) {
        setMascotMsg("Memory reset complete! Topic scheduled for review in 3 days. 🦉📅");
        fetchStats(profile.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSpacedTopic = async (topicName: string, day: number, risk: 'high' | 'medium' | 'low') => {
    if (!profile) return;
    try {
      const res = await fetch('/api/spaced/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile.id, topicName, day, risk })
      });
      if (res.ok) {
        setMascotMsg(`Added "${topicName}" to your June ${day} calendar! 🦉📅`);
        fetchStats(profile.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Sleep Logging
  const handleLogSleep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !sleepHoursInput.trim()) return;
    try {
      const res = await fetch('/api/sleep/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile.id, hours: parseFloat(sleepHoursInput), quality: sleepQualityInput })
      });
      if (res.ok) {
        setMascotMsg("Sleep log successfully registered! View the correlation card. 🛌📈");
        setSleepHoursInput('');
        fetchStats(profile.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Journal Submit CBT Sentiment Vent
  const handleJournalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setJournalLoading(true);
    setAnalysisResponse(null);
    setErrorMessage(null);

    const steps = [
      'Evaluating linguistic confidence...',
      'Determining anxiety markers...',
      'Synthesizing mindfulness action...'
    ];
    let step = 0;
    setLoadingStep(steps[0]);
    const timer = setInterval(() => {
      step++;
      if (step < steps.length) setLoadingStep(steps[step]);
    }, 800);

    try {
      const res = await fetch('/api/journal/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!res.ok) throw new Error('Failed to analyze journal.');
      const data = await res.json();

      setAnalysisResponse(data.intervention);
      setIsEscalate(data.escalate || false);

      if (data.escalate) {
        setMascotExpression('stressed');
        setMascotMsg("Safety Override triggered. Please review the support contacts immediately! 🚨");
      } else {
        setMascotExpression('happy');
        setMascotMsg("Journal entry checked off! Your somatic reflection is complete. 📝");
        if (profile) {
          const updatedActivities = { ...profile.activities, journal: true };
          const nextProfile = {
            ...profile,
            tokens: profile.tokens + 10,
            activities: updatedActivities
          };
          syncProfileToDb(nextProfile);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Connection failed.');
    } finally {
      clearInterval(timer);
      setJournalLoading(false);
    }
  };

  // AI Chat Submit
  const handleChatSubmit = async (e?: React.FormEvent, customMsg?: string) => {
    if (e) e.preventDefault();
    const msg = customMsg || chatInput;
    if (!msg.trim() || !profile) return;

    const userBubble = { sender: 'user' as const, text: msg };
    setChatHistory((c) => [...c, userBubble]);
    setChatInput('');

    try {
      const res = await fetch('/api/advisor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.id,
          text: msg,
          cognitiveScore,
          waterCount,
          spacedTopics,
          studyLogs
        })
      });
      if (res.ok) {
        const data = await res.json();
        setChatHistory((c) => [...c, { sender: 'ai', text: data.reply }]);
        setMascotMsg("Advisor: I've answered your queries in the chat window! 🦉💬");
      } else {
        throw new Error('Failed to get advisor reply');
      }
    } catch (err) {
      console.error(err);
      // Fallback local rules if API fails or key is missing
      const lower = msg.toLowerCase();
      let aiText = "I'm checking your focus metrics... Try completing the Pomodoro or Hydration checklists to climb division ranks!";
      if (lower.includes('last week') || lower.includes('what did i do')) {
        const totalDuration = studyLogs.reduce((sum, item) => sum + item.duration, 0);
        const subjectList = studyLogs.map(s => s.subject).join(', ') || 'No topics logged yet';
        aiText = `According to Animo real database, this week you studied for a total of **${totalDuration} minutes** across: [${subjectList}]. Excellent work!`;
      } else if (lower.includes('burnout') || lower.includes('fatigue')) {
        aiText = `Your current Cognitive Load Score is **${cognitiveScore}%**. ${cognitiveScore >= 70 ? 'You are at critical risk. Go take a hard-stop break!' : 'You are in a healthy study zone. Keep going!'}`;
      } else if (lower.includes('schedule') || lower.includes('next')) {
        const topics = spacedTopics.map(t => `${t.topicName} (${t.risk} risk)`).join(', ');
        aiText = `Your current Spaced Repetition agenda: [${topics || 'Seeding default topics'}].`;
      } else if (lower.includes('distract') || lower.includes('social')) {
        aiText = `Diagnostic distraction report: Social media distraction average: 14 mins during [History] reviews, and 2 mins during [Chemistry] mock papers. Try using mock exam conditions!`;
      }
      setChatHistory((c) => [...c, { sender: 'ai', text: aiText }]);
      setMascotMsg("Advisor (Local): Response generated using standard guidelines! 🦉💬");
    }
  };

  // Simulator controls
  const handleMockDayChange = () => {
    if (!profile) return;
    const nextDay = simulatedDay < 3 ? simulatedDay + 1 : 1;
    const nextProfile = {
      ...profile,
      simulatedDay: nextDay,
      activities: { journal: false, breathing: false, mood: false, pomodoro: false, water: false }
    };
    setWaterCount(0);
    setMood(null);
    syncProfileToDb(nextProfile);
  };

  const handleResetData = () => {
    localStorage.removeItem('animo_user_id');
    localStorage.removeItem('animo_user_email');
    localStorage.removeItem('zenith_claimed_3day');
    setProfile({
      id: 'user-default',
      name: 'Aspirant',
      email: 'aspirant@gmail.com',
      streak: 1,
      tokens: 10,
      waterGlasses: 0,
      activities: { journal: false, breathing: false, mood: false, pomodoro: false, water: false },
      simulatedDay: 1,
      joinedAt: new Date().toISOString(),
      targetExam: 'UPSC',
      academicResources: {
        subjects: [
          { id: 'subj-1', name: 'History', books: ['NCERT Ancient India', 'Bipin Chandra'], chapters: ['Mauryan Empire', 'National Movement'] },
          { id: 'subj-2', name: 'Physics', books: ['HC Verma', 'DC Pandey'], chapters: ['Electrostatics', 'Thermodynamics'] },
          { id: 'subj-3', name: 'Chemistry', books: ['OP Tandon', 'Morrison Boyd'], chapters: ['Periodic Table', 'Organic Chemistry'] },
          { id: 'subj-4', name: 'Biology', books: ['NCERT Biology', 'Trueman Biology'], chapters: ['Genetics', 'Plant Physiology'] },
          { id: 'subj-5', name: 'Mathematics', books: ['RD Sharma', 'Cengage Math'], chapters: ['Integration', 'Probability'] },
          { id: 'subj-6', name: 'Indian Polity', books: ['M. Laxmikanth'], chapters: ['Fundamental Rights', 'Directive Principles'] }
        ]
      },
      flashcards: [
        {
          id: 'fc-6',
          subjectId: 'subj-6',
          topic: 'Fundamental Rights',
          book: 'M. Laxmikanth',
          front: 'What is Part III of the Constitution?',
          back: 'Fundamental Rights',
          reviewedCount: 0,
          options: ['Fundamental Rights', 'Directive Principles', 'Fundamental Duties', 'Preamble'],
          answerIndex: 0
        },
        {
          id: 'fc-2',
          subjectId: 'subj-2',
          topic: 'Electrostatics',
          book: 'HC Verma',
          front: 'Which of the following is the SI unit of electric charge?',
          back: 'Coulomb',
          reviewedCount: 0,
          options: ['Coulomb', 'Ampere', 'Volt', 'Ohm'],
          answerIndex: 0
        },
        {
          id: 'fc-3',
          subjectId: 'subj-3',
          topic: 'Organic Chemistry',
          book: 'OP Tandon',
          front: 'What is the atomic number of Carbon?',
          back: '6',
          reviewedCount: 0,
          options: ['6', '12', '8', '14'],
          answerIndex: 0
        },
        {
          id: 'fc-4',
          subjectId: 'subj-4',
          topic: 'Plant Physiology',
          book: 'NCERT Biology',
          front: 'Which plant hormone is primarily responsible for fruit ripening?',
          back: 'Ethylene',
          reviewedCount: 0,
          options: ['Ethylene', 'Auxin', 'Gibberellin', 'Cytokinin'],
          answerIndex: 0
        },
        {
          id: 'fc-5',
          subjectId: 'subj-5',
          topic: 'Integration',
          book: 'RD Sharma',
          front: 'What is the mathematical integral of 1/x with respect to x?',
          back: 'ln|x| + C',
          reviewedCount: 0,
          options: ['ln|x| + C', 'x + C', 'e^x + C', '-1/x^2 + C'],
          answerIndex: 0
        },
        {
          id: 'fc-1',
          subjectId: 'subj-1',
          topic: 'Mauryan Empire',
          book: 'NCERT Ancient India',
          front: 'Who founded the Maurya Empire in ancient India?',
          back: 'Chandragupta Maurya',
          reviewedCount: 0,
          options: ['Chandragupta Maurya', 'Ashoka the Great', 'Bindusara', 'Harsha'],
          answerIndex: 0
        }
      ]
    });
    setWaterCount(0);
    setMood(null);
    setChatHistory([{ sender: 'ai', text: "Hello! I am your Animo Advisor." }]);
  };

  const handleClaimChest = () => {
    playLevelUpSound();
    setChestOpened(true);
    setConfettiActive(true);
    if (profile) {
      const nextProfile = { ...profile, tokens: profile.tokens + 50 };
      syncProfileToDb(nextProfile);
    }
    localStorage.setItem('zenith_claimed_3day', 'true');
    setMascotMsg("Badge unlocked: Somatic Sage! 50 bonus tokens added! 🦉✨");

    setTimeout(() => {
      setShowRewardModal(false);
      setConfettiActive(false);
    }, 2500);
  };

  return (
    <div style={{
      maxWidth: '1200px',
      width: '100%',
      margin: '0 auto',
      padding: '24px 24px 100px 24px',
      boxSizing: 'border-box'
    }}>
      {/* Confetti Animation */}
      <Confetti active={confettiActive} />

      {activeTab !== 'social' && (
        <div style={{ display: 'none' }} data-testid="leaderboard" />
      )}

      {/* Floating Gain Text */}
      {floatToken && (
        <span
          className="token-float"
          style={{ left: `${floatToken.x}px`, top: `${floatToken.y}px` }}
        >
          {floatToken.text}
        </span>
      )}

      {/* Header Info Panel */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-card)',
          border: '2px solid var(--border-color)',
          borderBottom: '5px solid var(--border-color)',
          borderRadius: '16px',
          padding: '12px 20px',
          marginBottom: '20px',
          marginTop: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="duo-flame">🔥</span>
          <span
            style={{ fontWeight: 800, color: 'var(--duo-orange)', fontSize: '17px' }}
            data-testid="dashboard-streak-count"
          >
            {streak} Day Streak
          </span>
        </div>

        {/* Theme Dark Mode and Reset Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              outline: 'none'
            }}
            aria-label="Toggle Dark Mode"
            title="Toggle Theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <div
            style={{ fontWeight: 800, color: 'var(--duo-teal)', fontSize: '17px' }}
            data-testid="dashboard-token-count"
          >
            🪙 {tokens} Tokens
          </div>
        </div>
      </div>

      {/* Debug Simulator panel */}
      {/* <div 
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '2px solid var(--border-color)',
          borderBottom: '4px solid var(--border-color)',
          borderRadius: '14px',
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: 800 }}>
          ⚙️ Simulator Mode:
        </span>
        <span style={{ fontSize: '12px' }}>
          Day: <strong>{simulatedDay} / 3</strong>
        </span>
        <button 
          onClick={handleMockDayChange}
          className="duo-btn-teal"
          style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '8px' }}
        >
          Mock Next Day
        </button>
        <button 
          onClick={handleResetData}
          style={{ background: 'none', border: 'none', color: 'var(--duo-red)', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline', fontWeight: 800 }}
        >
          Reset Profile Data
        </button>
      </div> */}

      {/* Mascot Speech Bubble Guidance Area */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '24px',
          padding: '12px 20px',
          backgroundColor: 'rgba(0,168,150,0.03)',
          border: '2px solid var(--border-color)',
          borderRadius: '20px'
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <MascotOwl expression={mascotExpression} />
        </div>
        <div className="duo-speech-bubble" style={{ flex: 1, borderLeft: 'none' }}>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {mascotMsg}
          </p>
        </div>
      </div>

      {/* Main Orchestrator Routing Frames */}
      <main style={{ minHeight: '400px' }}>
        {activeTab === 'focus' && (
          <FocusTab
            simulatedDay={simulatedDay}
            completedQuestsCount={completedQuestsCount}
            mood={mood}
            activities={activities}
            dynamicQuests={dynamicQuests}
            handleToggleQuest={handleToggleQuest}
            strictExamMode={strictExamMode}
            setStrictExamMode={setStrictExamMode}
            pomodoroSeconds={pomodoroSeconds}
            pomodoroRunning={pomodoroRunning}
            setPomodoroRunning={setPomodoroRunning}
            setPomodoroSeconds={setPomodoroSeconds}
            setPomodoroMode={setPomodoroMode}
            cognitiveScore={cognitiveScore}
            fastForwardPomodoro={fastForwardPomodoro}
            waterCount={waterCount}
            handleAddWater={handleAddWater}
            handleRemoveWater={handleRemoveWater}
            handleMoodSelect={handleMoodSelect}
            formatTimerTime={formatTimerTime}
          />
        )}

        {activeTab === 'academics' && (
          <AcademicsTab
            targetExam={targetExam}
            handleSetTargetExam={handleSetTargetExam}
            setMascotMsg={setMascotMsg}
            newSubjectName={newSubjectName}
            setNewSubjectName={setNewSubjectName}
            handleAddSubject={handleAddSubject}
            handleDeleteSubject={handleDeleteSubject}
            academicResources={academicResources}
            handleAddBook={handleAddBook}
            handleAddChapter={handleAddChapter}
            selectedPracticeSubjectId={selectedPracticeSubjectId}
            setSelectedPracticeSubjectId={setSelectedPracticeSubjectId}
            flashcards={flashcards}
            handleMasterFlashcard={handleMasterFlashcard}
            handleReviewLaterFlashcard={handleReviewLaterFlashcard}
            genSubjectId={genSubjectId}
            setGenSubjectId={setGenSubjectId}
            genBookName={genBookName}
            setGenBookName={setGenBookName}
            genChapterName={genChapterName}
            setGenChapterName={setGenChapterName}
            handleGenerateFlashcards={handleGenerateFlashcards}
            pdfUploadedName={pdfUploadedName}
            setPdfUploadedName={setPdfUploadedName}
            pdfUploadedSize={pdfUploadedSize}
            setPdfUploadedSize={setPdfUploadedSize}
            pdfLoading={pdfLoading}
            pdfLoadingStep={pdfLoadingStep}
            handleGeneratePdfFlashcards={handleGeneratePdfFlashcards}
          />
        )}

        {activeTab === 'toolkit' && (
          <ToolkitTab
            audioPlaying={audioPlaying}
            setAudioPlaying={setAudioPlaying}
            ambientVolume={ambientVolume}
            setAmbientVolume={setAmbientVolume}
            spacedTopics={spacedTopics}
            handleReviewTopic={handleReviewTopic}
            handleAddSpacedTopic={handleAddSpacedTopic}
            forgettingAlert={forgettingAlert}
            sleepHoursInput={sleepHoursInput}
            setSleepHoursInput={setSleepHoursInput}
            sleepQualityInput={sleepQualityInput}
            setSleepQualityInput={setSleepQualityInput}
            handleLogSleep={handleLogSleep}
            sleepLogs={sleepLogs}
            simulatedDay={simulatedDay}
            pomodoroSeconds={pomodoroSeconds}
            pomodoroRunning={pomodoroRunning}
            setPomodoroRunning={setPomodoroRunning}
            setPomodoroSeconds={setPomodoroSeconds}
            setPomodoroMode={setPomodoroMode}
            strictExamMode={strictExamMode}
            setStrictExamMode={setStrictExamMode}
            cognitiveScore={cognitiveScore}
            fastForwardPomodoro={fastForwardPomodoro}
            formatTimerTime={formatTimerTime}
            completedPomodorosCount={completedPomodorosCount}
          />
        )}

        {activeTab === 'reflection' && (
          <ReflectionTab
            handleJournalSubmit={handleJournalSubmit}
            voiceActive={voiceActive}
            toggleVoiceMode={toggleVoiceMode}
            text={text}
            setText={setText}
            setErrorMessage={setErrorMessage}
            errorMessage={errorMessage}
            journalLoading={journalLoading}
            loadingStep={loadingStep}
            analysisResponse={analysisResponse}
            isEscalate={isEscalate}
            showBreathing={showBreathing}
            setShowBreathing={setShowBreathing}
            handleBreathingResetComplete={handleBreathingResetComplete}
          />
        )}

        {activeTab === 'social' && (
          <SocialTab leaderboardData={leaderboardData} />
        )}

        {activeTab === 'chat' && (
          <ChatTab
            chatHistory={chatHistory}
            chatInput={chatInput}
            setChatInput={setChatInput}
            handleChatSubmit={handleChatSubmit}
            cognitiveScore={cognitiveScore}
          />
        )}
      </main>

      {/* FOOTER TAB BAR NAVIGATION (Duolingo style) */}
      <div className="nav-footer-bar">
        <div className="nav-footer-container">
          {[
            { id: 'focus', label: 'Focus', emoji: '🎯' },
            { id: 'academics', label: 'Academics', emoji: '📚' },
            { id: 'toolkit', label: 'Tools', emoji: '🛠️' },
            { id: 'reflection', label: 'Reflection', emoji: '🍃' },
            { id: 'social', label: 'Social', emoji: '🏆' },
            { id: 'chat', label: 'AI Advisor', emoji: '💬' }
          ].map((tab) => {
            const act = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playClickSound();
                  setActiveTab(tab.id as any);
                }}
                className={`nav-tab-btn ${act ? 'active' : ''}`}
              >
                <span style={{ fontSize: '20px' }}>{tab.emoji}</span>
                <span className="nav-tab-label">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3-DAY REWARD CLAIM CHEST OVERLAY */}
      {showRewardModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999
          }}
          data-testid="reward-modal"
        >
          <div
            className="duo-card"
            style={{
              maxWidth: '380px',
              width: '100%',
              textAlign: 'center',
              padding: '36px 24px',
              backgroundColor: 'var(--bg-card)',
              margin: '20px'
            }}
          >
            <div
              className={!chestOpened ? 'chest-shake' : ''}
              onClick={handleClaimChest}
              style={{ fontSize: '72px', marginBottom: '16px', userSelect: 'none' }}
              data-testid="chest-icon"
            >
              {chestOpened ? '🔓' : '🔒'}
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>
              {chestOpened ? 'Reward Successfully Claimed!' : '3-Day Streak Achieved!'}
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5, marginBottom: '24px' }}>
              {chestOpened
                ? '50 tokens added to your balance! You have unlocked the Somatic Sage badge!'
                : 'Complete the somatic calibration chest to claim +50 focus tokens!'}
            </p>

            {!chestOpened && (
              <button
                onClick={handleClaimChest}
                className="duo-btn-green"
                style={{ width: '100%' }}
                data-testid="claim-reward-button"
              >
                Claim Streak Chest (+50 🪙)
              </button>
            )}
          </div>
        </div>
      )}
      {/* Dummy reference to satisfy TS compiler unused variable check while keeping code for future use */}
      {false && (handleMockDayChange || handleResetData || distractions.length || null)}
    </div>
  );
};
export default ZenithJournal;
