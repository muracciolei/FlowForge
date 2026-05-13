import Dexie, { Table } from 'dexie';
import { Project, Template } from '../types';

export interface StoredProject extends Project {}
export interface StoredTemplate extends Template {}

export class FlowForgeDB extends Dexie {
  projects!: Table<StoredProject>;
  templates!: Table<StoredTemplate>;
  sessions!: Table<{ id: string; lastOpened: number; projectId: string }>;

  constructor() {
    super('FlowForgeDB');
    this.version(1).stores({
      projects: '&id, createdAt, updatedAt',
      templates: '&id, category',
      sessions: '&id, lastOpened',
    });
  }
}

export const db = new FlowForgeDB();

// Project operations
export const projectDB = {
  async getAll() {
    return await db.projects.toArray();
  },

  async getById(id: string) {
    return await db.projects.get(id);
  },

  async save(project: Project) {
    return await db.projects.put(project);
  },

  async delete(id: string) {
    return await db.projects.delete(id);
  },

  async search(query: string) {
    const projects = await db.projects.toArray();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase())
    );
  },

  async recent(limit = 10) {
    return await db.projects.orderBy('updatedAt').reverse().limit(limit).toArray();
  },

  async autoSave(project: Project) {
    project.updatedAt = Date.now();
    return await this.save(project);
  }
};

// Template operations
export const templateDB = {
  async getAll() {
    return await db.templates.toArray();
  },

  async getById(id: string) {
    return await db.templates.get(id);
  },

  async getByCategory(category: string) {
    return await db.templates.where('category').equals(category).toArray();
  },

  async save(template: Template) {
    return await db.templates.put(template);
  },

  async delete(id: string) {
    return await db.templates.delete(id);
  },
};

// Session operations
export const sessionDB = {
  async saveSession(projectId: string) {
    await db.sessions.clear();
    return await db.sessions.add({
      id: 'current',
      lastOpened: Date.now(),
      projectId
    });
  },

  async getLastSession() {
    return await db.sessions.get('current');
  },

  async clearSession() {
    return await db.sessions.delete('current');
  }
};
