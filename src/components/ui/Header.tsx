import React from 'react';
import { useCanvasStore } from '../../store';
import { Menu, Plus, Download, Settings, Grid3x3, Layers, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onNewProject: () => void;
  onThemeChange: () => void;
  onExport: () => void;
  onTutorial: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewProject, onThemeChange, onExport, onTutorial }) => {
  const { toggleGrid, showGrid, toggleMinimap, toggleLibrary, showLibrary } = useCanvasStore();

  return (
    <header className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/30 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
          <Menu className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-lg font-bold glow-text">FlowForge</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onNewProject}
          className="btn-secondary flex items-center gap-2"
          title="New Project"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New</span>
        </button>

        <button
          onClick={toggleGrid}
          className={`btn-secondary flex items-center gap-2 ${showGrid ? 'shadow-glow' : ''}`}
          title="Toggle Grid"
        >
          <Grid3x3 className="w-4 h-4" />
        </button>

        <button
          onClick={toggleLibrary}
          className={`btn-secondary flex items-center gap-2 ${showLibrary ? 'shadow-glow' : ''}`}
          title="Toggle Library"
        >
          <Layers className="w-4 h-4" />
          <span className="hidden sm:inline">Library</span>
        </button>

        <button
          onClick={toggleMinimap}
          className="btn-secondary hidden md:flex items-center gap-2"
          title="Toggle Minimap"
        >
          <Grid3x3 className="w-4 h-4" />
          <span className="hidden sm:inline">Map</span>
        </button>

        <button
          onClick={onThemeChange}
          className="btn-secondary flex items-center gap-2"
          title="Change Theme"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          onClick={onTutorial}
          className="btn-secondary flex items-center gap-2"
          title="Show Tour"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Tour</span>
        </button>

        <button
          onClick={onExport}
          className="btn-secondary flex items-center gap-2"
          title="Export"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-400">
        <span className="hidden sm:inline">Ready</span>
      </div>
    </header>
  );
};

export default Header;
