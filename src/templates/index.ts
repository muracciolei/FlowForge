import { Template } from '../types';

export const TEMPLATES: Template[] = [
  {
    id: 'ai-agent',
    name: 'AI Agent Workflow',
    description: 'Complete AI/ML workflow with input, processing, and output nodes',
    category: 'ai',
    tags: ['ai', 'machine-learning', 'workflow'],
    nodes: [
      {
        type: 'text',
        position: { x: 50, y: 50 },
        size: { width: 150, height: 100 },
        data: { label: 'Input Data', description: 'Raw input' },
      },
      {
        type: 'ai',
        position: { x: 250, y: 50 },
        size: { width: 150, height: 100 },
        data: { label: 'AI Model', description: 'Process with ML model' },
      },
      {
        type: 'database',
        position: { x: 450, y: 50 },
        size: { width: 150, height: 100 },
        data: { label: 'Output', description: 'Store results' },
      },
    ],
    connections: [],
  },
  {
    id: 'cloud-arch',
    name: 'Cloud Architecture',
    description: 'Standard cloud infrastructure diagram',
    category: 'architecture',
    tags: ['cloud', 'architecture', 'infrastructure'],
    nodes: [
      {
        type: 'api',
        position: { x: 50, y: 50 },
        size: { width: 150, height: 100 },
        data: { label: 'API Gateway', description: 'Entry point' },
      },
      {
        type: 'code',
        position: { x: 250, y: 50 },
        size: { width: 150, height: 100 },
        data: { label: 'Services', description: 'Microservices' },
      },
      {
        type: 'database',
        position: { x: 450, y: 50 },
        size: { width: 150, height: 100 },
        data: { label: 'Database', description: 'Data storage' },
      },
    ],
    connections: [],
  },
  {
    id: 'startup',
    name: 'Startup Planning',
    description: 'Lean startup business model canvas',
    category: 'planning',
    tags: ['startup', 'business', 'planning'],
    nodes: [
      {
        type: 'text',
        position: { x: 50, y: 50 },
        size: { width: 150, height: 100 },
        data: { label: 'Problem', description: 'Define problem' },
      },
      {
        type: 'text',
        position: { x: 250, y: 50 },
        size: { width: 150, height: 100 },
        data: { label: 'Solution', description: 'Propose solution' },
      },
      {
        type: 'text',
        position: { x: 450, y: 50 },
        size: { width: 150, height: 100 },
        data: { label: 'Market', description: 'Target market' },
      },
    ],
    connections: [],
  },
  {
    id: 'api-system',
    name: 'API System Design',
    description: 'Complete API architecture with endpoints and services',
    category: 'api',
    tags: ['api', 'rest', 'system'],
    nodes: [
      {
        type: 'api',
        position: { x: 50, y: 50 },
        size: { width: 150, height: 100 },
        data: { label: 'GET /users', description: 'Fetch users' },
      },
      {
        type: 'code',
        position: { x: 250, y: 50 },
        size: { width: 150, height: 100 },
        data: { label: 'User Service', description: 'Business logic' },
      },
      {
        type: 'database',
        position: { x: 450, y: 50 },
        size: { width: 150, height: 100 },
        data: { label: 'User DB', description: 'Persistent storage' },
      },
    ],
    connections: [],
  },
  {
    id: 'software-arch',
    name: 'Software Architecture',
    description: 'Layered software architecture diagram',
    category: 'software',
    tags: ['software', 'architecture', 'layers'],
    nodes: [
      {
        type: 'text',
        position: { x: 50, y: 50 },
        size: { width: 150, height: 100 },
        data: { label: 'UI Layer', description: 'User interface' },
      },
      {
        type: 'code',
        position: { x: 50, y: 180 },
        size: { width: 150, height: 100 },
        data: { label: 'Business Logic', description: 'Core logic' },
      },
      {
        type: 'database',
        position: { x: 50, y: 310 },
        size: { width: 150, height: 100 },
        data: { label: 'Data Layer', description: 'Persistence' },
      },
    ],
    connections: [],
  },
  {
    id: 'study-map',
    name: 'Study Mind Map',
    description: 'Knowledge mapping and study organization',
    category: 'study',
    tags: ['education', 'mindmap', 'study'],
    nodes: [
      {
        type: 'markdown',
        position: { x: 150, y: 50 },
        size: { width: 150, height: 100 },
        data: { label: 'Main Topic', description: 'Central concept' },
      },
      {
        type: 'text',
        position: { x: 50, y: 200 },
        size: { width: 120, height: 80 },
        data: { label: 'Subtopic 1', description: 'Detail' },
      },
      {
        type: 'text',
        position: { x: 250, y: 200 },
        size: { width: 120, height: 80 },
        data: { label: 'Subtopic 2', description: 'Detail' },
      },
    ],
    connections: [],
  },
  {
    id: 'business-flow',
    name: 'Business Process Flow',
    description: 'Business process diagram with decision points',
    category: 'business',
    tags: ['business', 'process', 'workflow'],
    nodes: [
      {
        type: 'text',
        position: { x: 50, y: 50 },
        size: { width: 150, height: 100 },
        data: { label: 'Start', description: 'Process begins' },
      },
      {
        type: 'decision',
        position: { x: 250, y: 50 },
        size: { width: 150, height: 100 },
        data: { label: 'Decision', description: 'Branch logic' },
      },
      {
        type: 'text',
        position: { x: 450, y: 50 },
        size: { width: 150, height: 100 },
        data: { label: 'End', description: 'Process ends' },
      },
    ],
    connections: [],
  },
  {
    id: 'automation',
    name: 'Automation Pipeline',
    description: 'Automated workflow with triggers and actions',
    category: 'automation',
    tags: ['automation', 'workflow', 'triggers'],
    nodes: [
      {
        type: 'text',
        position: { x: 50, y: 50 },
        size: { width: 150, height: 100 },
        data: { label: 'Trigger', description: 'Start event' },
      },
      {
        type: 'code',
        position: { x: 250, y: 50 },
        size: { width: 150, height: 100 },
        data: { label: 'Action', description: 'Execute task' },
      },
      {
        type: 'api',
        position: { x: 450, y: 50 },
        size: { width: 150, height: 100 },
        data: { label: 'Notification', description: 'Notify result' },
      },
    ],
    connections: [],
  },
];

export const getTemplatesByCategory = (category: string) => {
  return TEMPLATES.filter((t) => t.category === category);
};

export const getAllTemplates = () => {
  return TEMPLATES;
};
