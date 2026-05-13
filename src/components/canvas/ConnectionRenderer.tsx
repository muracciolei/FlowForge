import React from 'react';
import { Connection, Node as FlowNode } from '../../types';
import { motion } from 'framer-motion';

interface ConnectionRendererProps {
  connections: Connection[];
  nodes: FlowNode[];
}

const ConnectionRenderer: React.FC<ConnectionRendererProps> = ({ connections, nodes }) => {
  const getNodeCenter = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    return {
      x: node.position.x + node.size.width / 2,
      y: node.position.y + node.size.height / 2,
    };
  };

  const createPath = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const curve = Math.max(Math.abs(dx), Math.abs(dy)) * 0.45;
    return `M ${x1} ${y1} C ${x1 + curve} ${y1}, ${x2 - curve} ${y2}, ${x2} ${y2}`;
  };

  return (
    <>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="rgba(0, 217, 255, 0.75)" />
        </marker>
      </defs>

      {connections.map((connection) => {
        const sourceCenter = getNodeCenter(connection.sourceNodeId);
        const targetCenter = getNodeCenter(connection.targetNodeId);
        const path = createPath(sourceCenter.x, sourceCenter.y, targetCenter.x, targetCenter.y);

        return (
          <g key={connection.id}>
            <path
              d={path}
              stroke="rgba(0, 217, 255, 0.25)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              filter="url(#glow)"
            />
            <path
              d={path}
              stroke="rgba(0, 217, 255, 0.85)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              markerEnd="url(#arrowhead)"
            />
            {connection.animated && (
              <motion.path
                d={path}
                stroke="rgba(0, 217, 255, 0.65)"
                strokeWidth="1"
                fill="none"
                strokeDasharray="6,6"
                animate={{ strokeDashoffset: [-16, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </g>
        );
      })}
    </>
  );
};

export default ConnectionRenderer;
