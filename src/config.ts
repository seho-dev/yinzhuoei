/** Site-wide configuration & personal profile. Single source of truth. */
export const site = {
  name: 'Seho',
  title: 'Seho — Software Engineer',
  url: 'https://yinzhuoei.com',
  description: {
    en: 'Seho is a software engineer from China working on frontend engineering, AI tooling and open source.',
    zh: 'Seho，来自中国的软件工程师，关注前端工程、AI 工具与开源。',
  },
  /** Words that rotate nowhere; a single, deliberate line. */
  tagline: {
    en: 'Building software that feels right.',
    zh: '构建恰到好处的软件。',
  },
  email: '',
} as const;

export const profile = {
  name: 'Seho',
  github: 'https://github.com/seho-dev',
  x: 'https://x.com/seho20001123',
  xHandle: '@seho20001123',
  location: { en: 'Ankang, China', zh: '中国 · 安康' },
  role: { en: 'Software Engineer', zh: '软件工程师' },
  /** Verified public OSS work (github.com/seho-dev). */
  projects: [
    {
      name: 'sword-framework',
      url: 'https://github.com/swordjs/sword-framework',
      description: {
        en: 'A small, flexible serverless framework for Node.js.',
        zh: '小而灵活的 Node.js Serverless 框架。',
      },
    },
    {
      name: 'vibe-infra',
      url: 'https://github.com/seho-dev/vibe-infra',
      description: {
        en: 'An agent-native specification for versioning AI infrastructure.',
        zh: '面向 Agent 的 AI 基础设施版本化规范。',
      },
    },
    {
      name: 'opencode-mom',
      url: 'https://github.com/seho-dev/opencode-mom',
      description: {
        en: 'A tiny macOS utility for switching OpenCode models.',
        zh: '菜单栏上的 OpenCode 模型切换小工具。',
      },
    },
  ],
} as const;

export const nav = [
  { key: 'home', path: '' },
  { key: 'blog', path: 'blog' },
] as const;
