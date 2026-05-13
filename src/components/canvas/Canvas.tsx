import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useCanvasStore } from '../../store';
import { getTheme } from '../../themes';
import { getMousePos, isBoundingBoxesIntersecting } from '../../utils';
import NodeComponent from '../nodes/NodeComponent';
import ConnectionRenderer from '../canvas/ConnectionRenderer';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const {
    nodes,
    connections,
    selectedNodes,
    pan,
    zoom,
    currentTheme,
    showGrid,
    isDragging,
    isSelecting,
    setPan,
    setZoom,
    setDragging,
    setSelecting,
    clearSelection,
    selectNode,
    selectMultiple,
    updateNode,
    addNode,
    connectNodes,
  } = useCanvasStore();

  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const [selectionBox, setSelectionBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const theme = getTheme(currentTheme);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const rect = canvas.getBoundingClientRect();
      const deltaY = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(zoom * deltaY, 5));

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const newPan = {
        x: mouseX - (mouseX - pan.x) * deltaY,
        y: mouseY - (mouseY - pan.y) * deltaY,
      };

      setZoom(newZoom);
      setPan(newPan);
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [zoom, pan, setZoom, setPan]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (target.closest('.node-container')) {
        return;
      }

      if (e.button === 2 || (e.button === 0 && e.ctrlKey)) {
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const startPan = { ...pan };

        const handleMouseMove = (moveE: MouseEvent) => {
          const deltaX = moveE.clientX - startX;
          const deltaY = moveE.clientY - startY;
          setPan({ x: startPan.x + deltaX, y: startPan.y + deltaY });
        };

        const handleMouseUp = () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return;
      }

      if (e.button === 0) {
        clearSelection();
        setSelecting(true);

        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const mousePos = getMousePos(e, canvasRef.current, pan, zoom);
        setSelectionStart(mousePos);
        setSelectionBox({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          width: 0,
          height: 0,
        });
        setDraggedNode(null);
      }
    },
    [pan, zoom, setPan, clearSelection, setSelecting]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!canvasRef.current) return;

      if (isDragging && draggedNode) {
        const mousePos = getMousePos(e, canvasRef.current, pan, zoom);
        updateNode(draggedNode, { position: { x: mousePos.x, y: mousePos.y } });
      }

      if (isSelecting && selectionStart && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        setSelectionBox({
          x: Math.min(selectionBox?.x ?? currentX, currentX),
          y: Math.min(selectionBox?.y ?? currentY, currentY),
          width: Math.abs((selectionBox?.x ?? currentX) - currentX),
          height: Math.abs((selectionBox?.y ?? currentY) - currentY),
        });
      }
    },
    [isDragging, draggedNode, pan, zoom, updateNode, isSelecting, selectionStart, selectionBox]
  );

  const handleMouseUp = useCallback(
    (e?: React.MouseEvent<HTMLDivElement>) => {
      if (isSelecting && selectionStart && canvasRef.current) {
        const worldEnd = e ? getMousePos(e, canvasRef.current, pan, zoom) : selectionStart;
        const minX = Math.min(selectionStart.x, worldEnd.x);
        const minY = Math.min(selectionStart.y, worldEnd.y);
        const maxX = Math.max(selectionStart.x, worldEnd.x);
        const maxY = Math.max(selectionStart.y, worldEnd.y);

        const selected = nodes
          .filter((node) =>
            isBoundingBoxesIntersecting(
              node.position.x,
              node.position.y,
              node.size.width,
              node.size.height,
              minX,
              minY,
              maxX - minX,
              maxY - minY
            )
          )
          .map((node) => node.id);

        if (selected.length) {
          selectMultiple(selected);
        }
      }

      setDragging(false);
      setSelecting(false);
      setSelectionStart(null);
      setSelectionBox(null);
      setDraggedNode(null);
    },
    [isSelecting, selectionStart, nodes, pan, zoom, selectMultiple]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!canvasRef.current) return;

      const data = e.dataTransfer.getData('nodeType');
      if (!data) return;

      try {
        const { type, name } = JSON.parse(data);
        const dropPos = getMousePos(e as unknown as React.MouseEvent<HTMLDivElement>, canvasRef.current, pan, zoom);
        addNode({
          id: Math.random().toString(36).substring(2, 11),
          type,
          position: { x: dropPos.x, y: dropPos.y },
          size: { width: 180, height: 120 },
          data: { label: name, description: `New ${name} node` },
          zIndex: 1,
        });
      } catch {
        // ignore invalid payloads
      }
    },
    [addNode, pan, zoom]
  );

  return (
    <div
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => handleMouseUp()}
      onContextMenu={(e) => e.preventDefault()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="w-full h-full relative overflow-hidden cursor-grab active:cursor-grabbing bg-slate-950"
      style={{ backgroundColor: theme.colors.background }}
    >
      {showGrid && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${theme.colors.gridColor}1a 1px, transparent 1px), linear-gradient(90deg, ${theme.colors.gridColor}1a 1px, transparent 1px)`,
            backgroundSize: `${50 * zoom}px ${50 * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
          }}
        />
      )}

      {theme.effects.scanlineEffect && (
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '100% 40px' }} />
      )}

      {theme.effects.particleEffect && (
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0, transparent 24%), radial-gradient(circle at 80% 15%, rgba(0,217,255,0.08) 0, transparent 18%), radial-gradient(circle at 50% 80%, rgba(181,55,242,0.08) 0, transparent 22%)', opacity: 0.35 }} />
      )}

      <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }} className="absolute inset-0">
        <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ width: '200%', height: '200%', left: '-50%', top: '-50%' }}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <ConnectionRenderer connections={connections} nodes={nodes} />
        </svg>

        <div className="relative">
          {nodes.map((node) => (
            <NodeComponent
              key={node.id}
              node={node}
              isSelected={selectedNodes.has(node.id)}
              onSelect={(e) => {
                e.stopPropagation();
                if (e.shiftKey && selectedNodes.size === 1 && !selectedNodes.has(node.id)) {
                  const sourceNodeId = Array.from(selectedNodes)[0];
                  connectNodes(sourceNodeId, node.id);
                }
                selectNode(node.id, e.ctrlKey || e.metaKey);
              }}
              onDragStart={() => {
                setDraggedNode(node.id);
                setDragging(true);
              }}
            />
          ))}
        </div>
      </div>

      {selectionBox && (
        <div
          className="absolute border border-cyan-400/70 bg-cyan-400/10 pointer-events-none"
          style={{
            left: selectionBox.x,
            top: selectionBox.y,
            width: selectionBox.width,
            height: selectionBox.height,
          }}
        />
      )}

      <div className="absolute bottom-4 left-4 glass-dark rounded-lg px-3 py-2 text-xs text-slate-400 pointer-events-none">
        <div>Nodes: {nodes.length} | Connections: {connections.length}</div>
        <div>Zoom: {(zoom * 100).toFixed(0)}% | Pan: {pan.x.toFixed(0)}, {pan.y.toFixed(0)}</div>
      </div>

      <div className="absolute bottom-4 right-4 glass-dark rounded-lg px-3 py-2 text-xs text-slate-400 pointer-events-none">
        <div>Scroll to zoom • Right-click to pan • Ctrl+A to select all</div>
      </div>
    </div>
  );
};

export default Canvas;
