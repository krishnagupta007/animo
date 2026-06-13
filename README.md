# Animo: Gamified Study & Wellness Dashboard 🚀

**Animo** is a high-performance, gamified dashboard designed for competitive exam aspirants (UPSC, JEE, NEET) to optimize study habits, track wellness, and maintain cognitive health using AI-driven coaching.

## 🌟 Key Features
- **Gamified Quests:** Complete daily wellness tasks (Hydration, Pomodoro, Journaling) to earn tokens and maintain streaks.
- **AI Study Advisor:** Real-time coaching from "Nia," an AI expert that provides personalized feedback based on your fatigue levels and study logs.
- **Spaced Repetition Agenda:** Integrated agenda for reviewing high-risk subjects.
- **Biometric Trackers:** Visual tracking for hydration, sleep quality, and cognitive burnout.
- **Zenith Journal:** Secure, AI-analyzed journaling with safety overrides for mental health support.

## 🏗️ Architecture
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS.
- **Backend:** Fastify (deployed as Vercel Serverless Functions).
- **Database:** MongoDB Atlas (M0 Free Tier).
- **AI:** OpenRouter (Gemini / Claude) for sentiment analysis and coaching.

## 🔒 Security Matrix
| Feature | Implementation |
| :--- | :--- |
| **API Security** | Helmet (strict CSP), CORS, Rate Limiting (Fastify) |
| **Validation** | Zod (strict schema validation for all API endpoints) |
| **Sanitization** | Custom HTML-escaping utility for all user inputs |
| **Safety** | Critical keyword detection in journals with emergency escalation |
| **Error Handling** | Global error handlers to prevent stack trace leakage |

## 🧪 Test Coverage
- **Unit & Integration:** Vitest & React Testing Library.
- **Accessibility:** `vitest-axe` (WCAG 2.1 AA compliant).
- **Statement Coverage:** ~85%+ on core business logic.
- **Run Tests:** `npm test` | **Coverage:** `npm run test -- --coverage`

## ♿ Accessibility (A11y)
- **WCAG 2.1 AA:** Full keyboard navigation, semantic HTML, and ARIA labels.
- **Reduced Motion:** Media query support for animations.
- **Focus Management:** Trapped focus for interactive widgets.

## 🚀 Deployment
Deployed on **Vercel** as a full-stack application.
- **Live URL:** [Your Live URL Here]
- **Environment:** Node.js 22.x, MongoDB Atlas.

---
*Built with ❤️ for PromptWars 2026.*
