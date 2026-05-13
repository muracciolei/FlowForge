import React from 'react';
import { motion } from 'framer-motion';
import { X, MousePointer, Layers, Sparkles, Download } from 'lucide-react';

interface OnboardingOverlayProps {
  onClose: () => void;
}

const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="glass-strong max-w-3xl w-full rounded-3xl border border-cyan-500/15 p-6 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/80 mb-2">Welcome to FlowForge</p>
            <h2 className="text-3xl font-bold tracking-tight">Your futuristic design workspace.</h2>
            <p className="mt-3 text-slate-400 max-w-2xl">
              FlowForge is built to feel premium, local-first, and cinematic. Explore the canvas, add nodes, wire flows, and export everything directly from your browser.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-700/70 px-3 py-2 text-slate-300 hover:bg-slate-800/80 transition"
            aria-label="Close onboarding"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="glass-dark rounded-3xl p-5 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-4 text-cyan-300">
              <MousePointer className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Build with motion</h3>
            </div>
            <p className="text-slate-400">
              Pan with right-click, zoom with scroll, and drag nodes onto the canvas for fluid interaction.
            </p>
          </div>

          <div className="glass-dark rounded-3xl p-5 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-4 text-cyan-300">
              <Layers className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Create dynamic structures</h3>
            </div>
            <p className="text-slate-400">
              Use the node library, templates, and smart grouping to design architecture, workflows, or knowledge maps.
            </p>
          </div>

          <div className="glass-dark rounded-3xl p-5 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-4 text-cyan-300">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Feel the glow</h3>
            </div>
            <p className="text-slate-400">
              Choose between immersive themes and watch your workspace transform from Neon Grid to Deep Space.
            </p>
          </div>

          <div className="glass-dark rounded-3xl p-5 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-4 text-cyan-300">
              <Download className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Export instantly</h3>
            </div>
            <p className="text-slate-400">
              Export your project as JSON, SVG, PNG, or prepare layouts for PDF—all offline and local-first.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">Ready to explore FlowForge?</p>
          </div>
          <button
            onClick={onClose}
            className="btn-primary px-6 py-3 text-sm font-semibold"
          >
            Start building
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OnboardingOverlay;
