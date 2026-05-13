import React, { useState } from 'react';
import { useCanvasStore } from '../../store';
import { NodeType, Node as FlowNode } from '../../types';
import { Code, Database, GitBranch, Zap, Image, Type, Layers, Cpu, FileCode, Plus } from 'lucide-react';
import { generateId } from '../../utils';
import { motion } from 'framer-motion';

const NodeLibrary: React.FC = () => {
  const { addNode, pan, zoom } = useCanvasStore();
  const [expandedCategory, setExpandedCategory] = useState<string | null>('common');

  const nodeTypes: Array<{
    category: string;
    type: NodeType;
    name: string;
    description: string;
    icon: React.ComponentType<any>;
  }> = [
    {
      category: 'common',
      type: 'text',
      name: 'Text',
      description: 'Text content node',
      icon: Type,
    },
    {
      category: 'common',
      type: 'markdown',
      name: 'Markdown',
      description: 'Formatted text content',
      icon: FileCode,
    },
    {
      category: 'common',
      type: 'group',
      name: 'Group',
      description: 'Container node',
      icon: Layers,
    },
    {
      category: 'logic',
      type: 'logic',
      name: 'Logic',
      description: 'Conditional logic',
      icon: GitBranch,
    },
    {
      category: 'logic',
      type: 'decision',
      name: 'Decision',
      description: 'Decision node',
      icon: Layers,
    },
    {
      category: 'system',
      type: 'database',
      name: 'Database',
      description: 'Database connection',
      icon: Database,
    },
    {
      category: 'system',
      type: 'api',
      name: 'API',
      description: 'API endpoint',
      icon: Zap,
    },
    {
      category: 'system',
      type: 'code',
      name: 'Code',
      description: 'Code snippet',
      icon: Code,
    },
    {
      category: 'ai',
      type: 'ai',
      name: 'AI',
      description: 'AI/ML workflow',
      icon: Cpu,
    },
    {
      category: 'media',
      type: 'media',
      name: 'Media',
      description: 'Image/video',
      icon: Image,
    },
  ];

  const categories = Array.from(new Set(nodeTypes.map((n) => n.category)));

  const handleAddNode = (type: NodeType, name: string) => {
    const newNode: FlowNode = {
      id: generateId(),
      type,
      position: {
        x: -pan.x / zoom + Math.random() * 100,
        y: -pan.y / zoom + Math.random() * 100,
      },
      size: { width: 180, height: 120 },
      data: {
        label: name,
        description: `New ${name} node`,
      },
      selected: false,
      zIndex: 1,
    };
    addNode(newNode);
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      className="w-72 border-r border-slate-700/30 bg-slate-900/50 backdrop-blur-lg overflow-y-auto flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700/30 sticky top-0 bg-slate-900/80 backdrop-blur-lg">
        <h2 className="text-lg font-bold mb-1">Node Library</h2>
        <p className="text-xs text-slate-400">Drag or click to add nodes</p>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto">
        {categories.map((category) => {
          const categoryNodes = nodeTypes.filter((n) => n.category === category);
          const isExpanded = expandedCategory === category;

          return (
            <div key={category} className="border-b border-slate-700/20">
              <button
                onClick={() =>
                  setExpandedCategory(isExpanded ? null : category)
                }
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/30 transition-colors text-sm font-semibold uppercase tracking-wider text-cyan-300"
              >
                <span>{category}</span>
                <span className="text-xs bg-slate-800/50 rounded px-2 py-1">
                  {categoryNodes.length}
                </span>
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-slate-800/20"
                >
                  <div className="p-2 space-y-2">
                    {categoryNodes.map((nodeType) => {
                      const Icon = nodeType.icon;
                      return (
                        <button
                          key={nodeType.type}
                          onClick={() =>
                            handleAddNode(nodeType.type, nodeType.name)
                          }
                          className="w-full glass-dark p-3 rounded-lg text-left transition-all hover:bg-slate-700/50 group"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData(
                              'nodeType',
                              JSON.stringify({
                                type: nodeType.type,
                                name: nodeType.name,
                              })
                            );
                          }}
                        >
                          <div className="flex items-start gap-2">
                            <Icon className="w-4 h-4 mt-1 text-cyan-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm group-hover:text-cyan-300">
                                {nodeType.name}
                              </p>
                              <p className="text-xs text-slate-500 line-clamp-1">
                                {nodeType.description}
                              </p>
                            </div>
                            <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default NodeLibrary;
