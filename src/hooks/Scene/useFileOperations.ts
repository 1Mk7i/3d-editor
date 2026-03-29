'use client';

import React from 'react';
import { useSceneManager } from '@/hooks/Scene/useSceneManager';
import { FileOperation, FileFormat } from '../../components/UI/Layaout/FileMenu/FileDialog';
import {
    importFromJSON,
    createObjectFromData,
    loadFileAsText,
    importModelFromFile,
    exportSceneToFormat,
} from '@/shared/services/fileService';
import { saveProject } from '@/shared/services/projectService';

const SUPPORTED_FORMATS = '.json,.gltf,.glb,.obj,.stl,.ply,.fbx,.dae,.3mf,.amf';

function getFormatFromFileName(fileName: string): FileFormat | null {
    const name = fileName.toLowerCase();
    if (name.endsWith('.json')) return 'json';
    if (name.endsWith('.gltf')) return 'gltf';
    if (name.endsWith('.glb')) return 'glb';
    if (name.endsWith('.obj')) return 'obj';
    if (name.endsWith('.stl')) return 'stl';
    if (name.endsWith('.ply')) return 'ply';
    if (name.endsWith('.fbx')) return 'fbx';
    if (name.endsWith('.dae')) return 'dae';
    if (name.endsWith('.3mf')) return '3mf';
    if (name.endsWith('.amf')) return 'amf';
    return null;
}

export function useFileOperations(sceneManager: ReturnType<typeof useSceneManager>) {
    const [fileMenuAnchor, setFileMenuAnchor] = React.useState<null | HTMLElement>(null);
    const [fileDialogOpen, setFileDialogOpen] = React.useState(false);
    const [fileOperation, setFileOperation] = React.useState<FileOperation>('export');
    const [workshopDialogOpen, setWorkshopDialogOpen] = React.useState(false);
    const [currentProjectId, setCurrentProjectId] = React.useState<string | null>(null);

    const handleFileMenuOpen = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
        setFileMenuAnchor(event.currentTarget);
    }, []);

    const handleFileMenuClose = React.useCallback(() => {
        setFileMenuAnchor(null);
    }, []);

    const handleFileMenuClick = React.useCallback((operation: FileOperation) => {
        setFileOperation(operation);

        if (operation === 'import') {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = SUPPORTED_FORMATS;
            input.onchange = async (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) return;

                const format = getFormatFromFileName(file.name);
                if (!format) {
                    alert('Невідомий формат файлу. Підтримуються: JSON, GLTF, GLB, OBJ, STL, PLY, FBX, DAE, 3MF, AMF');
                    return;
                }

                try {
                    const importedObjects = await importModelFromFile(file, format);
                    if (importedObjects.length === 0) {
                        alert('Файл не містить об\'єктів для імпорту');
                        return;
                    }
                    let count = 0;
                    importedObjects.forEach((obj, i) => {
                        try {
                            sceneManager.addObject(obj, obj.name || `Imported Object ${i + 1}`, obj.type);
                            count++;
                        } catch (err) {
                            console.error('Помилка при додаванні об\'єкта:', err);
                        }
                    });
                    if (count === 0) alert('Не вдалося імпортувати жодного об\'єкта');
                } catch {
                    // Fallback для JSON
                    if (format === 'json') {
                        try {
                            const json = await loadFileAsText(file);
                            const objectsData = importFromJSON(json);
                            if (objectsData.length === 0) { alert('Файл не містить об\'єктів'); return; }
                            objectsData.forEach(objData => {
                                try {
                                    sceneManager.addObject(createObjectFromData(objData), objData.name, objData.type);
                                } catch (err) {
                                    console.error('Помилка при створенні об\'єкта:', err);
                                }
                            });
                        } catch (err) {
                            console.error('Помилка при імпорті JSON:', err);
                            alert('Помилка при імпорті файлу. Перевірте формат файлу.');
                        }
                    } else {
                        alert(`Помилка при імпорті файлу формату ${format}. Перевірте файл.`);
                    }
                }
            };
            input.click();
            handleFileMenuClose();
        } else {
            setFileDialogOpen(true);
            handleFileMenuClose();
        }
    }, [handleFileMenuClose, sceneManager]);

    const handleFileDialogClose = React.useCallback(() => {
        setFileDialogOpen(false);
    }, []);

    const handleFileConfirm = React.useCallback(async (format: FileFormat, fileName?: string) => {
        try {
            await exportSceneToFormat(sceneManager.objects, format, fileName || 'scene');
            console.log(`Модель успішно експортовано в формат ${format}`);
        } catch (error) {
            console.error('Помилка при експорті:', error);
            alert(error instanceof Error ? error.message : 'Помилка при експорті моделі');
        }
    }, [sceneManager]);

    const handleSaveProject = React.useCallback(() => {
        const projectName = prompt('Введіть назву проекту:', `Проект ${new Date().toLocaleDateString()}`);
        if (projectName) {
            try {
                const projectId = saveProject(sceneManager.objects, projectName, currentProjectId || undefined);
                setCurrentProjectId(projectId);
                alert('Проект збережено!');
            } catch (error) {
                console.error('Помилка при збереженні:', error);
                alert('Помилка при збереженні проекту');
            }
        }
    }, [sceneManager, currentProjectId]);

    const handleLoadProject = React.useCallback((objects: any[]) => {
        sceneManager.objects.forEach(obj => sceneManager.removeObject(obj.id));
        objects.forEach(obj => sceneManager.addObject(obj, obj.name || 'Imported Object', obj.type));
        setCurrentProjectId(null);
    }, [sceneManager]);

    return {
        fileMenuAnchor,
        fileDialogOpen,
        fileOperation,
        workshopDialogOpen,
        setWorkshopDialogOpen,
        handleFileMenuOpen,
        handleFileMenuClose,
        handleFileMenuClick,
        handleFileDialogClose,
        handleFileConfirm,
        handleSaveProject,
        handleLoadProject,
    };
}
