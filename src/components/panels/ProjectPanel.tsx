import React, { useState, useEffect } from 'react';
import { useCanvasStore } from '../../store';
import { projectDB, sessionDB } from '../../db';
import { Project } from '../../types';
import { TEMPLATES } from '../../templates';
import { X, Plus, Trash2, FolderOpen, Sparkles } from 'lucide-react';
import { generateId, formatDate } from '../../utils';
import { motion } from 'framer-motion';

interface ProjectPanelProps {
  onClose: () => void;
}

const ProjectPanel: React.FC<ProjectPanelProps> = ({ onClose }) => {
  const { setNodes, setConnections, setCurrentProjectId, setTheme } = useCanvasStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'templates'>('projects');

  useEffect(() => {
    const loadProjects = async () => {
      const allProjects = await projectDB.getAll();
      setProjects(allProjects.sort((a, b) => b.updatedAt - a.updatedAt));
    };
    loadProjects();
  }, []);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    const project: Project = {
      id: generateId(),
      name: newProjectName,
      description: '',
      nodes: [],
      connections: [],
      theme: 'quantum-dark',
      viewState: { pan: { x: 0, y: 0 }, zoom: 1 },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await projectDB.save(project);
    await sessionDB.saveSession(project.id);

    setNodes([]);
    setConnections([]);
    setCurrentProjectId(project.id);
    setTheme(project.theme);

    setNewProjectName('');
    onClose();
  };

  const handleOpenProject = async (project: Project) => {
    setNodes(project.nodes);
    setConnections(project.connections);
    setCurrentProjectId(project.id);
    setTheme(project.theme);
    await sessionDB.saveSession(project.id);
    onClose();
  };

  const handleOpenTemplate = async (templateId: string) => {
    const template = TEMPLATES.find((item) => item.id === templateId);
    if (!template) return;

    const nodes = template.nodes.map((node) => ({
      ...node,
      id: generateId(),
    }));

    const connections = template.connections.map((connection) => ({
      ...connection,
      id: generateId(),
    }));

    const project: Project = {
      id: generateId(),
      name: template.name,
      description: template.description,
      nodes,
      connections,
      theme: 'neon-grid',
      viewState: { pan: { x: 0, y: 0 }, zoom: 1 },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await projectDB.save(project);
    await sessionDB.saveSession(project.id);

    setNodes(nodes);
    setConnections(connections);
    setCurrentProjectId(project.id);
    setTheme(project.theme);

    onClose();
  };

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this project?')) {
      await projectDB.delete(id);
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-strong rounded-2xl p-6 max-w-3xl w-full mx-4 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FolderOpen className="w-6 h-6" />
              Projects
            </h2>
            <p className="text-sm text-slate-400 mt-1">Create, restore, and launch curated workflow templates.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setActiveTab('projects')}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              activeTab === 'projects' ? 'bg-cyan-500/20 text-cyan-200' : 'bg-slate-800/40 text-slate-300'
            }`}
          >
            Saved Projects
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              activeTab === 'templates' ? 'bg-cyan-500/20 text-cyan-200' : 'bg-slate-800/40 text-slate-300'
            }`}
          >
            Templates
          </button>
        </div>

        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
              placeholder="New project name..."
              className="flex-1 bg-slate-800/50 border border-slate-700/30 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              onClick={handleCreateProject}
              disabled={!newProjectName.trim()}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create
            </button>
          </div>
        </div>

        {activeTab === 'templates' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleOpenTemplate(template.id)}
                className="glass-dark p-4 rounded-2xl text-left transition hover:bg-slate-700/60"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{template.category.toUpperCase()}</p>
                  </div>
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                </div>
                <p className="text-sm text-slate-400 mb-3">{template.description}</p>
                <div className="text-xs text-slate-500">Built-in template • Quick start</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {projects.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p>No projects yet. Create one to get started!</p>
              </div>
            ) : (
              projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleOpenProject(project)}
                  className="w-full glass-dark p-4 rounded-2xl text-left transition hover:bg-slate-700/60 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {project.nodes.length} nodes • {formatDate(project.updatedAt)}
                      </p>
                      {project.description && (
                        <p className="text-sm text-slate-400 mt-2 line-clamp-1">{project.description}</p>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleDeleteProject(project.id, e)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProjectPanel;
