import React, { useState } from 'react';
import { Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

const SupportButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href="https://buymeacoffee.com/muracciolei"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed top-6 right-6 z-40"
    >
      <motion.div
        animate={{
          boxShadow: isHovered ? '0 0 30px rgba(0, 217, 255, 0.5)' : '0 0 15px rgba(0, 217, 255, 0.2)',
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
        className="glass-dark rounded-full p-3 cursor-pointer group"
        title="Support FlowForge"
      >
        <motion.div
          animate={{ rotate: isHovered ? 15 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Coffee className="w-5 h-5 text-cyan-400" />
        </motion.div>
      </motion.div>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          x: isHovered ? 0 : 10,
        }}
        transition={{ duration: 0.2 }}
        className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap glass-dark rounded-lg px-3 py-2 text-sm pointer-events-none"
      >
        Support FlowForge
      </motion.div>
    </motion.a>
  );
};

export default SupportButton;
