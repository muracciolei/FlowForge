import React, { useMemo } from 'react';
import { useCanvasStore } from '../../store';
import { getTheme } from '../../themes';

const Minimap: React.FC = () => {
  const { nodes, pan, zoom, currentTheme, setPan } = useCanvasStore();
  const theme = getTheme(currentTheme);

  const view = useMemo(() => {
    const allX = nodes.flatMap((node) => [node.position.x, node.position.x + node.size.width]);
    const allY = nodes.flatMap((node) => [node.position.y, node.position.y + node.size.height]);
    const minX = Math.min(...allX, 0);
    const minY = Math.min(...allY, 0);
    const maxX = Math.max(...allX, 800);
    const maxY = Math.max(...allY, 600);
    const width = maxX - minX || 1;
    const height = maxY - minY || 1;
    const scale = Math.min(200 / width, 220 / height);

    return { minX, minY, width, height, scale };
  }, [nodes]);

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const worldX = clickX / view.scale + view.minX;
    const worldY = clickY / view.scale + view.minY;

    setPan({
      x: -(worldX * zoom) + rect.width / 2,
      y: -(worldY * zoom) + rect.height / 2,
    });
  };

  return (
    <div className="h-full glass-dark rounded-xl p-3 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Minimap</p>
          <p className="text-sm text-slate-200">Quick navigation</p>
        </div>
        <div className="rounded-lg px-2 py-1 text-[10px] uppercase tracking-widest text-slate-500 bg-slate-800/60">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      <svg
        viewBox={`0 0 ${view.width} ${view.height}`}
        className="w-full flex-1 rounded-xl border border-slate-700/50 bg-slate-950/30 cursor-pointer"
        onClick={handleClick}
      >
        <rect width="100%" height="100%" fill={theme.colors.background} />
        <defs>
          <linearGradient id="miniGrid" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#14223a" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#miniGrid)" opacity="0.95" />
        {nodes.map((node) => (
          <rect
            key={node.id}
            x={(node.position.x - view.minX) * view.scale}
            y={(node.position.y - view.minY) * view.scale}
            width={node.size.width * view.scale}
            height={node.size.height * view.scale}
            rx="3"
            fill="#00d9ff"
            opacity="0.2"
            stroke="#00d9ff"
            strokeWidth="0.8"
          />
        ))}
        <rect
          x={-pan.x / zoom * view.scale - view.minX * view.scale}
          y={-pan.y / zoom * view.scale - view.minY * view.scale}
          width={(400 / zoom) * view.scale}
          height={(240 / zoom) * view.scale}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
      </svg>
    </div>
  );
};

export default Minimap;
