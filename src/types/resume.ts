export interface SkillCategory {
  category: string;
  items: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  bullets: string[];
  techStack?: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  role?: string;
  url?: string;
  description: string;
  highlights: string[];
  techStack?: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate?: string;
  endDate: string;
  gpaOrHonors?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface ResumeProfile {
  id?: string;
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary: string;
  skills: SkillCategory[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
}

export interface ATSAnalysis {
  overallScore: number;
  skillsMatchScore: number;
  experienceMatchScore: number;
  keywordsFound: string[];
  keywordsMissing: string[];
  strengths: string[];
  weaknessesOrGaps?: string[];
  recommendedAdjustments: string[];
}

export interface BulletDiff {
  experienceId: string;
  company?: string;
  originalBullet: string;
  tailoredBullet: string;
  reason: string;
}

export interface CoverLetter {
  subject: string;
  salutation: string;
  body: string;
  signOff: string;
}

export interface ScreeningAnswer {
  question: string;
  suggestedAnswer: string;
  keyPointsToMention: string[];
}

export interface InterviewTip {
  category: string;
  tip: string;
}

export interface TailoredApplication {
  id: string;
  createdAt: string;
  updatedAt?: string;
  jobTitle: string;
  company: string;
  jobLocation?: string;
  jobDescription: string;
  status: 'Saved' | 'Applied' | 'Interviewing' | 'Offer' | 'Archived';
  notes?: string;
  atsAnalysis: ATSAnalysis;
  tailoredResume: ResumeProfile;
  tailoredSummary: string;
  bulletDiffs: BulletDiff[];
  coverLetter: CoverLetter;
  screeningAnswers: ScreeningAnswer[];
  interviewPrepTips: InterviewTip[];
}

export interface BulletEnhancement {
  type: string;
  text: string;
  explanation: string;
}
