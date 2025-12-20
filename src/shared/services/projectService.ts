'use client';

import { CollectionElementProps } from '@/components/UI/Collection/types';
import { exportToJSON } from './fileService';

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  lastOpenedAt: string;
  data: string; // JSON string з даними сцени
}

const PROJECTS_STORAGE_KEY = '3d-editor-projects';
const CURRENT_PROJECT_KEY = '3d-editor-current-project';
const AUTO_SAVE_KEY = '3d-editor-auto-save';

/**
 * Отримує всі збережені проекти
 */
export function getAllProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const projectsJson = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!projectsJson) return [];
    
    const projects: Project[] = JSON.parse(projectsJson);
    // Сортуємо за останньою взаємодією (відкриття або зміна)
    return projects.sort((a, b) => {
      const aTime = new Date(a.lastOpenedAt > a.updatedAt ? a.lastOpenedAt : a.updatedAt).getTime();
      const bTime = new Date(b.lastOpenedAt > b.updatedAt ? b.lastOpenedAt : b.updatedAt).getTime();
      return bTime - aTime; // Новіші спочатку
    });
  } catch (error) {
    console.error('Помилка при читанні проектів:', error);
    return [];
  }
}

/**
 * Зберігає проект
 */
export function saveProject(
  objects: CollectionElementProps[],
  projectName?: string,
  projectId?: string
): string {
  if (typeof window === 'undefined') return '';
  
  try {
    const projects = getAllProjects();
    const now = new Date().toISOString();
    const projectData = exportToJSON(objects);
    
    let project: Project;
    
    if (projectId) {
      // Оновлюємо існуючий проект
      const existingIndex = projects.findIndex(p => p.id === projectId);
      if (existingIndex !== -1) {
        project = {
          ...projects[existingIndex],
          name: projectName || projects[existingIndex].name,
          data: projectData,
          updatedAt: now,
        };
        projects[existingIndex] = project;
      } else {
        // Створюємо новий проект
        project = {
          id: projectId,
          name: projectName || `Проект ${projects.length + 1}`,
          createdAt: now,
          updatedAt: now,
          lastOpenedAt: now,
          data: projectData,
        };
        projects.push(project);
      }
    } else {
      // Створюємо новий проект
      const newId = `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      project = {
        id: newId,
        name: projectName || `Проект ${projects.length + 1}`,
        createdAt: now,
        updatedAt: now,
        lastOpenedAt: now,
        data: projectData,
      };
      projects.push(project);
    }
    
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    return project.id;
  } catch (error) {
    console.error('Помилка при збереженні проекту:', error);
    throw error;
  }
}

/**
 * Завантажує проект
 */
export function loadProject(projectId: string): Project | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const projects = getAllProjects();
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
      // Оновлюємо час останнього відкриття
      project.lastOpenedAt = new Date().toISOString();
      const projectsUpdated = projects.map(p => 
        p.id === projectId ? project : p
      );
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projectsUpdated));
    }
    
    return project || null;
  } catch (error) {
    console.error('Помилка при завантаженні проекту:', error);
    return null;
  }
}

/**
 * Видаляє проект
 */
export function deleteProject(projectId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const projects = getAllProjects();
    const filtered = projects.filter(p => p.id !== projectId);
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Помилка при видаленні проекту:', error);
    return false;
  }
}

/**
 * Перейменовує проект
 */
export function renameProject(projectId: string, newName: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const projects = getAllProjects();
    const project = projects.find(p => p.id === projectId);
    if (!project) return false;
    
    project.name = newName;
    project.updatedAt = new Date().toISOString();
    
    const updated = projects.map(p => p.id === projectId ? project : p);
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Помилка при перейменуванні проекту:', error);
    return false;
  }
}

/**
 * Зберігає поточний проект (для автозбереження)
 */
export function saveCurrentProject(objects: CollectionElementProps[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    const projectData = exportToJSON(objects);
    localStorage.setItem(CURRENT_PROJECT_KEY, projectData);
  } catch (error) {
    console.error('Помилка при автозбереженні:', error);
  }
}

/**
 * Завантажує поточний проект (автозбереження)
 */
export function loadCurrentProject(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(CURRENT_PROJECT_KEY);
  } catch (error) {
    console.error('Помилка при завантаженні автозбереження:', error);
    return null;
  }
}

/**
 * Очищає автозбереження
 */
export function clearAutoSave(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CURRENT_PROJECT_KEY);
}

