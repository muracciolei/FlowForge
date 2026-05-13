import React, { useEffect, useState } from 'react';
import { useCanvasStore } from './store';
import Canvas from './components/canvas/Canvas';
import Header from './components/ui/Header';
import NodeLibrary from './components/panels/NodeLibrary';
import ProjectPanel from './components/panels/ProjectPanel';
import ThemeSelector from './components/ui/ThemeSelector';
import LoadingScreen from './components/ui/LoadingScreen';
import SupportButton from './components/ui/SupportButton';
import Footer from './components/ui/Footer';
import ExportPanel from './components/ui/ExportPanel';
import Minimap from './components/ui/Minimap';
import OnboardingOverlay from './components/ui/OnboardingOverlay';
import { projectDB, sessionDB } from './db';
import type { Project } from './types';
import { generateId } from './utils';

const App: React.FC = () => {
  const {
    setNodes,
    setConnections,
    setCurrentProjectId,
    setTheme,
    nodes,
    connections,
    currentProjectId,
    showLibrary,
    showMinimap,
    deleteSelected,
    duplicateSelected,
    undo,
    redo,
    clearSelection,
    selectMultiple,
  } = useCanvasStore();

  const [isLoading, setIsLoading] = useState(true);
  const [showProjectPanel, setShowProjectPanel] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('flowforge-onboarding-shown') !== 'true') {
      setShowOnboarding(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    localStorage.setItem('flowforge-onboarding-shown', 'true');
    setShowOnboarding(false);
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const lastSession = await sessionDB.getLastSession();
        if (lastSession?.projectId) {
          const project = await projectDB.getById(lastSession.projectId);
          if (project) {
            setNodes(project.nodes);
            setConnections(project.connections);
            setCurrentProjectId(project.id);
            setTheme(project.theme);
            return;
          }
        }

        const defaultProject: Project = {
          id: generateId(),
          name: 'Untitled Project',
          description: 'A new FlowForge project',
          nodes: [],
          connections: [],
          theme: 'quantum-dark',
          viewState: { pan: { x: 0, y: 0 }, zoom: 1 },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        await projectDB.save(defaultProject);
        await sessionDB.saveSession(defaultProject.id);
        setCurrentProjectId(defaultProject.id);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [setConnections, setCurrentProjectId, setNodes, setTheme]);

  useEffect(() => {
    if (!currentProjectId) return;

    const autoSaveInterval = setInterval(async () => {
      const state = useCanvasStore.getState();
      const project = await projectDB.getById(state.currentProjectId!);
      if (project) {
        await projectDB.autoSave({
          ...project,
          nodes: state.nodes,
          connections: state.connections,
          theme: state.currentTheme,
          updatedAt: Date.now(),
        });
      }
    }, 5000);

    return () => clearInterval(autoSaveInterval);
  }, [currentProjectId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const ctrl = event.ctrlKey || event.metaKey;
      if (ctrl && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        selectMultiple(nodes.map((n) => n.id));
      }

      if (event.key === 'Delete') {
        event.preventDefault();
        deleteSelected();
      }

      if (ctrl && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        duplicateSelected();
      }

      if (ctrl && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }

      if (event.key === 'Escape') {
        clearSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes, deleteSelected, duplicateSelected, redo, undo, clearSelection, selectMultiple]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full h-screen bg-slate-950 text-white overflow-hidden flex flex-col">
      <Header
        onNewProject={() => setShowProjectPanel(true)}
        onThemeChange={() => setShowThemeSelector(true)}
        onExport={() => setShowExportPanel(true)}
        onTutorial={() => setShowOnboarding(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {showLibrary && <NodeLibrary />}

        <div className="flex-1 relative">
          <Canvas />
        </div>

        {showMinimap && (
          <div className="hidden lg:block w-56 border-l border-slate-700/30 bg-slate-900/20 backdrop-blur-sm p-2">
            <Minimap />
          </div>
        )}
      </div>

      {showProjectPanel && <ProjectPanel onClose={() => setShowProjectPanel(false)} />}
      {showThemeSelector && <ThemeSelector onClose={() => setShowThemeSelector(false)} />}
      {showExportPanel && (
        <ExportPanel
          onClose={() => setShowExportPanel(false)}
          nodes={nodes}
          connections={connections}
        />
      )}
      {showOnboarding && <OnboardingOverlay onClose={handleCloseOnboarding} />}

      <SupportButton />
      <Footer />
    </div>
  );
};

export default App;
