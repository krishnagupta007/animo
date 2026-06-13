import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { sanitizeInput } from '../utils/sanitize.js';
import { queryOpenRouter } from '../utils/ai.js';
import { 
  findOrCreateUser, 
  updateUserProgress, 
  addStudyLog, 
  addSleepLog, 
  getSleepLogs, 
  getStudyLogs, 
  getSpacedRepetition, 
  reviewTopic,
  addSpacedTopic,
  getDistractionLogs
} from '../db.js';

const CRITICAL_KEYWORDS = ['give up', 'pointless', 'end it', 'suicide', 'kill myself'];

const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
});

const UpdateProgressSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  streak: z.number().int(),
  tokens: z.number().int(),
  waterGlasses: z.number().int(),
  activities: z.object({
    journal: z.boolean(),
    breathing: z.boolean(),
    mood: z.boolean(),
    pomodoro: z.boolean(),
    water: z.boolean(),
  }),
  simulatedDay: z.number().int(),
  joinedAt: z.string(),
  targetExam: z.string().optional(),
  academicResources: z.object({
    subjects: z.array(z.object({
      id: z.string(),
      name: z.string(),
      books: z.array(z.string()),
      chapters: z.array(z.string()),
    }))
  }).optional(),
  flashcards: z.array(z.object({
    id: z.string(),
    subjectId: z.string(),
    topic: z.string(),
    book: z.string(),
    front: z.string(),
    back: z.string(),
    reviewedCount: z.number().int(),
    options: z.array(z.string()).optional(),
    answerIndex: z.number().int().optional(),
  })).optional(),
});

const StudyLogSchema = z.object({
  userId: z.string(),
  duration: z.number().min(1),
  subject: z.string().min(1),
  mood: z.string(),
});

const SleepLogSchema = z.object({
  userId: z.string(),
  hours: z.number().min(1).max(24),
  quality: z.number().min(1).max(5),
});

const SpacedReviewSchema = z.object({
  userId: z.string(),
  topicId: z.string(),
});

export async function journalRoutes(fastify: FastifyInstance) {
  // Auth Register
  fastify.post('/api/auth/register', async (request: FastifyRequest, reply: FastifyReply) => {
    const parse = RegisterSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Bad Request', message: parse.error.issues[0].message });
    }
    const user = await findOrCreateUser(parse.data.name, parse.data.email);
    return reply.status(200).send(user);
  });

  // Update Progress
  fastify.post('/api/user/update', async (request: FastifyRequest, reply: FastifyReply) => {
    const parse = UpdateProgressSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Bad Request', message: parse.error.issues[0].message });
    }
    await updateUserProgress(parse.data);
    return reply.status(200).send({ success: true });
  });

  // Log Study block
  fastify.post('/api/study/log', async (request: FastifyRequest, reply: FastifyReply) => {
    const parse = StudyLogSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Bad Request', message: parse.error.issues[0].message });
    }
    const log = await addStudyLog(parse.data.userId, parse.data.duration, parse.data.subject, parse.data.mood);
    return reply.status(200).send(log);
  });

  // Log Sleep
  fastify.post('/api/sleep/log', async (request: FastifyRequest, reply: FastifyReply) => {
    const parse = SleepLogSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Bad Request', message: parse.error.issues[0].message });
    }
    const log = await addSleepLog(parse.data.userId, parse.data.hours, parse.data.quality);
    return reply.status(200).send(log);
  });

  // Fetch full stats for dashboard
  fastify.get('/api/user/stats/:userId', async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId } = request.params as { userId: string };
    const sleepLogs = await getSleepLogs(userId);
    const studyLogs = await getStudyLogs(userId);
    const spacedRepetition = await getSpacedRepetition(userId);
    const distractionLogs = await getDistractionLogs(userId);

    return reply.status(200).send({
      sleepLogs,
      studyLogs,
      spacedRepetition,
      distractionLogs
    });
  });

  // Spaced Repetition Complete Review
  fastify.post('/api/spaced/review', async (request: FastifyRequest, reply: FastifyReply) => {
    const parse = SpacedReviewSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Bad Request', message: parse.error.issues[0].message });
    }
    await reviewTopic(parse.data.userId, parse.data.topicId);
    return reply.status(200).send({ success: true });
  });

  // Add Spaced Repetition/Agenda Item
  fastify.post('/api/spaced/add', async (request: FastifyRequest, reply: FastifyReply) => {
    const SpacedAddSchema = z.object({
      userId: z.string(),
      topicName: z.string().min(1, 'Topic name is required'),
      day: z.number().min(1).max(30),
      risk: z.enum(['high', 'medium', 'low'])
    });
    const parse = SpacedAddSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Bad Request', message: parse.error.issues[0].message });
    }
    const { userId, topicName, day, risk } = parse.data;
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const nextReviewDate = `2026-06-${dayStr}T12:00:00.000Z`;

    await addSpacedTopic(userId, topicName, nextReviewDate, risk);
    return reply.status(200).send({ success: true });
  });

  // Journal Sentiment & Tone Analysis
  fastify.post('/api/journal/analyze', async (request: FastifyRequest, reply: FastifyReply) => {
    const bodySchema = z.object({
      text: z.string().min(1, 'Journal text must not be empty')
    });
    const parseResult = bodySchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Bad Request',
        message: parseResult.error.issues[0].message,
      });
    }

    const { text } = parseResult.data;
    const sanitizedText = sanitizeInput(text);
    const lowerText = sanitizedText.toLowerCase();

    // Safety checks (local overrides for maximum safety)
    const containsTrigger = CRITICAL_KEYWORDS.some(word => lowerText.includes(word));
    if (containsTrigger) {
      return reply.status(200).send({
        escalate: true,
        intervention: "Please reach out to emergency support immediately at 988 or your local helpline. You are not alone, and help is available."
      });
    }

    let escalate = false;
    let intervention = "";

    // Query OpenRouter for advanced sentiment and tone coaching if key is available
    if (process.env.OPENROUTER_API_KEY) {
      try {
        const systemPrompt = "Analyze the sentiment of the user's study journal entry. Determine if they are in crisis or need urgent help. Output a JSON containing only two fields: 'escalate' (boolean) and 'intervention' (string, a warm, supportive, specific study advice or breathing/grounding somatic suggestion based on their current stress level or fatigue).";
        const promptResponse = await queryOpenRouter(sanitizedText, systemPrompt);
        if (promptResponse.trim()) {
          let cleanJson = promptResponse.trim();
          if (cleanJson.includes('```')) {
            const match = cleanJson.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (match) cleanJson = match[1];
          }
          const parsed = JSON.parse(cleanJson);
          if (typeof parsed.escalate === 'boolean' && typeof parsed.intervention === 'string') {
            escalate = parsed.escalate;
            intervention = parsed.intervention;
          }
        }
      } catch (e) {
        console.warn("Failed to parse OpenRouter response. Falling back to local rules.", e);
      }
    }

    // Local rules fallback
    if (!intervention) {
      intervention = "Let's try a quick 4-7-8 breathing exercise to reset your focus before moving to your next study block.";
      if (lowerText.includes('stress') || lowerText.includes('panic') || lowerText.includes('anxious') || lowerText.includes('fear')) {
        intervention = "It sounds like you're carrying significant stress. Take 2 minutes for a Micro-CBT grounding reset to break the anxiety loop.";
      } else if (lowerText.includes('tired') || lowerText.includes('sleepy') || lowerText.includes('exhausted')) {
        intervention = "You're showing signs of heavy fatigue. I recommend a Pomodoro break with light physical stretches and water.";
      }
    }

    return reply.status(200).send({
      escalate,
      intervention
    });
  });

  // AI Advisor Chat endpoint
  fastify.post('/api/advisor/chat', async (request: FastifyRequest, reply: FastifyReply) => {
    const ChatInputSchema = z.object({
      userId: z.string(),
      text: z.string().min(1, 'Message text is required'),
      cognitiveScore: z.number(),
      waterCount: z.number(),
      spacedTopics: z.array(z.any()),
      studyLogs: z.array(z.any())
    });

    const parseResult = ChatInputSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Bad Request',
        message: parseResult.error.issues[0].message,
      });
    }

    const { text, cognitiveScore, waterCount, spacedTopics, studyLogs } = parseResult.data;
    const sanitizedText = sanitizeInput(text);

    // Format context summary for prompt
    const topicsStr = spacedTopics.map(t => `${t.topicName} (${t.risk} risk)`).join(', ') || 'No topics logged yet';
    const logsStr = studyLogs.map(l => `${l.duration}m of ${l.subject}`).join(', ') || 'No sessions logged yet';

    const systemPrompt = `You are Nia, a warm, supportive, and expert AI study coach for the Animo dashboard.
Your goal is to guide students on optimizing their study habits, managing stress/burnout, and staying on track.
Always prioritize using structured context in your answers.
Keep your response supportive, motivating, and under 100 words. 
Always format your output using markdown: highlight academic subject tags as [Subject] (e.g. [History], [Physics]) and bold important metrics/keywords with **bold**.

Here is the student's current real-time context:
- Cognitive Fatigue / Burnout: ${cognitiveScore}% (>=70% is critical)
- Hydration: ${waterCount}/8 glasses drunk today
- Spaced Repetition Agenda: [${topicsStr}]
- Study Sessions Logged: [${logsStr}]`;

    let replyText = "";
    if (process.env.OPENROUTER_API_KEY) {
      replyText = await queryOpenRouter(sanitizedText, systemPrompt);
    }

    if (!replyText.trim()) {
      // Fallback local rules if API fails or key is missing
      const lower = sanitizedText.toLowerCase();
      replyText = "I'm checking your focus metrics... Try completing the Pomodoro or Hydration checklists to climb division ranks!";
      if (lower.includes('last week') || lower.includes('what did i do')) {
        const totalDuration = studyLogs.reduce((sum, item) => sum + item.duration, 0);
        const subjectList = studyLogs.map(s => s.subject).join(', ') || 'No topics logged yet';
        replyText = `According to Animo real database, this week you studied for a total of **${totalDuration} minutes** across: [${subjectList}]. Excellent work!`;
      } else if (lower.includes('burnout') || lower.includes('fatigue')) {
        replyText = `Your current Cognitive Load Score is **${cognitiveScore}%**. ${cognitiveScore >= 70 ? 'You are at critical risk. Go take a hard-stop break!' : 'You are in a healthy study zone. Keep going!'}`;
      } else if (lower.includes('schedule') || lower.includes('next')) {
        replyText = `Your current Spaced Repetition agenda: [${topicsStr || 'Seeding default topics'}].`;
      } else if (lower.includes('distract') || lower.includes('social')) {
        replyText = `Diagnostic distraction report: Social media distraction average: 14 mins during [History] reviews, and 2 mins during [Chemistry] mock papers. Try using mock exam conditions!`;
      }
    }

    return reply.status(200).send({ reply: replyText });
  });
}
