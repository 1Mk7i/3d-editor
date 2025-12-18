'use client';

import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import {
  Box,
  Typography,
  TextField,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
} from '@mui/icons-material';

interface ObjectPropertiesProps {
  selectedObject: THREE.Object3D | null;
  onUpdateObject: (updates: {
    name?: string;
    position?: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
    color?: number;
    materialType?: 'standard' | 'wireframe' | 'points';
  }) => void;
}

export const ObjectProperties: React.FC<ObjectPropertiesProps> = ({
  selectedObject,
  onUpdateObject,
}) => {
  const [name, setName] = useState('');
  const [tempName, setTempName] = useState('');
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [color, setColor] = useState('#ff0000');
  const [materialType, setMaterialType] = useState<'standard' | 'wireframe' | 'points'>('standard');
  const [wireframe, setWireframe] = useState(false);

  useEffect(() => {
    if (selectedObject) {
      setName(selectedObject.name || 'Unnamed Object');
      setPosition({
        x: selectedObject.position.x,
        y: selectedObject.position.y,
        z: selectedObject.position.z,
      });
      setRotation({
        x: (selectedObject.rotation.x * 180) / Math.PI,
        y: (selectedObject.rotation.y * 180) / Math.PI,
        z: (selectedObject.rotation.z * 180) / Math.PI,
      });

      const mesh = selectedObject as THREE.Mesh;
      if (mesh.material) {
        if (mesh.material instanceof THREE.PointsMaterial) {
          setMaterialType('points');
          if (mesh.material.color) {
            setColor('#' + mesh.material.color.getHexString());
          }
        } else {
          const material = mesh.material as THREE.MeshStandardMaterial;
          if (material.color) {
            setColor('#' + material.color.getHexString());
          }
          if (material.wireframe !== undefined) {
            setWireframe(material.wireframe);
            setMaterialType(material.wireframe ? 'wireframe' : 'standard');
          }
        }
      }
    }
  }, [selectedObject]);

  // Синхронізація зміни позиції та обертання в реальному часі
  useEffect(() => {
    if (!selectedObject) return;

    const updateFromObject = () => {
      setPosition({
        x: selectedObject.position.x,
        y: selectedObject.position.y,
        z: selectedObject.position.z,
      });
      setRotation({
        x: (selectedObject.rotation.x * 180) / Math.PI,
        y: (selectedObject.rotation.y * 180) / Math.PI,
        z: (selectedObject.rotation.z * 180) / Math.PI,
      });
    };

    const interval = setInterval(updateFromObject, 100);
    return () => clearInterval(interval);
  }, [selectedObject]);

  const handleOpenNameDialog = () => {
    setTempName(name);
    setIsNameDialogOpen(true);
  };

  const handleCloseNameDialog = () => {
    setIsNameDialogOpen(false);
    setTempName(name);
  };

  const handleConfirmNameChange = () => {
    setName(tempName);
    onUpdateObject({ name: tempName });
    setIsNameDialogOpen(false);
  };

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    const newPosition = { ...position, [axis]: value };
    setPosition(newPosition);
    onUpdateObject({ position: newPosition });
  };

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: number) => {
    const newRotation = { ...rotation, [axis]: value };
    setRotation(newRotation);
    onUpdateObject({
      rotation: {
        x: (newRotation.x * Math.PI) / 180,
        y: (newRotation.y * Math.PI) / 180,
        z: (newRotation.z * Math.PI) / 180,
      },
    });
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    const hexColor = parseInt(newColor.replace('#', ''), 16);
    onUpdateObject({ color: hexColor });
  };

  const handleMaterialTypeChange = (type: 'standard' | 'wireframe' | 'points') => {
    setMaterialType(type);
    onUpdateObject({ materialType: type });
  };

  const handleWireframeChange = (checked: boolean) => {
    setWireframe(checked);
    if (selectedObject) {
      const mesh = selectedObject as THREE.Mesh;
      if (mesh.material) {
        const material = mesh.material as THREE.MeshStandardMaterial;
        material.wireframe = checked;
      }
    }
  };

  if (!selectedObject) {
    return (
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'text.secondary',
        }}
      >
        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
          Оберіть об'єкт для редагування
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, overflow: 'auto', height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
        Параметри об'єкта
      </Typography>

      {/* Назва */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 60 }}>
          Назва:
        </Typography>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body1" sx={{ flex: 1, color: 'text.primary' }}>
            {name || 'Unnamed Object'}
          </Typography>
          <IconButton
            size="small"
            onClick={handleOpenNameDialog}
            sx={{
              color: 'primary.main',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Діалог для зміни імені */}
      <Dialog
        open={isNameDialogOpen}
        onClose={handleCloseNameDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Змінити назву об'єкта</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Назва"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            margin="dense"
            sx={{ mt: 1 }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleConfirmNameChange();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNameDialog} color="inherit">
            Скасувати
          </Button>
          <Button onClick={handleConfirmNameChange} variant="contained" color="primary">
            Підтвердити
          </Button>
        </DialogActions>
      </Dialog>

      <Divider sx={{ my: 2 }} />

      {/* Позиція */}
      <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
        Позиція
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          label="X"
          type="number"
          value={position.x.toFixed(2)}
          onChange={(e) => handlePositionChange('x', parseFloat(e.target.value) || 0)}
          size="small"
          sx={{ flex: 1 }}
        />
        <TextField
          label="Y"
          type="number"
          value={position.y.toFixed(2)}
          onChange={(e) => handlePositionChange('y', parseFloat(e.target.value) || 0)}
          size="small"
          sx={{ flex: 1 }}
        />
        <TextField
          label="Z"
          type="number"
          value={position.z.toFixed(2)}
          onChange={(e) => handlePositionChange('z', parseFloat(e.target.value) || 0)}
          size="small"
          sx={{ flex: 1 }}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Обертання */}
      <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
        Обертання (градуси)
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          label="X"
          type="number"
          value={rotation.x.toFixed(2)}
          onChange={(e) => handleRotationChange('x', parseFloat(e.target.value) || 0)}
          size="small"
          sx={{ flex: 1 }}
        />
        <TextField
          label="Y"
          type="number"
          value={rotation.y.toFixed(2)}
          onChange={(e) => handleRotationChange('y', parseFloat(e.target.value) || 0)}
          size="small"
          sx={{ flex: 1 }}
        />
        <TextField
          label="Z"
          type="number"
          value={rotation.z.toFixed(2)}
          onChange={(e) => handleRotationChange('z', parseFloat(e.target.value) || 0)}
          size="small"
          sx={{ flex: 1 }}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Колір */}
      <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
        Колір
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          type="color"
          value={color}
          onChange={(e) => handleColorChange(e.target.value)}
          size="small"
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          label="Hex"
          value={color}
          onChange={(e) => handleColorChange(e.target.value)}
          size="small"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Матеріал */}
      <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
        Візуалізація
      </Typography>
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Тип матеріалу</InputLabel>
        <Select
          value={materialType}
          label="Тип матеріалу"
          onChange={(e) => handleMaterialTypeChange(e.target.value as 'standard' | 'wireframe' | 'points')}
        >
          <MenuItem value="standard">Стандартний</MenuItem>
          <MenuItem value="wireframe">Каркас</MenuItem>
          <MenuItem value="points">Точки</MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Switch
            checked={wireframe}
            onChange={(e) => handleWireframeChange(e.target.checked)}
          />
        }
        label="Показати ребра"
        sx={{ mb: 2 }}
      />
    </Box>
  );
};

