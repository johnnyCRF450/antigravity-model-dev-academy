export type VideoCategory =
  | 'All'
  | 'Vibe Coding Foundations'
  | 'Antigravity Getting Started'
  | 'Rules, Skills & MCP'
  | 'Subagents & Mastery';

export interface CuratedVideo {
  id: string;
  youtubeId: string;
  url: string;
  title: string;
  author: string;
  thumbnail: string;
  category: Exclude<VideoCategory, 'All'>;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  recommendedModule: number;
  summary: string;
  discussionPrompt: string;
}

export const CURATED_VIDEOS: CuratedVideo[] = [
  {
    id: 'karpathy-software-3',
    youtubeId: 'LCEmiRjPEtQ',
    url: 'https://www.youtube.com/watch?v=LCEmiRjPEtQ',
    title: 'Andrej Karpathy: Software Is Changing (Again)',
    author: 'Y Combinator',
    thumbnail: 'https://i.ytimg.com/vi/LCEmiRjPEtQ/hqdefault.jpg',
    category: 'Vibe Coding Foundations',
    level: 'Beginner',
    recommendedModule: 1,
    summary:
      'Karpathy breaks down the shift from Software 1.0 (hand-written code) and 2.0 (neural weights) to Software 3.0 (LLMs programmed in natural language), including LLM psychology and human-in-the-loop verification loops.',
    discussionPrompt:
      'Ask the class: Which parts of a credit/churn model workflow are safe to delegate to Software 3.0 agents, and which parts still require deterministic mathematical verification?',
  },
  {
    id: 'yc-vibe-coding-future',
    youtubeId: 'IACHfKmZMr8',
    url: 'https://www.youtube.com/watch?v=IACHfKmZMr8',
    title: 'Vibe Coding Is The Future',
    author: 'Y Combinator',
    thumbnail: 'https://i.ytimg.com/vi/IACHfKmZMr8/hqdefault.jpg',
    category: 'Vibe Coding Foundations',
    level: 'Beginner',
    recommendedModule: 1,
    summary:
      'Explores how high-leverage teams prototype, iterate, and ship production software using conversational coding agents—and how developer skills shift toward system design, taste, and testing.',
    discussionPrompt:
      'Debate: How does rapid vibe coding change the traditional 6-week model prototyping cycle in enterprise data science teams?',
  },
  {
    id: 'antigravity-2-james-nocode',
    youtubeId: 'EB4-udhgVaY',
    url: 'https://www.youtube.com/watch?v=EB4-udhgVaY',
    title: 'Google Antigravity 2.0 Tutorial for Beginners: Learn 90% Of Antigravity in Under 25 Minutes',
    author: 'James NoCode',
    thumbnail: 'https://i.ytimg.com/vi/EB4-udhgVaY/hqdefault.jpg',
    category: 'Antigravity Getting Started',
    level: 'Beginner',
    recommendedModule: 2,
    summary:
      'Fast, practical tour of the Antigravity 2.0 desktop workspace—comparing traditional IDEs against agent-first mission control, project settings, integrations, and component creation.',
    discussionPrompt:
      'Have students compare Antigravity 2.0 parallel agent workspaces against their existing Jupyter/VS Code workflow.',
  },
  {
    id: 'antigravity-codebasics',
    youtubeId: '1Q5sWISByuw',
    url: 'https://www.youtube.com/watch?v=1Q5sWISByuw',
    title: 'Google Antigravity Tutorial for Beginners',
    author: 'codebasics',
    thumbnail: 'https://i.ytimg.com/vi/1Q5sWISByuw/hqdefault.jpg',
    category: 'Antigravity Getting Started',
    level: 'Beginner',
    recommendedModule: 2,
    summary:
      'From a well-known data science & analytics educator: step-by-step installation, building an application from scratch, using the built-in browser agent, inspecting data, and iterating on features.',
    discussionPrompt:
      'Walk through how the built-in browser agent can automatically verify an interactive model evaluation dashboard.',
  },
  {
    id: 'antigravity-normal-people',
    youtubeId: 'oBaT-wo9RTY',
    url: 'https://www.youtube.com/watch?v=oBaT-wo9RTY',
    title: 'Google Antigravity Explained for Normal People (Full Tutorial)',
    author: 'Paul J Lipsky',
    thumbnail: 'https://i.ytimg.com/vi/oBaT-wo9RTY/hqdefault.jpg',
    category: 'Antigravity Getting Started',
    level: 'Beginner',
    recommendedModule: 2,
    summary:
      'Accessible onboarding covering workspace folders, Gemini model selection, and live end-to-end builds—ideal pre-work for statisticians or domain analysts newer to software engineering.',
    discussionPrompt:
      'Great pre-class assignment for students whose background is stronger in statistics/econometrics than full-stack engineering.',
  },
  {
    id: 'antigravity-step-by-step',
    youtubeId: 'EtuWP9Ugo34',
    url: 'https://www.youtube.com/watch?v=EtuWP9Ugo34',
    title: 'Google Antigravity Full Tutorial for Beginners: How to Use Google Antigravity',
    author: 'Mikey Vibe Coding',
    thumbnail: 'https://i.ytimg.com/vi/EtuWP9Ugo34/hqdefault.jpg',
    category: 'Antigravity Getting Started',
    level: 'Intermediate',
    recommendedModule: 3,
    summary:
      'Detailed walkthrough of the Agent Manager, organizing project folders, self-healing error loops, and going from natural-language prompt to a deployed web app.',
    discussionPrompt:
      'Notice the self-healing loop: how can we couple that with pytest assertions for data schema and model metric checks?',
  },
  {
    id: 'antigravity-customizations-guide',
    youtubeId: 'zCrIr_75n1o',
    url: 'https://www.youtube.com/watch?v=zCrIr_75n1o',
    title: 'Customizations in Google Antigravity 2026: Complete Rules, Agent Skills, Subagents & MCP Setup Guide',
    author: 'ProgrammingKnowledge2',
    thumbnail: 'https://i.ytimg.com/vi/zCrIr_75n1o/hqdefault.jpg',
    category: 'Rules, Skills & MCP',
    level: 'Intermediate',
    recommendedModule: 4,
    summary:
      'Deep technical dive into the Antigravity customization hierarchy: writing persistent AGENTS.md rules, modular progressive-disclosure SKILL.md runbooks, subagents, and MCP servers.',
    discussionPrompt:
      'Workshop prompt: Which 3 model governance rules should live in every team repository’s AGENTS.md file?',
  },
  {
    id: 'antigravity-mcp-setup',
    youtubeId: 'zdvmBgpvRbI',
    url: 'https://www.youtube.com/watch?v=zdvmBgpvRbI',
    title: 'How to Configure MCP Tools in Google Antigravity IDE: The Ultimate AI Agent Setup Tutorial 2026',
    author: 'ProgrammingKnowledge2',
    thumbnail: 'https://i.ytimg.com/vi/zdvmBgpvRbI/hqdefault.jpg',
    category: 'Rules, Skills & MCP',
    level: 'Intermediate',
    recommendedModule: 5,
    summary:
      'Hands-on setup showing how to connect local databases, cloud APIs, and external developer tools to Antigravity through the Model Context Protocol (MCP).',
    discussionPrompt:
      'Discuss read-only vs. write permissions when connecting an agent to BigQuery, Postgres, or feature stores via MCP.',
  },
  {
    id: 'antigravity-subagents-pro',
    youtubeId: 'KsK2KykRJho',
    url: 'https://www.youtube.com/watch?v=KsK2KykRJho',
    title: 'How to Use Antigravity Subagents Like a Pro (Step-by-Step Guide)',
    author: 'The Next Signal',
    thumbnail: 'https://i.ytimg.com/vi/KsK2KykRJho/hqdefault.jpg',
    category: 'Subagents & Mastery',
    level: 'Advanced',
    recommendedModule: 5,
    summary:
      'Demonstrates multi-agent orchestration patterns where a coordinator delegates specialized exploration, implementation, and verification tasks to parallel subagents.',
    discussionPrompt:
      'Design exercise: Map a 3-subagent model validation workflow (Leakage Auditor + Challenger Modeler + Model Card Writer).',
  },
  {
    id: 'antigravity-masterclass-2026',
    youtubeId: 'x97dQYtY468',
    url: 'https://www.youtube.com/watch?v=x97dQYtY468',
    title: 'How To Use Google Antigravity IDE 2026: The Ultimate AI Agentic Software Engineering Masterclass!',
    author: 'ProgrammingKnowledge2',
    thumbnail: 'https://i.ytimg.com/vi/x97dQYtY468/hqdefault.jpg',
    category: 'Subagents & Mastery',
    level: 'Advanced',
    recommendedModule: 6,
    summary:
      'End-to-end masterclass on agent-first software engineering: Agent Manager, artifact-driven verification, parent-child subagent hierarchies, and shipping production apps.',
    discussionPrompt:
      'Capstone review: Which verification artifacts should be mandatory before deploying a model web app to stakeholders?',
  },
];

export const OFFICIAL_RESOURCES = [
  {
    title: 'Google Antigravity Official YouTube Channel',
    url: 'https://www.youtube.com/@googleantigravity',
    description: 'Official channel for Antigravity feature launches, agentic workflows, and Gemini updates.',
    badge: 'YouTube Channel',
  },
  {
    title: 'Antigravity Official Documentation',
    url: 'https://antigravity.google/docs',
    description: 'Authoritative docs for Antigravity IDE, Antigravity 2.0, CLI, Skills, Rules, and MCP.',
    badge: 'Docs',
  },
  {
    title: 'Antigravity Skills & Rules Guide',
    url: 'https://antigravity.google/docs/skills',
    description: 'How to author progressive-disclosure SKILL.md runbooks and hierarchical workspace rules.',
    badge: 'Customizations',
  },
  {
    title: 'Model Context Protocol (MCP) in Antigravity',
    url: 'https://antigravity.google/docs/mcp',
    description: 'Connecting Antigravity agents to BigQuery, GitHub, Vercel, databases, and internal APIs.',
    badge: 'MCP',
  },
  {
    title: 'Agent Permissions & Terminal Sandbox',
    url: 'https://antigravity.google/docs/sandbox',
    description: 'Security controls, sandbox execution boundaries, and allowlists for safe enterprise model dev.',
    badge: 'Security',
  },
  {
    title: 'Browser Automation & Testing',
    url: 'https://antigravity.google/docs/ide/browser',
    description: 'Using the built-in browser subagent to test and visually verify deployed model dashboards.',
    badge: 'Verification',
  },
];
