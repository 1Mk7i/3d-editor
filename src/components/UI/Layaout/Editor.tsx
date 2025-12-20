'use client';

import React from 'react';
import ThreeScene from '@/components/UI/Scene/ThreeScene';
import ContextMenu from '@/components/ContextMenu/ContextMenu';
import { useContextMenu } from '@/hooks/useContextMenu';
import { useWindowManager } from '@/hooks/useWindowManager';
import { useSceneManager } from '@/hooks/useSceneManager';
import { createContextMenuItems } from '@/config/contextMenuConfig';
import * as THREE from 'three';
import useSceneTree from '@/hooks/useSceneTree';
import { Window } from '@/components/Modals/Window/Window';
import { Settings } from '@/components/UI/Layaout/Settings/SettingsLayout';
import { Chat } from '@/components/UI/Layaout/Chat/ChatLayout';
import { Instructions } from '@/components/UI/Layaout/Instructions/InstructionsLayout';
import { LeftMenu } from './LeftMenu';
import { RightMenu } from './RightMenu';
import { Box, AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton, Tooltip } from '@mui/material';
import { Settings as SettingsIcon, SmartToy as AIIcon, Folder as FolderIcon, Category as CategoryIcon, Help as HelpIcon, Fullscreen as FullscreenIcon, FullscreenExit as FullscreenExitIcon, ChevronRight as ChevronRightIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import { useSettings } from '@/hooks/useSettings';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useFullscreen } from '@/hooks/useFullscreen';
import { FileDialog, FileOperation, FileFormat } from './FileMenu/FileDialog';
import { WorkshopDialog } from './FileMenu/WorkshopDialog';
import { ObjectSelectorMenu } from './ObjectSelector/ObjectSelectorMenu';
import { ObjectSelectorDialog } from './ObjectSelector/ObjectSelectorDialog';
import { exportToJSON, importFromJSON, createObjectFromData, loadFileAsText, downloadFile, importModelFromFile, exportSceneToFormat } from '@/shared/services/fileService';
import { saveProject, saveCurrentProject, loadCurrentProject, clearAutoSave } from '@/shared/services/projectService';
import { ThreeObjectType, createThreeObject, THREE_OBJECT_TYPES } from '@/shared/constants/threeObjects';
import { AgentCommand, parseAgentCommand } from '@/shared/prompts/agentPrompt';

const Editor: React.FC = () => {
    const contextMenu = useContextMenu();
    const windowManager = useWindowManager();
    const sceneManager = useSceneManager();
    const sceneTree = useSceneTree();
    const { settings } = useSettings();
    const isMobile = useIsMobile();
    const { isFullscreen, isSupported, toggleFullscreen } = useFullscreen();
    const [isMounted, setIsMounted] = React.useState(false);
    const [isRightMenuVisible, setIsRightMenuVisible] = React.useState(true);

    React.useEffect(() => {
        setIsMounted(true);
        
        // На мобільних пристроях автоматично встановлюємо повноекранний режим через CSS
        if (isMobile) {
            // Додаємо клас для повноекранного режиму
            document.documentElement.classList.add('mobile-fullscreen');
        }
    }, [isMobile]);


    React.useEffect(() => {
        const tree = sceneManager.getTreeScene();
        sceneTree.updateTree(tree);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sceneManager.objects]);

    const handleSettingsClick = React.useCallback(() => {
        if (isMobile) {
            // На мобільних відкриваємо у повноекранному режимі
            windowManager.openWindow('settings', {
                isVisible: true,
                position: { x: 0, y: 0 },
                size: { width: window.innerWidth, height: window.innerHeight }
            });
            windowManager.maximizeWindow('settings');
        } else {
            windowManager.openWindow('settings', {
                isVisible: true,
                position: { x: 100, y: 100 },
                size: { width: 600, height: 400 }
            });
        }
    }, [windowManager, isMobile]);

    const handleInstructionsClick = React.useCallback(() => {
        if (isMobile) {
            // На мобільних відкриваємо у повноекранному режимі
            windowManager.openWindow('instructions', {
                isVisible: true,
                position: { x: 0, y: 0 },
                size: { width: window.innerWidth, height: window.innerHeight }
            });
            windowManager.maximizeWindow('instructions');
        } else {
            windowManager.openWindow('instructions', {
                isVisible: true,
                position: { x: 150, y: 150 },
                size: { width: 800, height: 600 }
            });
        }
    }, [windowManager, isMobile]);

    const handleChatClick = React.useCallback(() => {
        if (isMobile) {
            // На мобільних відкриваємо у повноекранному режимі
            windowManager.openWindow('chat', {
                isVisible: true,
                position: { x: 0, y: 0 },
                size: { width: window.innerWidth, height: window.innerHeight }
            });
            windowManager.maximizeWindow('chat');
        } else {
            windowManager.openWindow('chat', {
                isVisible: true,
                position: { x: 150, y: 150 },
                size: { width: 400, height: 600 }
            });
        }
    }, [windowManager, isMobile]);

    // Файлове меню
    const [fileMenuAnchor, setFileMenuAnchor] = React.useState<null | HTMLElement>(null);
    const [fileDialogOpen, setFileDialogOpen] = React.useState(false);
    const [fileOperation, setFileOperation] = React.useState<FileOperation>('export');
    const [workshopDialogOpen, setWorkshopDialogOpen] = React.useState(false);
    const [currentProjectId, setCurrentProjectId] = React.useState<string | null>(null);
    
    // Об'єкт меню
    const [objectMenuAnchor, setObjectMenuAnchor] = React.useState<null | HTMLElement>(null);
    const [objectSelectorDialogOpen, setObjectSelectorDialogOpen] = React.useState(false);

    const handleFileMenuOpen = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
        setFileMenuAnchor(event.currentTarget);
    }, []);

    const handleFileMenuClose = React.useCallback(() => {
        setFileMenuAnchor(null);
    }, []);

    const handleFileMenuClick = React.useCallback((operation: FileOperation) => {
        setFileOperation(operation);
        if (operation === 'import') {
            // Для імпорту одразу відкриваємо вибір файлу без діалогу
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json,.gltf,.glb,.obj,.stl,.ply,.fbx,.dae,.3mf,.amf';
            input.onchange = async (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) return;

                try {
                    // Визначаємо формат за розширенням файлу
                    const fileName = file.name.toLowerCase();
                    let format: FileFormat = 'json';
                    
                    if (fileName.endsWith('.json')) format = 'json';
                    else if (fileName.endsWith('.gltf')) format = 'gltf';
                    else if (fileName.endsWith('.glb')) format = 'glb';
                    else if (fileName.endsWith('.obj')) format = 'obj';
                    else if (fileName.endsWith('.stl')) format = 'stl';
                    else if (fileName.endsWith('.ply')) format = 'ply';
                    else if (fileName.endsWith('.fbx')) format = 'fbx';
                    else if (fileName.endsWith('.dae')) format = 'dae';
                    else if (fileName.endsWith('.3mf')) format = '3mf';
                    else if (fileName.endsWith('.amf')) format = 'amf';
                    else {
                        alert('Невідомий формат файлу. Підтримуються: JSON, GLTF, GLB, OBJ, STL, PLY, FBX, DAE, 3MF, AMF');
                        return;
                    }

                    try {
                        // Імпортуємо модель використовуючи Three.js завантажувачі
                        const importedObjects = await importModelFromFile(file, format);
                        
                        if (importedObjects.length === 0) {
                            alert('Файл не містить об\'єктів для імпорту');
                            return;
                        }
                        
                        // Додаємо об'єкти до сцени
                        let importedCount = 0;
                        importedObjects.forEach((obj, index) => {
                            try {
                                const name = obj.name || `Imported Object ${index + 1}`;
                                sceneManager.addObject(obj, name, obj.type);
                                importedCount++;
                            } catch (error) {
                                console.error('Помилка при додаванні об\'єкта:', error);
                            }
                        });
                        
                        if (importedCount > 0) {
                            console.log(`Успішно імпортовано ${importedCount} об'єктів`);
                        } else {
                            alert('Не вдалося імпортувати жодного об\'єкта');
                        }
                    } catch (importError) {
                        // Якщо імпорт через Three.js не вдався, спробуємо JSON
                        if (format === 'json') {
                            try {
                                const json = await loadFileAsText(file);
                                const objectsData = importFromJSON(json);
                                
                                if (objectsData.length === 0) {
                                    alert('Файл не містить об\'єктів для імпорту');
                                    return;
                                }
                                
                                let importedCount = 0;
                                objectsData.forEach(objData => {
                                    try {
                                        const mesh = createObjectFromData(objData);
                                        sceneManager.addObject(mesh, objData.name, objData.type);
                                        importedCount++;
                                    } catch (error) {
                                        console.error('Помилка при створенні об\'єкта:', error);
                                    }
                                });
                                
                                if (importedCount > 0) {
                                    console.log(`Успішно імпортовано ${importedCount} об'єктів`);
                                } else {
                                    alert('Не вдалося імпортувати жодного об\'єкта');
                                }
                            } catch (jsonError) {
                                console.error('Помилка при імпорті JSON:', jsonError);
                                alert('Помилка при імпорті файлу. Перевірте формат файлу.');
                            }
                        } else {
                            console.error('Помилка при імпорті:', importError);
                            alert(`Помилка при імпорті файлу формату ${format}. Перевірте файл.`);
                        }
                    }
                } catch (error) {
                    console.error('Помилка при імпорті:', error);
                    alert('Помилка при імпорті файлу. Перевірте формат файлу.');
                }
            };
            input.click();
            handleFileMenuClose();
        } else {
            // Для експорту відкриваємо діалог
            setFileDialogOpen(true);
            handleFileMenuClose();
        }
    }, [handleFileMenuClose, sceneManager]);

    const handleFileDialogClose = React.useCallback(() => {
        setFileDialogOpen(false);
    }, []);

    const handleFileConfirm = React.useCallback(async (format: FileFormat, fileName?: string) => {
        // Експорт (імпорт обробляється безпосередньо в handleFileMenuClick)
        try {
            await exportSceneToFormat(sceneManager.objects, format, fileName || 'scene');
            console.log(`Модель успішно експортовано в формат ${format}`);
        } catch (error) {
            console.error('Помилка при експорті:', error);
            alert(error instanceof Error ? error.message : 'Помилка при експорті моделі');
        }
    }, [sceneManager]);

    const handleColorChange = React.useCallback(() => {
        if (sceneManager.selectedObjectId) {
            const selectedObject = sceneManager.objects.find(obj => obj.id === sceneManager.selectedObjectId);
            if (selectedObject) {
                const mesh = selectedObject.mesh as THREE.Mesh;
                const material = mesh.material as THREE.MeshStandardMaterial;
                if (material) {
                    const randomColor = Math.random() * 0xffffff;
                    material.color.setHex(randomColor);
                }
            }
        }
    }, [sceneManager]);

    const handleUpdateObject = React.useCallback((id: string, updates: {
        name?: string;
        position?: { x: number; y: number; z: number };
        rotation?: { x: number; y: number; z: number };
        color?: number;
        materialType?: 'standard' | 'wireframe' | 'points';
    }) => {
        const object = sceneManager.objects.find(obj => obj.id === id);
        if (!object) return;

        const mesh = object.mesh as THREE.Mesh;

        // Оновлення назви, позиції та обертання через updateObject для синхронізації зі станом
        if (updates.name !== undefined || updates.position || updates.rotation) {
            sceneManager.updateObject(id, {
                name: updates.name,
                position: updates.position,
                rotation: updates.rotation,
            });
        }

        // Оновлення кольору
        if (updates.color !== undefined) {
            const material = mesh.material as THREE.MeshStandardMaterial | THREE.PointsMaterial;
            if (material && 'color' in material) {
                material.color.setHex(updates.color);
            }
        }

        // Оновлення типу матеріалу
        if (updates.materialType) {
            const currentMaterial = mesh.material as THREE.MeshStandardMaterial;
            if (currentMaterial) {
                if (updates.materialType === 'wireframe') {
                    currentMaterial.wireframe = true;
                } else if (updates.materialType === 'points') {
                    // Для точок використовуємо PointsMaterial
                    if (!(currentMaterial instanceof THREE.PointsMaterial)) {
                        const pointsMaterial = new THREE.PointsMaterial({
                            color: currentMaterial.color.getHex(),
                            size: 0.1,
                        });
                        mesh.material = pointsMaterial;
                    }
                } else {
                    // Повертаємо до стандартного матеріалу
                    if (mesh.material instanceof THREE.PointsMaterial) {
                        const standardMaterial = new THREE.MeshStandardMaterial({
                            color: mesh.material.color.getHex(),
                        });
                        mesh.material = standardMaterial;
                    } else {
                        currentMaterial.wireframe = false;
                    }
                }
            }
        }
    }, [sceneManager.objects]);

    const handleLoadProject = React.useCallback((objects: any[]) => {
        // Очищаємо поточну сцену
        sceneManager.objects.forEach(obj => {
            sceneManager.removeObject(obj.id);
        });
        // Додаємо об'єкти з проекту
        objects.forEach(obj => {
            sceneManager.addObject(obj, obj.name || 'Imported Object', obj.type);
        });
        setCurrentProjectId(null); // Скидаємо ID проекту при завантаженні нового
    }, [sceneManager]);

    const handleObjectSelect = React.useCallback((objectType: ThreeObjectType) => {
        const mesh = createThreeObject(objectType);
        sceneManager.addObject(mesh, objectType.name, mesh.type);
    }, [sceneManager]);

    const handleAgentCommand = React.useCallback((command: AgentCommand) => {
        try {
            if (command.action === 'create' && command.objectType) {
                const objectType = THREE_OBJECT_TYPES.find(obj => obj.id === command.objectType);
                if (objectType) {
                    const mesh = createThreeObject(objectType);
                    
                    // Застосовуємо параметри з команди
                    if (command.position) {
                        mesh.position.set(command.position.x, command.position.y, command.position.z);
                    }
                    if (command.rotation) {
                        mesh.rotation.set(command.rotation.x, command.rotation.y, command.rotation.z);
                    }
                    if (command.scale) {
                        mesh.scale.set(command.scale.x, command.scale.y, command.scale.z);
                    }
                    if (command.color) {
                        const material = mesh.material as THREE.MeshStandardMaterial;
                        material.color.setHex(parseInt(command.color.replace('#', ''), 16));
                    }
                    if (command.materialType) {
                        const currentMaterial = mesh.material as THREE.MeshStandardMaterial;
                        if (command.materialType === 'wireframe') {
                            currentMaterial.wireframe = true;
                        } else if (command.materialType === 'points') {
                            mesh.material = new THREE.PointsMaterial({
                                color: currentMaterial.color.getHex(),
                                size: 0.1,
                            });
                        }
                    }
                    
                    sceneManager.addObject(mesh, command.name || objectType.name, mesh.type);
                }
            } else if (command.action === 'delete' && command.objectId) {
                let objectId: string | null = null;
                
                if (command.objectId === 'selected') {
                    objectId = sceneManager.selectedObjectId;
                } else {
                    // Спочатку шукаємо за ID
                    const foundById = sceneManager.objects.find(obj => obj.id === command.objectId);
                    if (foundById) {
                        objectId = foundById.id;
                    } else {
                        // Якщо не знайдено за ID, шукаємо за назвою
                        const foundByName = sceneManager.objects.find(obj => obj.name === command.objectId);
                        if (foundByName) {
                            objectId = foundByName.id;
                            console.log(`Знайдено об'єкт "${command.objectId}" за назвою, використовується ID: ${objectId}`);
                        }
                    }
                }
                
                if (objectId) {
                    sceneManager.removeObject(objectId);
                    console.log(`Об'єкт з ID "${objectId}" видалено`);
                } else {
                    console.warn(`Не вдалося знайти об'єкт для видалення: "${command.objectId}"`);
                }
            } else if (command.action === 'update' && command.objectId) {
                let objectId: string | null = null;
                
                if (command.objectId === 'selected') {
                    objectId = sceneManager.selectedObjectId;
                } else {
                    // Спочатку шукаємо за ID
                    const foundById = sceneManager.objects.find(obj => obj.id === command.objectId);
                    if (foundById) {
                        objectId = foundById.id;
                    } else {
                        // Якщо не знайдено за ID, шукаємо за назвою
                        const foundByName = sceneManager.objects.find(obj => obj.name === command.objectId);
                        if (foundByName) {
                            objectId = foundByName.id;
                            console.log(`Знайдено об'єкт "${command.objectId}" за назвою, використовується ID: ${objectId}`);
                        }
                    }
                }
                
                if (objectId) {
                    const updates: any = {};
                    if (command.name) updates.name = command.name;
                    if (command.position) updates.position = command.position;
                    if (command.rotation) updates.rotation = command.rotation;
                    if (command.scale) updates.scale = command.scale;
                    if (command.color) {
                        updates.color = parseInt(command.color.replace('#', ''), 16);
                    }
                    if (command.materialType) updates.materialType = command.materialType;
                    
                    handleUpdateObject(objectId, updates);
                }
            } else if (command.action === 'select' && command.objectId) {
                let objectId: string | null = null;
                
                if (command.objectId === 'selected') {
                    objectId = sceneManager.selectedObjectId;
                } else {
                    // Спочатку шукаємо за ID
                    const foundById = sceneManager.objects.find(obj => obj.id === command.objectId);
                    if (foundById) {
                        objectId = foundById.id;
                    } else {
                        // Якщо не знайдено за ID, шукаємо за назвою
                        const foundByName = sceneManager.objects.find(obj => obj.name === command.objectId);
                        if (foundByName) {
                            objectId = foundByName.id;
                            console.log(`Знайдено об'єкт "${command.objectId}" за назвою, використовується ID: ${objectId}`);
                        }
                    }
                }
                
                if (objectId) {
                    sceneManager.selectObject(objectId);
                } else {
                    console.warn(`Не вдалося знайти об'єкт для виділення: "${command.objectId}"`);
                }
            } else if (command.action === 'clear') {
                sceneManager.clearSelection();
            }
        } catch (error) {
            console.error('Помилка при виконанні команди агента:', error);
        }
    }, [sceneManager, handleUpdateObject]);

    const handleObjectMenuOpen = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
        setObjectMenuAnchor(event.currentTarget);
    }, []);

    const handleObjectMenuClose = React.useCallback(() => {
        setObjectMenuAnchor(null);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Box
            component="div"
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.default',
                overflow: 'hidden',
                ...(isMobile && {
                    width: '100vw',
                    height: '100vh',
                    maxWidth: '100vw',
                    maxHeight: '100vh',
                }),
            }}
            className={isMobile ? 'mobile-fullscreen-container' : ''}
            onContextMenu={contextMenu.showContextMenu}
        >
            <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ color: 'text.primary', mr: 2 }}>
                        3D Editor
                    </Typography>
                    <Button
                        color="inherit"
                        startIcon={<FolderIcon />}
                        onClick={handleFileMenuOpen}
                        sx={{ color: 'text.primary', mr: 1 }}
                    >
                        Файл
                    </Button>
                    <Button
                        color="inherit"
                        startIcon={<CategoryIcon />}
                        onClick={handleObjectMenuOpen}
                        sx={{ color: 'text.primary', mr: 1 }}
                    >
                        Об'єкт
                    </Button>
                    <ObjectSelectorMenu
                        anchorEl={objectMenuAnchor}
                        open={Boolean(objectMenuAnchor)}
                        onClose={handleObjectMenuClose}
                        onSelect={handleObjectSelect}
                    />
                    <Button
                        color="inherit"
                        startIcon={<HelpIcon />}
                        onClick={handleInstructionsClick}
                        sx={{ color: 'text.primary', mr: 1 }}
                    >
                        Інструкція
                    </Button>
                    <Menu
                        anchorEl={fileMenuAnchor}
                        open={Boolean(fileMenuAnchor)}
                        onClose={handleFileMenuClose}
                        PaperProps={{
                            sx: {
                                maxHeight: isMobile 
                                    ? 'calc(100vh - 100px)' 
                                    : 'calc(100vh - 200px)',
                                width: 'auto',
                                minWidth: 200,
                            },
                        }}
                    >
                        <MenuItem onClick={() => {
                            handleFileMenuClick('import');
                        }}>
                            Імпорт моделі
                        </MenuItem>
                        <MenuItem onClick={() => {
                            handleFileMenuClick('export');
                        }}>
                            Експорт моделі
                        </MenuItem>
                        <MenuItem onClick={() => {
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
                            handleFileMenuClose();
                        }}>
                            Зберегти
                        </MenuItem>
                        <MenuItem onClick={() => {
                            setWorkshopDialogOpen(true);
                            handleFileMenuClose();
                        }}>
                            Майстерня
                        </MenuItem>
                    </Menu>
                    <Box sx={{ flexGrow: 1 }} />
                    {isMobile && isSupported && (
                        <Tooltip title={isFullscreen ? 'Вийти з повноекранного режиму' : 'Увійти в повноекранний режим'}>
                            <IconButton
                                onClick={toggleFullscreen}
                                sx={{ color: 'text.primary', mr: 1 }}
                            >
                                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                            </IconButton>
                        </Tooltip>
                    )}
                    <Button
                        color="inherit"
                        startIcon={<SettingsIcon />}
                        onClick={handleSettingsClick}
                        sx={{ color: 'text.primary', mr: 1 }}
                    >
                        Налаштування
                    </Button>
                    <Button
                        color="inherit"
                        startIcon={<AIIcon />}
                        onClick={handleChatClick}
                        sx={{ color: 'text.primary' }}
                    >
                        AI
                    </Button>
                </Toolbar>
            </AppBar>

            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', minWidth: 0 }}>
                <LeftMenu 
                    isEditMode={sceneManager.isEditMode}
                    selectedObjectId={sceneManager.selectedObjectId}
                    onAddObject={() => setObjectSelectorDialogOpen(true)}
                    onToggleEditMode={sceneManager.toggleEditMode}
                    onSetTransformMode={sceneManager.setTransformMode}
                    onRemoveObject={sceneManager.removeObject}
                    onColorChange={handleColorChange}
                />

                <Box sx={{ flex: 1, position: 'relative', minWidth: 0, overflow: 'hidden' }}>
                    <ThreeScene
                        objects={sceneManager.objects}
                        selectObject={sceneManager.selectObject}
                        selectedObjectId={sceneManager.selectedObjectId}
                        clearSelection={sceneManager.clearSelection}
                        isEditMode={sceneManager.isEditMode}
                        transformMode={sceneManager.transformMode}
                        settings={settings}
                    />
                </Box>

                {/* Кнопка для перемикання правої панелі */}
                {isMobile && (
                    <IconButton
                        onClick={() => setIsRightMenuVisible(!isRightMenuVisible)}
                        sx={{
                            position: 'absolute',
                            right: isRightMenuVisible ? '40%' : 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 1001,
                            bgcolor: 'background.paper',
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: isRightMenuVisible ? '4px 0 0 4px' : '0 4px 4px 0',
                            width: 40,
                            height: 80,
                            boxShadow: 2,
                            '&:hover': {
                                bgcolor: 'action.hover',
                            },
                            transition: 'right 0.3s ease, border-radius 0.3s ease',
                        }}
                        title={isRightMenuVisible ? 'Приховати праву панель' : 'Показати праву панель'}
                    >
                        {isRightMenuVisible ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                )}

                <Box
                    sx={{
                        width: isRightMenuVisible ? (isMobile ? '40%' : 300) : 0,
                        overflow: 'hidden',
                        transition: 'width 0.3s ease',
                        flexShrink: 0,
                    }}
                >
                    {isRightMenuVisible && (
                        <RightMenu 
                            treeData={sceneTree.treeData}
                            onUpdateTree={sceneTree.updateTree}
                            selectedObjectId={sceneManager.selectedObjectId}
                            objects={sceneManager.objects}
                            onSelectObject={sceneManager.selectObject}
                            onUpdateObject={handleUpdateObject}
                        />
                    )}
                </Box>
            </Box>

            <ContextMenu
                isVisible={contextMenu.isVisible}
                position={contextMenu.position}
                items={createContextMenuItems(windowManager.openWindow, sceneManager)}
                onClose={contextMenu.hideContextMenu}
            />

            <FileDialog
                open={fileDialogOpen}
                operation={fileOperation}
                onClose={handleFileDialogClose}
                onConfirm={handleFileConfirm}
                objectsCount={sceneManager.objects.length}
            />

            <WorkshopDialog
                open={workshopDialogOpen}
                onClose={() => setWorkshopDialogOpen(false)}
                onLoadProject={handleLoadProject}
            />

            <ObjectSelectorDialog
                open={objectSelectorDialogOpen}
                onClose={() => setObjectSelectorDialogOpen(false)}
                onSelect={handleObjectSelect}
            />

            {windowManager.windows.map(window => {
                if (window.id === 'settings') {
                    return (
                        <Window
                            key={window.id}
                            id={window.id}
                            title="Налаштування"
                            isVisible={window.isVisible}
                            isMinimized={window.isMinimized}
                            isMaximized={window.isMaximized}
                            initialPosition={window.position}
                            initialSize={window.size}
                            minSize={{ width: 600, height: 400 }}
                            resizable={true}
                            draggable={true}
                            zIndex={window.zIndex}
                            onClose={() => windowManager.closeWindow(window.id)}
                            onMinimize={() => windowManager.minimizeWindow(window.id)}
                            onMaximize={() => windowManager.maximizeWindow(window.id)}
                            onRestore={() => windowManager.restoreWindow(window.id)}
                            onFocus={() => windowManager.focusWindow(window.id)}
                        >
                            <Settings onClose={() => windowManager.closeWindow('settings')} />
                        </Window>
                    );
                }
                if (window.id === 'chat') {
                    return (
                        <Window
                            key={window.id}
                            id={window.id}
                            title="AI Chat"
                            isVisible={window.isVisible}
                            isMinimized={window.isMinimized}
                            isMaximized={window.isMaximized}
                            initialPosition={window.position}
                            initialSize={window.size}
                            minSize={{ width: 300, height: 400 }}
                            resizable={true}
                            draggable={true}
                            zIndex={window.zIndex}
                            onClose={() => windowManager.closeWindow(window.id)}
                            onMinimize={() => windowManager.minimizeWindow(window.id)}
                            onMaximize={() => windowManager.maximizeWindow(window.id)}
                            onRestore={() => windowManager.restoreWindow(window.id)}
                            onFocus={() => windowManager.focusWindow(window.id)}
                        >
                            <Chat 
                              onClose={() => windowManager.closeWindow('chat')}
                              onAgentCommand={handleAgentCommand}
                              selectedObjectId={sceneManager.selectedObjectId}
                              objects={sceneManager.objects}
                            />
                        </Window>
                    );
                }
                if (window.id === 'instructions') {
                    return (
                        <Window
                            key={window.id}
                            id={window.id}
                            title="Інструкція"
                            isVisible={window.isVisible}
                            isMinimized={window.isMinimized}
                            isMaximized={window.isMaximized}
                            initialPosition={window.position}
                            initialSize={window.size}
                            minSize={{ width: 600, height: 400 }}
                            resizable={true}
                            draggable={true}
                            zIndex={window.zIndex}
                            onClose={() => windowManager.closeWindow(window.id)}
                            onMinimize={() => windowManager.minimizeWindow(window.id)}
                            onMaximize={() => windowManager.maximizeWindow(window.id)}
                            onRestore={() => windowManager.restoreWindow(window.id)}
                            onFocus={() => windowManager.focusWindow(window.id)}
                        >
                            <Instructions onClose={() => windowManager.closeWindow('instructions')} />
                        </Window>
                    );
                }
                return null;
            })}
        </Box>
    );
};

export default Editor;
