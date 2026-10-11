# 🎯 AI Job Hunter Web Platform

An intelligent, autonomous AI-powered job hunting and application dashboard inspired by [`AI-Job-Hunter`](https://github.com/v662-coder/AI-Job-Hunter.git). Features an ATS match scoring engine, real-time skill gap analysis, candidate resume parsing, and an application pipeline workflow.

---

## ✨ Key Features & Job-Landing Accelerators

1. **🌐 Live Multi-Board Job Discovery Engine**
   - Click **"Discover Live"** in the top navigation or preset filters.
   - Fetches live, active openings from developer job boards (**RemoteOK**, **Arbeitnow**, etc.) for target roles (*React*, *Full Stack*, *Python*, *AI*, *DevOps*).
   - Instantly parses and scores listings against your resume so you can apply within minutes of posting (boosting interview callback rates by **4x**).

2. **⚡ Per-Job Resume Booster (ATS Tailoring Engine)**
   - Click **"⚡ Boost Resume"** on any job card.
   - Analyzes the specific role's missing keywords and generates **tailored experience bullet points** (CAR framework) and an executive summary.
   - Visualizes your **Before vs After ATS Fit Score** (e.g., 68% ➔ 95%).
   - 1-click copy to paste directly into your resume before submitting.

3. **📨 Recruiter Cold Outreach Suite (Bypass the Online Queue)**
   - Click **"📨 Recruiter InMail"** on any job card.
   - Generates **LinkedIn Connection Note** (under 300 characters, ~30% reply rate).
   - Generates a **Hiring Manager Cold Email** pitch with quantified metrics.
   - Generates a **Custom Tailored Cover Letter**.

4. **🎯 AI Interview Cheat Sheet & Question Predictor**
   - Click **"🎯 Interview Prep"** on any job card.
   - Predicts the **Top 3 Technical Architecture Questions** for that company's stack with talking point answers.
   - Behavioral interview prep using the **STAR methodology**.
   - High-impact **Reverse-Interview Questions** to ask the hiring team at the end of the call.

5. **📊 Interactive Career CRM & Offer Tracker**
   - Track applications across the complete hiring funnel: **Matched** ➔ **Approved** ➔ **Applied** ➔ **Interviewing 🎙️** ➔ **Job Offers 🏆**.
   - Celebration confetti particles upon application dispatch! 🎉

---

## 🛠️ Architecture & Tech Stack

- **Frontend (`/client`)**: React 19, Vite, Lucide Icons, Canvas Confetti, Modern Vanilla CSS with dark theme, glassmorphism, and responsive layouts.
- **Backend (`/server`)**: Node.js, Express, Multer (file uploads), PDF-Parse (resume text extraction), CORS.
- **Data Persistence**: In-memory store with local disk persistence (`server/data/store.json`).
- **AI Engine (`server/services/atsScorer.js`)**: Offline semantic ATS engine with optional LLM support via Groq / OpenAI.

---

## 🚀 Getting Started

### 1. Set Active Workspace
It is recommended to set this folder as your active workspace:
```
/Users/ganesh/.gemini/antigravity-ide/scratch/ai-job-hunter-web
```

### 2. Start the Servers

You can run both the API backend and the React frontend:

#### Terminal 1 — Start the Backend API (Port 5001)
```bash
cd server
npm start
```
*API will run at `http://localhost:5001`*

#### Terminal 2 — Start the Frontend Dashboard (Port 5173)
```bash
cd client
npm run dev
```
*Open [http://localhost:5173](http://localhost:5173) in your browser.*

---

## 🔑 Optional: Configure Cloud AI (Groq / OpenAI)

Create a `.env` file in the `server/` directory if you want live LLM evaluations:
```env
PORT=5001
# Optional: Free key from https://console.groq.com/keys
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# Or OpenAI:
# OPENAI_API_KEY=your_openai_key_here
```
*(If no API key is provided, the application seamlessly runs using its built-in smart ATS keyword matching engine).*
# ai-job-hunter
