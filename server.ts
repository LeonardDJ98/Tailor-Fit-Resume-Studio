import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: Tailor resume and generate complete application package
app.post('/api/gemini/tailor', async (req, res) => {
  try {
    const { masterResume, jobTitle, company, jobDescription } = req.body;

    if (!jobDescription || !masterResume) {
      return res.status(400).json({ error: 'masterResume and jobDescription are required.' });
    }

    const prompt = `
You are an elite executive career coach and ATS (Applicant Tracking System) optimization algorithm expert.
Your goal is to tailor the candidate's master resume to fit the target job description while maintaining truthfulness, and generate a tailored application package.

TARGET ROLE:
Job Title: ${jobTitle || 'Target Role'}
Company: ${company || 'Target Company'}
Job Description:
"""
${jobDescription}
"""

CANDIDATE'S MASTER RESUME:
"""
${JSON.stringify(masterResume, null, 2)}
"""

INSTRUCTIONS:
1. ATS Analysis:
   - Calculate realistic ATS Match Score (0-100) based on hard skills, experience alignment, and keyword overlap.
   - List key matching keywords already in the resume.
   - List high-priority missing keywords or competencies from the job description that the candidate should highlight or learn.
   - List core strengths and specific recommendations for the application.

2. Tailor Executive Summary:
   - Rewrite candidate's summary specifically for ${company || 'the target company'} and ${jobTitle || 'the role'}. Highlight the most relevant achievements, exact target keywords, and value proposition.

3. Tailor Work Experience:
   - For each work experience, review and enhance bullet points:
     - Rephrase or reorder bullets to emphasize relevant technologies, architectural patterns, leadership, or metrics demanded by the job description.
     - Integrate missing or related keywords naturally where plausible.
     - Use strong action verbs and Google X-Y-Z formula ("Accomplished [X] as measured by [Y], by doing [Z]").
     - Record the specific "bulletDiffs" (original vs tailored and why).
   - Ensure the returned tailoredResume has the updated summary, updated experience bullets, and prioritized skills order (putting the skills most requested by the job description first).

4. Generate Bespoke Cover Letter:
   - Write a compelling, genuine 3-4 paragraph cover letter addressing the hiring team at ${company || 'the company'}. Connect candidate's specific past achievements to the company's explicit job requirements and mission.

5. Screening Questions & Answers:
   - Anticipate 3-4 key screening or interview questions for this specific role and draft tailored answers citing candidate's background.

6. Interview Cheat Sheet:
   - Provide 3-4 strategic talking points/tips for candidate's interview for this specific role.

Output strict JSON conforming to the schema.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            atsAnalysis: {
              type: Type.OBJECT,
              properties: {
                overallScore: { type: Type.INTEGER },
                skillsMatchScore: { type: Type.INTEGER },
                experienceMatchScore: { type: Type.INTEGER },
                keywordsFound: { type: Type.ARRAY, items: { type: Type.STRING } },
                keywordsMissing: { type: Type.ARRAY, items: { type: Type.STRING } },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknessesOrGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendedAdjustments: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: [
                'overallScore',
                'skillsMatchScore',
                'experienceMatchScore',
                'keywordsFound',
                'keywordsMissing',
                'strengths',
                'recommendedAdjustments',
              ],
            },
            tailoredSummary: { type: Type.STRING },
            bulletDiffs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  experienceId: { type: Type.STRING },
                  company: { type: Type.STRING },
                  originalBullet: { type: Type.STRING },
                  tailoredBullet: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ['experienceId', 'originalBullet', 'tailoredBullet', 'reason'],
              },
            },
            tailoredResume: {
              type: Type.OBJECT,
              properties: {
                fullName: { type: Type.STRING },
                headline: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                location: { type: Type.STRING },
                website: { type: Type.STRING },
                linkedin: { type: Type.STRING },
                github: { type: Type.STRING },
                summary: { type: Type.STRING },
                skills: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      category: { type: Type.STRING },
                      items: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['category', 'items'],
                  },
                },
                experience: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      company: { type: Type.STRING },
                      role: { type: Type.STRING },
                      location: { type: Type.STRING },
                      startDate: { type: Type.STRING },
                      endDate: { type: Type.STRING },
                      isCurrent: { type: Type.BOOLEAN },
                      bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                      techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['id', 'company', 'role', 'startDate', 'endDate', 'bullets'],
                  },
                },
                projects: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      role: { type: Type.STRING },
                      url: { type: Type.STRING },
                      description: { type: Type.STRING },
                      highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                      techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['id', 'title', 'description', 'highlights'],
                  },
                },
                education: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      institution: { type: Type.STRING },
                      degree: { type: Type.STRING },
                      fieldOfStudy: { type: Type.STRING },
                      startDate: { type: Type.STRING },
                      endDate: { type: Type.STRING },
                      gpaOrHonors: { type: Type.STRING },
                    },
                    required: ['id', 'institution', 'degree', 'fieldOfStudy', 'endDate'],
                  },
                },
                certifications: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      issuer: { type: Type.STRING },
                      date: { type: Type.STRING },
                      credentialUrl: { type: Type.STRING },
                    },
                    required: ['id', 'name', 'issuer', 'date'],
                  },
                },
              },
              required: ['fullName', 'headline', 'email', 'summary', 'skills', 'experience'],
            },
            coverLetter: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING },
                salutation: { type: Type.STRING },
                body: { type: Type.STRING },
                signOff: { type: Type.STRING },
              },
              required: ['subject', 'salutation', 'body', 'signOff'],
            },
            screeningAnswers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  suggestedAnswer: { type: Type.STRING },
                  keyPointsToMention: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['question', 'suggestedAnswer', 'keyPointsToMention'],
              },
            },
            interviewPrepTips: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  tip: { type: Type.STRING },
                },
                required: ['category', 'tip'],
              },
            },
          },
          required: [
            'atsAnalysis',
            'tailoredSummary',
            'bulletDiffs',
            'tailoredResume',
            'coverLetter',
            'screeningAnswers',
            'interviewPrepTips',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating tailored application:', error);
    return res.status(500).json({
      error: 'Unable to generate tailored application right now. Please verify your job description and try again.',
    });
  }
});

// Endpoint: Parse unformatted resume text/markdown into structured ResumeProfile
app.post('/api/gemini/parse-resume', async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText || !rawText.trim()) {
      return res.status(400).json({ error: 'rawText is required.' });
    }

    const prompt = `
Extract and organize the following unstructured resume text into a clean, complete structured resume object.
Ensure IDs are provided for experiences, projects, education, and certifications (e.g., "exp-1", "proj-1").

RESUME TEXT:
"""
${rawText}
"""
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING },
            headline: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            location: { type: Type.STRING },
            website: { type: Type.STRING },
            linkedin: { type: Type.STRING },
            github: { type: Type.STRING },
            summary: { type: Type.STRING },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  items: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['category', 'items'],
              },
            },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  company: { type: Type.STRING },
                  role: { type: Type.STRING },
                  location: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  isCurrent: { type: Type.BOOLEAN },
                  bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                  techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['id', 'company', 'role', 'startDate', 'endDate', 'bullets'],
              },
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  role: { type: Type.STRING },
                  url: { type: Type.STRING },
                  description: { type: Type.STRING },
                  highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                  techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['id', 'title', 'description', 'highlights'],
              },
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  institution: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  fieldOfStudy: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  gpaOrHonors: { type: Type.STRING },
                },
                required: ['id', 'institution', 'degree', 'fieldOfStudy', 'endDate'],
              },
            },
            certifications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  issuer: { type: Type.STRING },
                  date: { type: Type.STRING },
                  credentialUrl: { type: Type.STRING },
                },
                required: ['id', 'name', 'issuer', 'date'],
              },
            },
          },
          required: ['fullName', 'headline', 'email', 'summary', 'skills', 'experience'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error parsing resume:', error);
    return res.status(500).json({ error: 'Unable to parse resume text. Please ensure the text is legible and try again.' });
  }
});

// Endpoint: AI Bullet Point Enhancer
app.post('/api/gemini/enhance-bullet', async (req, res) => {
  try {
    const { bullet, targetRole, targetCompany, jobDescription } = req.body;
    if (!bullet) {
      return res.status(400).json({ error: 'bullet is required' });
    }

    const prompt = `
Rewrite and elevate this resume achievement bullet point using the Google X-Y-Z formula: "Accomplished [X] as measured by [Y], by doing [Z]".
Make it punchy, action-oriented, metrics-driven, and tailored towards:
Target Role: ${targetRole || 'Software Professional'}
Target Company: ${targetCompany || 'Top Tech Company'}
Optional Job Description Context: ${jobDescription ? jobDescription.slice(0, 1000) : 'None provided'}

Original Bullet:
"${bullet}"

Provide 3 variations:
1. High-Impact Metrics Focused (quantified ROI, speed, scale, or revenue)
2. Technical Depth Focused (highlighting engineering craftsmanship, architecture, systems)
3. Leadership & Ownership Focused (cross-functional initiative, mentoring, delivery)
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            variations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  text: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ['type', 'text', 'explanation'],
              },
            },
          },
          required: ['variations'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error enhancing bullet:', error);
    return res.status(500).json({ error: 'Unable to enhance this bullet point right now. Please try again.' });
  }
});

// Mount Vite middleware for dev or serve static files for prod
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        port: PORT,
        host: '0.0.0.0',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TailorFit server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
