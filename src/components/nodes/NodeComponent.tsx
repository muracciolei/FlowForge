import React from 'react';
import { Node as FlowNode, NodeType } from '../../types';
import { Code, Database, GitBranch, Zap, Image, Type, MessageSquare, Layers, Cpu, FileCode } from 'lucide-react';
import { motion } from 'framer-motion';

interface NodeComponentProps {
  node: FlowNode;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onDragStart: () => void;
}

const NodeComponent: React.FC<NodeComponentProps> = ({
  node,
  isSelected,
  onSelect,
  onDragStart,
}) => {
  const getNodeIcon = (type: NodeType) => {
    const iconProps = { className: 'w-5 h-5' };
    switch (type) {
      case 'text':
        return <Type {...iconProps} />;
      case 'code':
        return <Code {...iconProps} />;
      case 'database':
        return <Database {...iconProps} />;
      case 'logic':
        return <GitBranch {...iconProps} />;
      case 'api':
        return <Zap {...iconProps} />;
      case 'media':
        return <Image {...iconProps} />;
      case 'markdown':
        return <FileCode {...iconProps} />;
      case 'ai':
        return <Cpu {...iconProps} />;
      case 'decision':
        return <Layers {...iconProps} />;
      case 'group':
        return <Layers {...iconProps} />;
      default:
        return <MessageSquare {...iconProps} />;
    }
  };

  const getNodeColor = (type: NodeType) => {
    const colors: Record<NodeType, string> = {
      text: 'from-blue-500 to-cyan-500',
      code: 'from-purple-500 to-pink-500',
      database: 'from-yellow-500 to-orange-500',
      logic: 'from-green-500 to-emerald-500',
      api: 'from-red-500 to-orange-500',
      media: 'from-pink-500 to-rose-500',
      markdown: 'from-indigo-500 to-purple-500',
      ai: 'from-cyan-500 to-blue-500',
      decision: 'from-amber-500 to-yellow-500',
      group: 'from-slate-500 to-gray-500',
    };
    return colors[type];
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onSelect}
      onMouseDown={onDragStart}
      style={{
        position: 'absolute',
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
        width: `${node.size.width}px`,
        height: `${node.size.height}px`,
      }}
      className={`node-container cursor-move group ${
        isSelected
          ? 'shadow-glow-lg bg-slate-800/90 border-2 border-cyan-400'
          : 'hover:bg-slate-800/70'
      }`}
      draggable
      onDragStart={(e) => {
        e.preventDefault();
      }}
    >
      {/* Node content */}
      <div className="flex flex-col h-full p-3">
        {/* Header with icon and type */}
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${getNodeColor(node.type)} text-white`}>
            {getNodeIcon(node.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-300 truncate">
              {node.type}
            </p>
            {node.data?.label && (
              <p className="text-sm font-semibold truncate">{node.data.label}</p>
            )}
          </div>
        </div>

        {/* Description */}
        {node.data?.description && (
          <p className="text-xs text-slate-400 line-clamp-2 mb-2">
            {node.data.description}
          </p>
        )}

        {/* Connection points */}
        <div className="mt-auto flex justify-between">
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-glow-sm" />
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-glow-sm" />
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-cyan-400 pointer-events-none"
          animate={{
            boxShadow: ['0 0 20px rgba(0, 217, 255, 0.5)', '0 0 30px rgba(0, 217, 255, 0.8)'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}
    </motion.div>
  );
};

export default NodeComponent;
