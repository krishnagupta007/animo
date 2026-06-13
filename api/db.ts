import { MongoClient, Db } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'animo';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToMongo(): Promise<Db> {
  if (db) return db;
  client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db(DB_NAME);
  console.log('Successfully connected to MongoDB at', MONGO_URI);
  return db;
}

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

export interface UserProgress {
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

export interface StudyLog {
  id: string;
  userId: string;
  duration: number;
  subject: string;
  mood: string;
  date: string;
}

export interface SleepLog {
  id: string;
  userId: string;
  hours: number;
  quality: number; // 1-5
  date: string;
}

export interface SpacedRepetitionTopic {
  id: string;
  userId: string;
  topicName: string;
  lastReviewed: string;
  nextReview: string;
  risk: 'high' | 'medium' | 'low';
}

export interface DistractionLog {
  id: string;
  userId: string;
  app: string;
  minutes: number;
  subject: string;
  date: string;
}

// User Actions
export async function findOrCreateUser(name: string, email: string): Promise<UserProgress> {
  const database = await connectToMongo();
  const collection = database.collection<UserProgress>('users');
  const existingUser = await collection.findOne({ email: email.toLowerCase() });
  
  if (existingUser) {
    return existingUser;
  }
  
  const newUser: UserProgress = {
    id: `user-${Math.floor(1000 + Math.random() * 9000)}`,
    name,
    email: email.toLowerCase(),
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
        id: 'fc-1', 
        subjectId: 'subj-1', 
        topic: 'Mauryan Empire', 
        book: 'NCERT Ancient India', 
        front: 'Who founded the Maurya Empire in ancient India?', 
        back: 'Chandragupta Maurya', 
        reviewedCount: 0,
        options: ['Chandragupta Maurya', 'Ashoka the Great', 'Bindusara', 'Harsha'],
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
        id: 'fc-6', 
        subjectId: 'subj-6', 
        topic: 'Fundamental Rights', 
        book: 'M. Laxmikanth', 
        front: 'Which Article of the Indian Constitution guarantees Equality before Law?', 
        back: 'Article 14', 
        reviewedCount: 0,
        options: ['Article 14', 'Article 19', 'Article 21', 'Article 32'],
        answerIndex: 0
      }
    ]
  };
  
  await collection.insertOne(newUser);
  
  // Seed standard spaced repetition topics
  const spacedCol = database.collection<SpacedRepetitionTopic>('spacedRepetition');
  const defaultTopics: SpacedRepetitionTopic[] = [
    { id: 'topic-1', userId: newUser.id, topicName: 'Organic Chemistry', lastReviewed: new Date().toISOString(), nextReview: new Date(Date.now() + 86400000).toISOString(), risk: 'low' },
    { id: 'topic-2', userId: newUser.id, topicName: 'Differential Equations', lastReviewed: new Date(Date.now() - 172800000).toISOString(), nextReview: new Date().toISOString(), risk: 'high' },
    { id: 'topic-3', userId: newUser.id, topicName: 'Modern Indian History', lastReviewed: new Date(Date.now() - 86400000).toISOString(), nextReview: new Date(Date.now() + 43200000).toISOString(), risk: 'medium' }
  ];
  await spacedCol.insertMany(defaultTopics);

  // Seed mock distraction logs
  const distractionCol = database.collection<DistractionLog>('distractionLogs');
  const defaultDistractions: DistractionLog[] = [
    { id: 'd-1', userId: newUser.id, app: 'Instagram', minutes: 14, subject: 'Modern Indian History', date: new Date().toISOString() },
    { id: 'd-2', userId: newUser.id, app: 'YouTube', minutes: 2, subject: 'Organic Chemistry', date: new Date().toISOString() }
  ];
  await distractionCol.insertMany(defaultDistractions);

  return newUser;
}

export async function updateUserProgress(user: UserProgress): Promise<void> {
  const database = await connectToMongo();
  const collection = database.collection<UserProgress>('users');
  const { _id, ...cleanUser } = user as any; // Strip Mongo internal _id to prevent modification error
  await collection.replaceOne({ id: user.id }, cleanUser, { upsert: true });
}

// Log Actions
export async function addStudyLog(userId: string, duration: number, subject: string, mood: string): Promise<StudyLog> {
  const database = await connectToMongo();
  const collection = database.collection<StudyLog>('studyLogs');
  const log: StudyLog = {
    id: `log-${Math.floor(10000 + Math.random() * 90000)}`,
    userId,
    duration,
    subject,
    mood,
    date: new Date().toISOString()
  };
  await collection.insertOne(log);
  return log;
}

export async function addSleepLog(userId: string, hours: number, quality: number): Promise<SleepLog> {
  const database = await connectToMongo();
  const collection = database.collection<SleepLog>('sleepLogs');
  const log: SleepLog = {
    id: `sleep-${Math.floor(10000 + Math.random() * 90000)}`,
    userId,
    hours,
    quality,
    date: new Date().toISOString()
  };
  await collection.insertOne(log);
  return log;
}

export async function getSleepLogs(userId: string): Promise<SleepLog[]> {
  const database = await connectToMongo();
  const collection = database.collection<SleepLog>('sleepLogs');
  return collection.find({ userId }).toArray();
}

export async function getStudyLogs(userId: string): Promise<StudyLog[]> {
  const database = await connectToMongo();
  const collection = database.collection<StudyLog>('studyLogs');
  return collection.find({ userId }).toArray();
}

export async function getSpacedRepetition(userId: string): Promise<SpacedRepetitionTopic[]> {
  const database = await connectToMongo();
  const collection = database.collection<SpacedRepetitionTopic>('spacedRepetition');
  return collection.find({ userId }).toArray();
}

export async function getDistractionLogs(userId: string): Promise<DistractionLog[]> {
  const database = await connectToMongo();
  const collection = database.collection<DistractionLog>('distractionLogs');
  return collection.find({ userId }).toArray();
}

export async function reviewTopic(userId: string, topicId: string): Promise<void> {
  const database = await connectToMongo();
  const collection = database.collection<SpacedRepetitionTopic>('spacedRepetition');
  await collection.updateOne(
    { id: topicId, userId },
    {
      $set: {
        lastReviewed: new Date().toISOString(),
        nextReview: new Date(Date.now() + 3 * 86400000).toISOString(),
        risk: 'low'
      }
    }
  );
}

export async function addSpacedTopic(
  userId: string,
  topicName: string,
  nextReviewDate: string,
  risk: 'high' | 'medium' | 'low'
): Promise<void> {
  const database = await connectToMongo();
  const collection = database.collection<SpacedRepetitionTopic>('spacedRepetition');
  await collection.insertOne({
    id: `topic-${Math.floor(1000 + Math.random() * 9000)}`,
    userId,
    topicName,
    lastReviewed: new Date().toISOString(),
    nextReview: nextReviewDate,
    risk
  });
}

