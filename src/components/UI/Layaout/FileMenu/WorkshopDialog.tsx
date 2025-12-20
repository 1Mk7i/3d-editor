'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Box,
  Typography,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  OpenInNew as OpenIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { Project, getAllProjects, deleteProject, renameProject, loadProject } from '@/shared/services/projectService';
import { importFromJSON, createObjectFromData } from '@/shared/services/fileService';

interface WorkshopDialogProps {
  open: boolean;
  onClose: () => void;
  onLoadProject: (objects: any[]) => void;
}

export const WorkshopDialog: React.FC<WorkshopDialogProps> = ({
  open,
  onClose,
  onLoadProject,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      loadProjects();
    }
  }, [open]);

  const loadProjects = () => {
    const allProjects = getAllProjects();
    setProjects(allProjects);
  };

  const handleOpenProject = (projectId: string) => {
    const project = loadProject(projectId);
    if (project) {
      try {
        const objectsData = importFromJSON(project.data);
        const objects = objectsData.map(objData => createObjectFromData(objData));
        onLoadProject(objects);
        onClose();
      } catch (error) {
        console.error('Помилка при завантаженні проекту:', error);
        alert('Помилка при завантаженні проекту');
      }
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Ви впевнені, що хочете видалити цей проект?')) {
      if (deleteProject(projectId)) {
        loadProjects();
      }
    }
    handleCloseMenu();
  };

  const handleStartEdit = (project: Project) => {
    setEditingId(project.id);
    setEditName(project.name);
    handleCloseMenu();
  };

  const handleSaveEdit = (projectId: string) => {
    if (editName.trim()) {
      if (renameProject(projectId, editName.trim())) {
        loadProjects();
        setEditingId(null);
        setEditName('');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, projectId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedProjectId(projectId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedProjectId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('uk-UA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Майстерня проектів</DialogTitle>
        <DialogContent>
          {projects.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Немає збережених проектів
              </Typography>
            </Box>
          ) : (
            <List>
              {projects.map((project, index) => (
                <React.Fragment key={project.id}>
                  {index > 0 && <Divider />}
                  <ListItem>
                    {editingId === project.id ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                        <TextField
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          size="small"
                          fullWidth
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveEdit(project.id);
                            } else if (e.key === 'Escape') {
                              handleCancelEdit();
                            }
                          }}
                        />
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleSaveEdit(project.id)}
                        >
                          Зберегти
                        </Button>
                        <Button
                          size="small"
                          onClick={handleCancelEdit}
                        >
                          Скасувати
                        </Button>
                      </Box>
                    ) : (
                      <>
                        <ListItemText
                          primary={project.name}
                          secondary={
                            <>
                              <Typography variant="caption" display="block">
                                Створено: {formatDate(project.createdAt)}
                              </Typography>
                              <Typography variant="caption" display="block">
                                Оновлено: {formatDate(project.updatedAt)}
                              </Typography>
                              <Typography variant="caption" display="block">
                                Відкрито: {formatDate(project.lastOpenedAt)}
                              </Typography>
                            </>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleOpenProject(project.id)}
                            sx={{ mr: 1 }}
                          >
                            <OpenIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            onClick={(e) => handleMenuOpen(e, project.id)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </>
                    )}
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Закрити</Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => selectedProjectId && handleStartEdit(projects.find(p => p.id === selectedProjectId)!)}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Перейменувати
        </MenuItem>
        <MenuItem onClick={() => selectedProjectId && handleDeleteProject(selectedProjectId)}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Видалити
        </MenuItem>
      </Menu>
    </>
  );
};

