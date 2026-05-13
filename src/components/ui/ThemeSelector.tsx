import React from 'react';
import { useCanvasStore } from '../../store';
import { getAllThemes } from '../../themes';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThemeSelectorProps {
  onClose: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onClose }) => {
  const { currentTheme, setTheme } = useCanvasStore();
  const themes = getAllThemes();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-strong rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Select Theme</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => {
                setTheme(theme.id);
                onClose();
              }}
              className={`p-4 rounded-lg transition-all duration-300 border-2 ${
                currentTheme === theme.id
                  ? 'border-cyan-400 bg-slate-800/50 shadow-glow-lg'
                  : 'border-slate-700/30 hover:border-slate-600/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-lg border-2 border-slate-600"
                  style={{
                    backgroundColor: theme.colors.background,
                    boxShadow: `0 0 10px ${theme.colors.glowColor}30`
                  }}
                />
                <div className="text-left">
                  <h3 className="font-semibold">{theme.name}</h3>
                  <p className="text-xs text-slate-400">{theme.id}</p>
                </div>
              </div>
              <div className="flex gap-2 text-xs">
                <div
                  className="flex-1 h-6 rounded"
                  style={{ backgroundColor: theme.colors.glowColor + '40' }}
                />
                <div
                  className="flex-1 h-6 rounded"
                  style={{ backgroundColor: theme.colors.accentColor + '40' }}
                />
                <div
                  className="flex-1 h-6 rounded"
                  style={{ backgroundColor: theme.colors.nodeBackground }}
                />
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ThemeSelector;
