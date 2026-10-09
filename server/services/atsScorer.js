/**
 * ATS Matching & Skill Gap Analysis Engine
 * Supports local high-precision keyword/semantic extraction
 * + optional Groq / OpenAI LLM integration if API key is provided.
 */

// Comprehensive tech skill taxonomy
const TECH_SKILLS = [
  "JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Angular", "Node.js",
  "Express", "NestJS", "Python", "FastAPI", "Django", "Go", "Golang", "Rust",
  "Java", "Spring Boot", "C++", "C#", ".NET", "PostgreSQL", "MySQL", "MongoDB",
  "Redis", "Elasticsearch", "GraphQL", "REST API", "Docker", "Kubernetes", "AWS",
  "GCP", "Azure", "CI/CD", "GitHub Actions", "Terraform", "Linux", "Git",
  "Tailwind CSS", "CSS3", "HTML5", "Redux", "Zustand", "Webpack", "Vite",
  "Jest", "Playwright", "Cypress", "PyTorch", "TensorFlow", "LangChain",
  "LlamaIndex", "OpenAI API", "HuggingFace", "LLMs", "RAG", "Vector DBs", "Kafka",
  "RabbitMQ", "Microservices", "System Design", "Agile", "Scrum", "TDD"
];

function extractSkillsFromText(text) {
  if (!text) return [];
  const lower = text.toLowerCase();
  const matched = [];

  for (const skill of TECH_SKILLS) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(lower)) {
      matched.push(skill);
    }
  }

  return matched;
}

/**
 * Calculates ATS match score and skill gaps between resume and job
 */
function localAtsMatch(resumeText, job) {
  const resumeSkills = extractSkillsFromText(resumeText);
  const jobText = `${job.title} ${job.role || ""} ${job.description} ${job.experience || ""}`;
  const jobSkills = extractSkillsFromText(jobText);

  // If job has explicit required skills, use those, or fall back to extracted
  const requiredSkills = job.skills && job.skills.length > 0 ? job.skills : jobSkills;

  const matchedSkills = [];
  const missingSkills = [];

  for (const skill of requiredSkills) {
    const found = resumeSkills.some(
      (rs) => rs.toLowerCase() === skill.toLowerCase()
    );
    if (found) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  // Calculate score base
  let score = 50;
  if (requiredSkills.length > 0) {
    const skillRatio = matchedSkills.length / requiredSkills.length;
    score = Math.round(skillRatio * 75);
  }

  // Bonus points for role keyword relevance
  const titleWords = job.title.toLowerCase().split(/\s+/);
  let titleBonus = 0;
  for (const word of titleWords) {
    if (word.length > 3 && resumeText.toLowerCase().includes(word)) {
      titleBonus += 5;
    }
  }
  score = Math.min(98, Math.max(20, score + Math.min(20, titleBonus)));

  // Generate intelligent summary
  let summary = "";
  if (score >= 80) {
    summary = `Strong match (${matchedSkills.slice(0, 3).join(", ")} align closely with role criteria). Recommend immediate application.`;
  } else if (score >= 60) {
    summary = `Moderate alignment. Covers core requirements like ${matchedSkills.slice(0, 2).join(", ") || "fundamentals"}, but lacks ${missingSkills.slice(0, 2).join(", ") || "some niche requirements"}.`;
  } else {
    summary = `Low alignment. Missing critical skills (${missingSkills.slice(0, 3).join(", ")}). Consider tailoring resume keywords.`;
  }

  return {
    matchScore: score,
    matchedSkills,
    missingSkills,
    summary,
    extractedJobSkills: requiredSkills
  };
}

/**
 * Match using Groq/OpenAI if API key available, otherwise local engine
 */
async function matchResumeToJob(resumeText, job) {
  const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
  const baseURL = process.env.GROQ_API_KEY
    ? "https://api.groq.com/openai/v1"
    : process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.GROQ_API_KEY
    ? (process.env.GROQ_MODEL || "llama-3.3-70b-versatile")
    : (process.env.OPENAI_MODEL || "gpt-4o-mini");

  if (!apiKey) {
    return localAtsMatch(resumeText, job);
  }

  try {
    const jobText = `Title: ${job.title}\nCompany: ${job.company}\nDescription: ${job.description}\nExperience: ${job.experience || ""}`;
    const payload = {
      model,
      messages: [
        {
          role: "system",
          content:
            "You are an expert ATS (Applicant Tracking System) parser. Analyze candidate resume against job description.\n" +
            "Return valid JSON ONLY with this structure:\n" +
            "{\n" +
            '  "matchScore": <number 0-100>,\n' +
            '  "matchedSkills": ["skill1", "skill2"],\n' +
            '  "missingSkills": ["missingSkill1", "missingSkill2"],\n' +
            '  "summary": "<1-2 sentence sharp review>"\n' +
            "}"
        },
        {
          role: "user",
          content: `RESUME:\n${resumeText.slice(0, 3000)}\n\nJOB:\n${jobText}`
        }
      ],
      temperature: 0.1
    };

    const res = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`LLM API returned ${res.status}`);
    }

    const data = await res.json();
    const raw = data.choices[0].message.content.trim();
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      matchScore: Math.min(100, Math.max(0, Number(parsed.matchScore) || 0)),
      matchedSkills: Array.isArray(parsed.matchedSkills) ? parsed.matchedSkills : [],
      missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [],
      summary: parsed.summary || "AI analysis complete."
    };
  } catch (err) {
    console.warn(`[ATS] LLM match fallback to local engine: ${err.message}`);
    return localAtsMatch(resumeText, job);
  }
}

module.exports = {
  extractSkillsFromText,
  localAtsMatch,
  matchResumeToJob
};
