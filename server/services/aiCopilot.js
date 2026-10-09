/**
 * AI Career Copilot & Accelerator Engine
 * Powers:
 * 1. Per-Job Tailored Resume Bullets (ATS Optimization)
 * 2. Multi-Channel Cold Outreach (LinkedIn InMail, Recruiter Cold Email, Cover Letter)
 * 3. Technical & Behavioral Interview Cheat Sheet (with answers & reverse questions)
 */

/**
 * Generate Tailored Resume Experience & Summary for a specific job
 */
function generateTailoredResume(resume, job) {
  const missing = job.missingSkills || [];
  const matched = job.matchedSkills || [];
  const candidateName = resume.name || "Candidate";
  const title = job.title || "Software Engineer";
  const company = job.company || "Target Company";

  // Projected boosted score
  const boostedScore = Math.min(98, Math.max(88, (job.matchScore || 70) + 20));

  const tailoredSummary = 
    `Results-driven ${resume.title || title} with deep hands-on expertise in ${[...matched.slice(0, 3), ...missing.slice(0, 2)].join(", ")}. ` +
    `Proven track record designing scalable full-stack architectures and shipping customer-focused software. ` +
    `Specifically aligned with ${company}'s mission, ready to accelerate engineering throughput and deliver high-impact features.`;

  const tailoredBullets = [
    `Architected and optimized high-throughput systems leveraging ${matched[0] || "modern frameworks"} and ${matched[1] || "cloud services"}, reducing end-to-end response latency by 34% across 1M+ monthly user interactions.`,
    `Integrated robust ${missing[0] || "distributed data"} workflows and ${matched[2] || "automated testing"}, improving code deployment frequency by 45% and eliminating regression downtime.`,
    `Engineered real-time features using ${matched[3] || "TypeScript"} and ${missing[1] || "scalable API design"}, ensuring 99.9% uptime and streamlined developer onboarding.`,
    `Collaborated cross-functionally with product and design to deliver enterprise-grade solutions, consistently exceeding quarterly delivery milestones and engineering KPIs.`
  ];

  return {
    originalScore: job.matchScore || 65,
    boostedScore,
    scoreGain: `+${boostedScore - (job.matchScore || 65)}%`,
    tailoredSummary,
    tailoredBullets,
    keywordsIntegrated: [...matched.slice(0, 4), ...missing.slice(0, 3)]
  };
}

/**
 * Generate High-Converting Cold Outreach (LinkedIn, Cold Email, Cover Letter)
 */
function generateOutreachSuite(resume, job) {
  const candidateName = resume.name || "Alex";
  const company = job.company || "Company";
  const role = job.title || "Engineer";
  const topSkill = (job.matchedSkills && job.matchedSkills[0]) || "full-stack development";

  // LinkedIn Connection Request (<300 chars limit)
  const linkedinMessage = 
    `Hi! Saw the ${role} opening at ${company}. With 5+ years scaling ${topSkill} and AI architectures, I've tackled similar challenges and would love to connect and share a few ideas on how I can add immediate value to your team.`;

  // Cold Email Template
  const emailSubject = `Quick question re: ${role} opening at ${company}`;
  const coldEmail = 
`Hi ${company} Hiring Team,

I noticed ${company} is hiring a ${role}. Given your focus on ${job.matchedSkills?.slice(0, 2).join(" and ") || "building scalable systems"}, I wanted to reach out directly.

In my recent work, I:
• Engineered high-throughput web applications handling over 2M monthly requests using ${job.matchedSkills?.slice(0, 3).join(", ") || "modern tech stacks"}.
• Built automated workflows that reduced process latency by 68% while maintaining 99.9% reliability.
• Led cross-functional initiatives delivering mission-critical product features ahead of schedule.

I’m particularly excited about ${company}'s direction and would welcome 10 minutes to discuss how my background can help your engineering team hit this quarter’s delivery goals.

Resume attached. Thank you for your time!

Best regards,
${candidateName}
${resume.email || "candidate@email.com"} | ${resume.location || "Remote"}`;

  // Tailored Cover Letter
  const coverLetter = 
`Dear Hiring Team at ${company},

I am writing to express my strong interest in the ${role} position at ${company}. Having followed your product innovations and engineering momentum, I am excited about the opportunity to contribute my expertise in ${(job.matchedSkills || []).slice(0, 3).join(", ") || "modern software engineering"} to your team.

Throughout my career, I have focused on building performant, reliable, and user-centric systems. In my previous roles, I architected full-stack applications that scaled to millions of active users, designed resilient backend services, and collaborated closely with product managers and designers to deliver seamless experiences.

Your job description highlights the need for strong proficiency in ${(job.matchedSkills || []).join(", ") || "cutting-edge technologies"}. My direct experience aligning these tools with measurable business outcomes makes me well-prepared to make an immediate impact at ${company}.

I would welcome the opportunity to discuss how my skill set and passion for high-quality engineering align with ${company}'s roadmap.

Sincerely,
${candidateName}
${resume.email || "candidate@email.com"}`;

  return {
    linkedinMessage,
    emailSubject,
    coldEmail,
    coverLetter
  };
}

/**
 * Generate Role-Specific Technical & Behavioral Interview Cheat Sheet
 */
function generateInterviewPrep(resume, job) {
  const role = job.title || "Software Engineer";
  const company = job.company || "Company";
  const primarySkills = job.matchedSkills || ["React", "Node.js", "System Design"];
  const gapSkills = job.missingSkills || ["Testing", "Cloud Architecture"];

  return {
    roleTitle: role,
    companyName: company,
    topTechnicalQuestions: [
      {
        question: `How do you design and optimize low-latency data flow when working with ${primarySkills[0] || "modern frontends"} and ${primarySkills[1] || "backend APIs"}?`,
        focusArea: "System Architecture & Performance",
        talkingPoints: [
          "Discuss caching layers (Redis, CDN edge caching), connection pooling, and payload minimization.",
          "Mention optimistic UI updates, debouncing, and pagination/virtualization.",
          "Cite metrics: 'In my past project, we reduced latency by over 30% through targeted caching.'"
        ]
      },
      {
        question: `How would you handle state synchronization and resilience when services fail or have network timeouts?`,
        focusArea: "Reliability & Error Handling",
        talkingPoints: [
          "Implement exponential backoff retry strategies with jitter.",
          "Use circuit breakers and graceful UI degradation with fallback states.",
          "Log structured telemetry and monitor alerting thresholds."
        ]
      },
      {
        question: `How have you utilized or approached ${gapSkills[0] || primarySkills[2] || "modern testing / CI/CD"} in production environments?`,
        focusArea: "Practical Competency & Growth",
        talkingPoints: [
          `Acknowledge ${gapSkills[0] || "the technology"} and explain foundational concepts.`,
          "Highlight quick ramp-up speed and past experience adopting new tools within 1-2 sprints.",
          "Emphasize unit, integration, and E2E automated testing pipelines."
        ]
      }
    ],
    behavioralQuestions: [
      {
        question: `Tell me about a time you had to deliver a critical feature under a tight deadline with changing requirements.`,
        starGuidance: "Situation: tight release cycle; Task: MVP scope definition; Action: decoupled architecture & prioritized core user paths; Result: shipped on schedule with zero critical bugs."
      },
      {
        question: `How do you handle technical disagreements during code reviews or architecture planning?`,
        starGuidance: "Focus on data-driven benchmarks, team alignment, empathy, and disagree-and-commit principles."
      }
    ],
    reverseQuestionsToAsk: [
      `"What are the biggest technical hurdles the engineering team is currently facing with your architecture this quarter?"`,
      `"How does your team balance shipping fast vs. paying down tech debt, and how are engineering priorities set?"`,
      `"What does success look like for someone in this ${role} role in their first 90 days?"`
    ]
  };
}

module.exports = {
  generateTailoredResume,
  generateOutreachSuite,
  generateInterviewPrep
};
