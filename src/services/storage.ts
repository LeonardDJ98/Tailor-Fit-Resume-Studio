import { ResumeProfile, TailoredApplication } from '../types/resume';
import { INITIAL_SAMPLE_RESUME } from '../data/sampleResume';

const MASTER_RESUME_KEY = 'tailorfit_master_resume_v1';
const APPLICATIONS_KEY = 'tailorfit_applications_v1';

export function loadMasterResume(): ResumeProfile {
  try {
    const raw = localStorage.getItem(MASTER_RESUME_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.fullName) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load master resume from storage:', err);
  }
  return INITIAL_SAMPLE_RESUME;
}

export function saveMasterResume(resume: ResumeProfile): void {
  try {
    localStorage.setItem(MASTER_RESUME_KEY, JSON.stringify(resume));
  } catch (err) {
    console.error('Failed to save master resume:', err);
  }
}

export function loadApplications(): TailoredApplication[] {
  try {
    const raw = localStorage.getItem(APPLICATIONS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load applications from storage:', err);
  }
  return [];
}

export function saveApplications(apps: TailoredApplication[]): void {
  try {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
  } catch (err) {
    console.error('Failed to save applications:', err);
  }
}

export function saveApplication(app: TailoredApplication): void {
  const current = loadApplications();
  const existingIdx = current.findIndex((a) => a.id === app.id);
  let updated: TailoredApplication[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = app;
  } else {
    updated = [app, ...current];
  }
  saveApplications(updated);
}

export function deleteApplication(id: string): void {
  const current = loadApplications();
  const filtered = current.filter((a) => a.id !== id);
  saveApplications(filtered);
}

export function exportResumeAsMarkdown(resume: ResumeProfile): string {
  let md = `# ${resume.fullName}\n`;
  md += `**${resume.headline}**\n\n`;
  md += `📧 ${resume.email} | 📱 ${resume.phone} | 📍 ${resume.location}\n`;
  if (resume.linkedin || resume.github || resume.website) {
    const links = [
      resume.website && `[Portfolio](${resume.website})`,
      resume.linkedin && `[LinkedIn](${resume.linkedin})`,
      resume.github && `[GitHub](${resume.github})`,
    ].filter(Boolean);
    md += `${links.join(' | ')}\n\n`;
  } else {
    md += '\n';
  }

  md += `## Professional Summary\n${resume.summary}\n\n`;

  md += `## Skills\n`;
  for (const cat of resume.skills) {
    md += `- **${cat.category}:** ${cat.items.join(', ')}\n`;
  }
  md += '\n';

  md += `## Professional Experience\n`;
  for (const exp of resume.experience) {
    md += `### ${exp.role} — ${exp.company}\n`;
    md += `*${exp.startDate} - ${exp.endDate} | ${exp.location}*\n\n`;
    for (const bullet of exp.bullets) {
      md += `- ${bullet}\n`;
    }
    if (exp.techStack && exp.techStack.length > 0) {
      md += `*Technologies:* ${exp.techStack.join(', ')}\n`;
    }
    md += '\n';
  }

  if (resume.projects && resume.projects.length > 0) {
    md += `## Projects\n`;
    for (const proj of resume.projects) {
      md += `### ${proj.title}${proj.role ? ` (${proj.role})` : ''}\n`;
      if (proj.url) md += `*${proj.url}*\n`;
      md += `${proj.description}\n\n`;
      for (const h of proj.highlights) {
        md += `- ${h}\n`;
      }
      if (proj.techStack && proj.techStack.length > 0) {
        md += `*Technologies:* ${proj.techStack.join(', ')}\n`;
      }
      md += '\n';
    }
  }

  if (resume.education && resume.education.length > 0) {
    md += `## Education\n`;
    for (const edu of resume.education) {
      md += `### ${edu.degree} in ${edu.fieldOfStudy}\n`;
      md += `*${edu.institution} — Graduated ${edu.endDate}*`;
      if (edu.gpaOrHonors) md += ` (${edu.gpaOrHonors})`;
      md += '\n\n';
    }
  }

  if (resume.certifications && resume.certifications.length > 0) {
    md += `## Certifications\n`;
    for (const cert of resume.certifications) {
      md += `- **${cert.name}** — ${cert.issuer} (${cert.date})\n`;
    }
  }

  return md;
}
