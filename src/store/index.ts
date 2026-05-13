import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Node, Connection, ThemeType, Position } from '../types';

interface HistorySnapshot {
  nodes: Node[];
  connections: Connection[];
}

interface CanvasState {
  // Nodes and connections
  nodes: Node[];
  connections: Connection[];
  history: HistorySnapshot[];
  historyIndex: number;

  // Selection
  selectedNodes: Set<string>;
  selectedConnections: Set<string>;

  // Interaction
  isDragging: boolean;
  isSelecting: boolean;
  pan: Position;
  zoom: number;

  // UI State
  currentTheme: ThemeType;
  showMinimap: boolean;
  showGrid: boolean;
  showLibrary: boolean;
  isFullscreen: boolean;

  // Current Project
  currentProjectId: string | null;

  // Actions
  setNodes: (nodes: Node[]) => void;
  addNode: (node: Node) => void;
  updateNode: (id: string, updates: Partial<Node>) => void;
  removeNode: (id: string) => void;

  setConnections: (connections: Connection[]) => void;
  addConnection: (connection: Connection) => void;
  removeConnection: (id: string) => void;
  connectNodes: (sourceNodeId: string, targetNodeId: string) => void;

  selectNode: (id: string, multiSelect?: boolean) => void;
  deselectNode: (id: string) => void;
  clearSelection: () => void;
  selectMultiple: (ids: string[]) => void;

  setDragging: (isDragging: boolean) => void;
  setSelecting: (isSelecting: boolean) => void;
  setPan: (pan: Position) => void;
  setZoom: (zoom: number) => void;

  setTheme: (theme: ThemeType) => void;
  toggleMinimap: () => void;
  toggleGrid: () => void;
  toggleLibrary: () => void;
  toggleFullscreen: () => void;

  setCurrentProjectId: (id: string | null) => void;

  // History
  saveHistory: () => void;
  undo: () => void;
  redo: () => void;

  // Batch operations
  deleteSelected: () => void;
  duplicateSelected: () => void;
  alignSelected: (alignment: 'left' | 'right' | 'top' | 'bottom' | 'center') => void;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

export const useCanvasStore = create<CanvasState>()(
  devtools(
    persist(
      (set) => {
        const saveHistory = () => {
          set((state) => {
            const snapshot: HistorySnapshot = {
              nodes: state.nodes.map((node) => ({ ...node })),
              connections: state.connections.map((connection) => ({ ...connection })),
            };
            const nextHistory = state.history.slice(0, state.historyIndex + 1);
            nextHistory.push(snapshot);
            const trimmedHistory = nextHistory.slice(-40);
            return {
              history: trimmedHistory,
              historyIndex: trimmedHistory.length - 1,
            };
          });
        };

        return {
          nodes: [],
          connections: [],
          history: [],
          historyIndex: -1,
          selectedNodes: new Set(),
          selectedConnections: new Set(),
          isDragging: false,
          isSelecting: false,
          pan: { x: 0, y: 0 },
          zoom: 1,
          currentTheme: 'quantum-dark',
          showMinimap: true,
          showGrid: true,
          showLibrary: true,
          isFullscreen: false,
          currentProjectId: null,

          setNodes: (nodes) => set({ nodes }),
          addNode: (node) => {
            saveHistory();
            set((state) => ({ nodes: [...state.nodes, node] }));
          },
          updateNode: (id, updates) => set((state) => ({
            nodes: state.nodes.map((n) => (n.id === id ? { ...n, ...updates } : n))
          })),
          removeNode: (id) => {
            saveHistory();
            set((state) => ({
              nodes: state.nodes.filter((n) => n.id !== id),
              connections: state.connections.filter(
                (c) => c.sourceNodeId !== id && c.targetNodeId !== id
              )
            }));
          },

          setConnections: (connections) => set({ connections }),
          addConnection: (connection) => {
            saveHistory();
            set((state) => ({ connections: [...state.connections, connection] }));
          },
          removeConnection: (id) => {
            saveHistory();
            set((state) => ({
              connections: state.connections.filter((c) => c.id !== id)
            }));
          },
          connectNodes: (sourceNodeId, targetNodeId) => {
            saveHistory();
            set((state) => ({
              connections: [
                ...state.connections,
                {
                  id: generateId(),
                  sourceNodeId,
                  targetNodeId,
                  animated: true,
                  style: { type: 'flow' }
                }
              ]
            }));
          },

          selectNode: (id, multiSelect = false) => set((state) => {
            const newSelection = new Set(state.selectedNodes);
            if (!multiSelect) newSelection.clear();
            newSelection.add(id);
            return { selectedNodes: newSelection };
          }),
          deselectNode: (id) => set((state) => {
            const newSelection = new Set(state.selectedNodes);
            newSelection.delete(id);
            return { selectedNodes: newSelection };
          }),
          clearSelection: () => set({ selectedNodes: new Set(), selectedConnections: new Set() }),
          selectMultiple: (ids) => set({ selectedNodes: new Set(ids) }),

          setDragging: (isDragging) => set({ isDragging }),
          setSelecting: (isSelecting) => set({ isSelecting }),
          setPan: (pan) => set({ pan }),
          setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(zoom, 5)) }),

          setTheme: (currentTheme) => set({ currentTheme }),
          toggleMinimap: () => set((state) => ({ showMinimap: !state.showMinimap })),
          toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
          toggleLibrary: () => set((state) => ({ showLibrary: !state.showLibrary })),
          toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),

          setCurrentProjectId: (id) => set({ currentProjectId: id }),

          saveHistory,
          undo: () => set((state) => {
            if (state.historyIndex <= 0) return state;
            const previous = state.history[state.historyIndex - 1];
            return {
              nodes: previous.nodes,
              connections: previous.connections,
              historyIndex: state.historyIndex - 1,
              selectedNodes: new Set(),
              selectedConnections: new Set(),
            };
          }),
          redo: () => set((state) => {
            if (state.historyIndex >= state.history.length - 1) return state;
            const next = state.history[state.historyIndex + 1];
            return {
              nodes: next.nodes,
              connections: next.connections,
              historyIndex: state.historyIndex + 1,
              selectedNodes: new Set(),
              selectedConnections: new Set(),
            };
          }),

          deleteSelected: () => {
            saveHistory();
            set((state) => {
              const nodesToDelete = Array.from(state.selectedNodes);
              return {
                nodes: state.nodes.filter((n) => !nodesToDelete.includes(n.id)),
                connections: state.connections.filter(
                  (c) => !nodesToDelete.includes(c.sourceNodeId) && !nodesToDelete.includes(c.targetNodeId)
                ),
                selectedNodes: new Set(),
              };
            });
          },

          duplicateSelected: () => {
            saveHistory();
            set((state) => {
              const nodesToDuplicate = state.nodes.filter((n) => state.selectedNodes.has(n.id));
              const newNodes = nodesToDuplicate.map((n) => ({
                ...n,
                id: generateId(),
                position: { x: n.position.x + 20, y: n.position.y + 20 }
              }));
              return { nodes: [...state.nodes, ...newNodes] };
            });
          },

          alignSelected: (alignment) => {
            saveHistory();
            set((state) => {
              const nodesToAlign = state.nodes.filter((n) => state.selectedNodes.has(n.id));
              if (nodesToAlign.length === 0) return state;

              let alignedNodes = [...nodesToAlign];
              const positions = nodesToAlign.map((n) => n.position);

              if (alignment === 'left') {
                const minX = Math.min(...positions.map((p) => p.x));
                alignedNodes = alignedNodes.map((n) => ({
                  ...n,
                  position: { ...n.position, x: minX }
                }));
              } else if (alignment === 'right') {
                const maxX = Math.max(...positions.map((p) => p.x));
                alignedNodes = alignedNodes.map((n) => ({
                  ...n,
                  position: { ...n.position, x: maxX - n.size.width }
                }));
              } else if (alignment === 'top') {
                const minY = Math.min(...positions.map((p) => p.y));
                alignedNodes = alignedNodes.map((n) => ({
                  ...n,
                  position: { ...n.position, y: minY }
                }));
              } else if (alignment === 'bottom') {
                const maxY = Math.max(...positions.map((p) => p.y));
                alignedNodes = alignedNodes.map((n) => ({
                  ...n,
                  position: { ...n.position, y: maxY - n.size.height }
                }));
              }

              return {
                nodes: state.nodes.map((n) => {
                  const aligned = alignedNodes.find((a) => a.id === n.id);
                  return aligned || n;
                })
              };
            });
          }
        };
      },
      {
        name: 'canvas-store',
        partialize: (state) => ({
          nodes: state.nodes,
          connections: state.connections,
          currentTheme: state.currentTheme,
          showMinimap: state.showMinimap,
          showGrid: state.showGrid,
          currentProjectId: state.currentProjectId,
        })
      }
    )
  )
);
