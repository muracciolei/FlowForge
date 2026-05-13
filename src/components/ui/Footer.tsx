import React from 'react';
import { Coffee, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-gradient-to-r from-slate-900/50 via-slate-800/30 to-slate-900/50 backdrop-blur-lg border-t border-slate-700/30 px-4 py-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Support CTA */}
        <div className="glass-strong rounded-xl p-6 mb-6 border-l-4 border-cyan-400 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Help build the future of visual systems
                </h3>
                <p className="text-sm text-slate-400">
                  FlowForge is a passion project. If you find value in this tool, consider supporting its development.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://buymeacoffee.com/muracciolei"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2 group"
              >
                <Coffee className="w-4 h-4" />
                Buy Me a Coffee
              </a>
              <p className="text-xs text-slate-500">
                Your support helps keep FlowForge free and ad-free.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
          <div className="mb-4 md:mb-0">
            <p>
              <span className="text-cyan-400 font-semibold">FlowForge</span> • A premium visual workflow builder
            </p>
            <p className="text-xs mt-1">
              100% front-end • Local-first • Open architecture
            </p>
          </div>
          <div className="flex gap-4 text-xs">
            <a href="#" className="hover:text-cyan-400 transition-colors">Docs</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">GitHub</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Twitter</a>
            <span>© 2026</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
