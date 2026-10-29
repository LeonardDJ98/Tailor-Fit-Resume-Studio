import { ResumeProfile } from '../types/resume';

export const INITIAL_SAMPLE_RESUME: ResumeProfile = {
  id: 'master-resume-default',
  fullName: 'Alex Vance Rivera',
  headline: 'Senior Full-Stack & Systems Engineer | TypeScript, Cloud Architecture & AI Integrations',
  email: 'alex.rivera.dev@gmail.com',
  phone: '+1 (415) 890-4219',
  location: 'San Francisco, CA (Open to Remote / Hybrid)',
  website: 'https://alexrivera.dev',
  linkedin: 'https://linkedin.com/in/alexrivera-eng',
  github: 'https://github.com/alexrivera',
  summary:
    'Results-driven Senior Full-Stack Engineer with 7+ years of experience designing scalable distributed web platforms, high-throughput microservices, and modern user experiences. Track record of improving system uptime to 99.99%, reducing bundle latency by 45%, and leading engineering pods across fast-paced hyper-growth startups.',
  skills: [
    {
      category: 'Languages & Core',
      items: ['TypeScript', 'JavaScript (ESNext)', 'Python', 'Go', 'SQL (PostgreSQL)', 'HTML5/CSS3'],
    },
    {
      category: 'Frontend & UI Frameworks',
      items: ['React 19', 'Next.js', 'Tailwind CSS', 'Vite', 'State Management (Zustand/Redux)', 'WebSockets'],
    },
    {
      category: 'Backend & Cloud Infrastructure',
      items: ['Node.js', 'Express', 'GraphQL', 'Docker', 'AWS (ECS, Lambda, S3, RDS)', 'Redis', 'Kafka', 'CI/CD (GitHub Actions)'],
    },
    {
      category: 'AI & Data Engineering',
      items: ['LLM Orchestration', 'Gemini API', 'Vector Databases (Pinecone)', 'Retrieval-Augmented Generation (RAG)', 'Data Pipelines'],
    },
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Apex Cloud Systems',
      role: 'Senior Full-Stack Engineer (Lead)',
      location: 'San Francisco, CA',
      startDate: '2022-03',
      endDate: 'Present',
      isCurrent: true,
      techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Redis'],
      bullets: [
        'Architected real-time analytics pipeline processing 25M+ events/day, cutting dashboard load times by 62% using Redis caching and WebSocket streams.',
        'Spearheaded enterprise RBAC & multi-tenant security architecture adopted by 140+ B2B clients with zero reported vulnerabilities in third-party audits.',
        'Mentored 6 junior/mid-level engineers, implemented strict automated PR linting/testing pipelines that reduced staging regression bugs by 38%.',
        'Led migration of legacy monolithic client to modular React micro-frontends with Vite, slashing deployment cycle times from 40 mins to 4 mins.',
      ],
    },
    {
      id: 'exp-2',
      company: 'Kinetic Logic Inc.',
      role: 'Full-Stack Software Engineer',
      location: 'Austin, TX (Remote)',
      startDate: '2019-06',
      endDate: '2022-02',
      isCurrent: false,
      techStack: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Docker', 'PostgreSQL'],
      bullets: [
        'Built dynamic customer checkout and subscription billing portal handling $18M in ARR with Stripe billing APIs and automated webhook reconciliation.',
        'Engineered responsive design system components with Tailwind CSS and accessible WCAG 2.1 AA standards, increasing mobile conversion rates by 22%.',
        'Optimized slow relational PostgreSQL queries by adding composite indices and connection pooling, boosting 99th percentile API response times from 850ms to 95ms.',
      ],
    },
    {
      id: 'exp-3',
      company: 'Vanguard Interactive',
      role: 'Associate Software Developer',
      location: 'Seattle, WA',
      startDate: '2018-01',
      endDate: '2019-05',
      isCurrent: false,
      techStack: ['JavaScript', 'React', 'REST APIs', 'Node.js', 'Jest'],
      bullets: [
        'Developed interactive dashboard widgets used by 50,000+ daily active users for workflow visualization.',
        'Wrote end-to-end integration tests using Cypress and Jest, expanding automated test coverage from 44% to 88%.',
      ],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'DocuQuery - Real-Time AI Document Retrieval',
      role: 'Creator & Architect',
      url: 'https://github.com/alexrivera/docuquery',
      description: 'Open-source semantic search and conversational document QA engine powered by vector embeddings and LLM grounding.',
      techStack: ['TypeScript', 'Next.js', 'Python', 'Gemini API', 'PostgreSQL pgvector'],
      highlights: [
        'Built sub-second vector search pipeline across 100k+ enterprise technical documents with hybrid BM25 + embedding ranking.',
        'Received 1,200+ GitHub stars and featured in Hacker News top developer tools showcase.',
      ],
    },
    {
      id: 'proj-2',
      title: 'PulseTelemetry - Distributed Performance Monitor',
      role: 'Lead Developer',
      url: 'https://github.com/alexrivera/pulsetelemetry',
      description: 'Lightweight agent and web visualization dashboard for tracking microservice p99 latency and memory bottlenecks.',
      techStack: ['Go', 'React', 'Tailwind CSS', 'WebSockets', 'TimescaleDB'],
      highlights: [
        'Implemented streaming client visualizer with 60 FPS charts monitoring up to 500 nodes concurrently.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of Washington',
      degree: 'Bachelor of Science (B.S.)',
      fieldOfStudy: 'Computer Science & Software Engineering',
      startDate: '2014',
      endDate: '2018',
      gpaOrHonors: 'Magna Cum Laude (GPA 3.84/4.0)',
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '2023-08',
      credentialUrl: 'https://aws.amazon.com/verification',
    },
  ],
};

export interface JobTemplate {
  title: string;
  company: string;
  location: string;
  description: string;
}

export const SAMPLE_JOB_TEMPLATES: JobTemplate[] = [
  {
    title: 'Senior Full-Stack Engineer, Core Infrastructure',
    company: 'Stripe',
    location: 'San Francisco, CA / Remote',
    description: `About the Role:
Stripe builds economic infrastructure for the internet. As a Senior Full-Stack Engineer on our Core Developer & Payments Infrastructure team, you will design, scale, and maintain mission-critical web applications, financial dashboards, and developer workflows handling millions of transactions daily.

Key Responsibilities:
• Build resilient, responsive, and accessible user interfaces using React, TypeScript, and modern frontend tooling.
• Collaborate with backend systems engineers to design clean, contract-driven GraphQL and REST APIs.
• Champion reliability, automated testing, continuous deployment, and 99.999% availability SLA standards.
• Optimize application performance, bundle size, Core Web Vitals, and server response times.
• Work cross-functionally with Product Managers, UX Designers, and Security teams to deliver polished developer experiences.

Requirements:
• 5+ years of full-stack software engineering experience in modern JavaScript/TypeScript, React, and Node.js.
• Proven track record designing scalable APIs, handling distributed state, and caching (Redis, relational databases).
• Deep understanding of web performance, browser rendering, security protocols (RBAC, CSRF, OAuth).
• Exceptional attention to UI detail, component reusability, and clean software architecture.
• Experience with cloud deployments (AWS, Docker, CI/CD).`,
  },
  {
    title: 'Staff AI Application Engineer',
    company: 'Anthropic',
    location: 'San Francisco, CA (Hybrid)',
    description: `Role Overview:
At Anthropic, we build reliable, beneficial AI systems. We are seeking a Staff AI Application Engineer to bridge frontier foundation models with world-class interactive enterprise applications.

What You'll Do:
• Architect end-to-end AI applications, dynamic chat interfaces, evaluation harnesses, and multimodal agent workflows.
• Implement robust Retrieval-Augmented Generation (RAG) pipelines, semantic vector search, and token streaming interfaces.
• Build lightning-fast client experiences with Next.js, React 19, TypeScript, and state management.
• Partner closely with AI research scientists to safely productionize novel model capabilities, tool calling, and prompt systems.
• Maintain rigorous monitoring, latency budgets, and safety guardrails across high-throughput production workloads.

Qualifications:
• 6+ years of software engineering experience with strong proficiency in TypeScript, React, and Python or Go backend services.
• Hands-on production experience integrating LLMs, prompt engineering, vector databases, and agent architectures.
• Solid background in distributed microservices, asynchronous queues, and real-time streaming protocols (SSE, WebSockets).
• Strong ownership mindset, passion for AI safety, and ability to thrive in a rapid-iteration environment.`,
  },
  {
    title: 'Lead Product Engineer',
    company: 'Linear',
    location: 'Remote (Worldwide)',
    description: `About Linear:
Linear is a tool for modern software teams to manage projects, issues, and product roadmaps with unprecedented speed and craft. We care deeply about keyboard ergonomics, sync engines, and instantaneous user feedback.

Responsibilities:
• Own features end-to-end: from initial design exploration and architecture to shipping and ongoing telemetry.
• Build snappy, local-first web applications using React, TypeScript, and custom synchronization protocols.
• Craft delightful micro-interactions, smooth animations, and zero-latency UI interactions.
• Continuously refine frontend architecture to ensure sub-50ms local interactions regardless of network conditions.

Who You Are:
• You treat software engineering as a high-precision craft with an obsessive eye for detail, typography, and UX flow.
• 5+ years of engineering production web apps with deep mastery of TypeScript, modern React, and CSS/Tailwind.
• Familiarity with offline-first synchronization, IndexedDB/SQLite in browser, or real-time multi-client state.
• Excellent communication skills and autonomy in a distributed, remote-first team.`,
  },
];
