import { Theme, ThemeType } from '../types';

export const THEMES: Record<ThemeType, Theme> = {
  'neon-grid': {
    id: 'neon-grid',
    name: 'Neon Grid',
    colors: {
      background: '#0a0e27',
      gridColor: '#00d9ff',
      nodeBackground: 'rgba(15, 23, 42, 0.8)',
      nodeBorder: '#00d9ff',
      connectionColor: '#00d9ff',
      accentColor: '#ff006e',
      glowColor: '#00d9ff',
      textColor: '#ffffff',
      secondaryText: '#94a3b8'
    },
    effects: {
      glowIntensity: 1,
      particleEffect: true,
      scanlineEffect: false,
      gridOpacity: 0.15
    }
  },
  'quantum-dark': {
    id: 'quantum-dark',
    name: 'Quantum Dark',
    colors: {
      background: '#0f172a',
      gridColor: 'rgba(15, 23, 42, 0.5)',
      nodeBackground: 'rgba(30, 41, 59, 0.8)',
      nodeBorder: '#64748b',
      connectionColor: '#b537f2',
      accentColor: '#b537f2',
      glowColor: '#b537f2',
      textColor: '#f1f5f9',
      secondaryText: '#cbd5e1'
    },
    effects: {
      glowIntensity: 0.8,
      particleEffect: false,
      scanlineEffect: false,
      gridOpacity: 0.08
    }
  },
  'arctic-signal': {
    id: 'arctic-signal',
    name: 'Arctic Signal',
    colors: {
      background: '#0c1821',
      gridColor: '#38bdf8',
      nodeBackground: 'rgba(15, 23, 42, 0.9)',
      nodeBorder: '#0ea5e9',
      connectionColor: '#38bdf8',
      accentColor: '#06b6d4',
      glowColor: '#38bdf8',
      textColor: '#ecf0f1',
      secondaryText: '#bdc3c7'
    },
    effects: {
      glowIntensity: 0.9,
      particleEffect: true,
      scanlineEffect: true,
      gridOpacity: 0.12
    }
  },
  'deep-space': {
    id: 'deep-space',
    name: 'Deep Space',
    colors: {
      background: '#000814',
      gridColor: '#7c3aed',
      nodeBackground: 'rgba(15, 23, 42, 0.95)',
      nodeBorder: '#9333ea',
      connectionColor: '#a855f7',
      accentColor: '#ec4899',
      glowColor: '#a855f7',
      textColor: '#f5f3ff',
      secondaryText: '#d8b4fe'
    },
    effects: {
      glowIntensity: 1.2,
      particleEffect: true,
      scanlineEffect: false,
      gridOpacity: 0.1
    }
  },
  'industrial-hologram': {
    id: 'industrial-hologram',
    name: 'Industrial Hologram',
    colors: {
      background: '#1a1a2e',
      gridColor: '#00ff88',
      nodeBackground: 'rgba(26, 26, 46, 0.8)',
      nodeBorder: '#00dd77',
      connectionColor: '#00ff88',
      accentColor: '#ffbe0b',
      glowColor: '#00ff88',
      textColor: '#e0e0e0',
      secondaryText: '#a0a0a0'
    },
    effects: {
      glowIntensity: 1.1,
      particleEffect: false,
      scanlineEffect: true,
      gridOpacity: 0.2
    }
  }
};

export const getTheme = (themeId: ThemeType): Theme => {
  return THEMES[themeId] || THEMES['quantum-dark'];
};

export const getAllThemes = (): Theme[] => {
  return Object.values(THEMES);
};
