export type NodeType = 
  | 'text'
  | 'logic'
  | 'api'
  | 'ai'
  | 'database'
  | 'decision'
  | 'group'
  | 'media'
  | 'code'
  | 'markdown';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Node {
  id: string;
  type: NodeType;
  position: Position;
  size: Size;
  data: Record<string, any>;
  style?: Record<string, string>;
  selected?: boolean;
  zIndex?: number;
}

export interface Connection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceHandle?: string;
  targetHandle?: string;
  animated?: boolean;
  style?: Record<string, string>;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  nodes: Node[];
  connections: Connection[];
  theme: ThemeType;
  viewState: {
    pan: Position;
    zoom: number;
  };
  createdAt: number;
  updatedAt: number;
  tags?: string[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'ai' | 'architecture' | 'planning' | 'api' | 'software' | 'study' | 'business' | 'neural' | 'automation';
  thumbnail?: string;
  nodes: Omit<Node, 'id'>[];
  connections: Omit<Connection, 'id'>[];
  tags?: string[];
}

export type ThemeType = 
  | 'neon-grid'
  | 'quantum-dark'
  | 'arctic-signal'
  | 'deep-space'
  | 'industrial-hologram';

export interface Theme {
  id: ThemeType;
  name: string;
  colors: {
    background: string;
    gridColor: string;
    nodeBackground: string;
    nodeBorder: string;
    connectionColor: string;
    accentColor: string;
    glowColor: string;
    textColor: string;
    secondaryText: string;
  };
  effects: {
    glowIntensity: number;
    particleEffect: boolean;
    scanlineEffect: boolean;
    gridOpacity: number;
  };
}

export interface SelectionBox {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface ExportOptions {
  format: 'png' | 'svg' | 'json' | 'pdf';
  quality?: 'low' | 'medium' | 'high';
  scale?: number;
  includeBackground?: boolean;
}
