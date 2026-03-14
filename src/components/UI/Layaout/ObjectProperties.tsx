'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
    scale?: { x: number; y: number; z: number };
    color?: number;
    materialType?: 'standard' | 'wireframe' | 'points';
  }) => void;
}

// Тип для проміжних рядкових значень полів вводу
type Vec3String = { x: string; y: string; z: string };

const vec3ToStr = (v: { x: number; y: number; z: number }, decimals = 2): Vec3String => ({
  x: v.x.toFixed(decimals),
  y: v.y.toFixed(decimals),
  z: v.z.toFixed(decimals),
});

export const ObjectProperties: React.FC<ObjectPropertiesProps> = ({
  selectedObject,
  onUpdateObject,
}) => {
  const [name, setName] = useState('');
  const [tempName, setTempName] = useState('');
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);

  // Рядкові стейти для полів — щоб не псувати курсор і дозволяти вводити "-"
  const [posStr, setPosStr] = useState<Vec3String>({ x: '0', y: '0', z: '0' });
  const [scaleStr, setScaleStr] = useState<Vec3String>({ x: '1', y: '1', z: '1' });
  const [rotStr, setRotStr] = useState<Vec3String>({ x: '0', y: '0', z: '0' });

  const [color, setColor] = useState('#ff0000');
  const [materialType, setMaterialType] = useState<'standard' | 'wireframe' | 'points'>('standard');
  const [wireframe, setWireframe] = useState(false);

  // Лічильник активних фокусів на числових полях — interval зупиняється поки юзер вводить
  const focusCountRef = useRef(0);

  // Читаємо стан з об'єкта при зміні selectedObject
  useEffect(() => {
    if (!selectedObject) return;

    setName(selectedObject.name || 'Unnamed Object');
    setPosStr(vec3ToStr(selectedObject.position));
    setScaleStr(vec3ToStr(selectedObject.scale, 3));
    setRotStr(vec3ToStr({
      x: (selectedObject.rotation.x * 180) / Math.PI,
      y: (selectedObject.rotation.y * 180) / Math.PI,
      z: (selectedObject.rotation.z * 180) / Math.PI,
    }));

    const mesh = selectedObject as THREE.Mesh;
    if (mesh.material) {
      if (mesh.material instanceof THREE.PointsMaterial) {
        setMaterialType('points');
        if (mesh.material.color) setColor('#' + mesh.material.color.getHexString());
      } else {
        const material = mesh.material as THREE.MeshStandardMaterial;
        if (material.color) setColor('#' + material.color.getHexString());
        if (material.wireframe !== undefined) {
          setWireframe(material.wireframe);
          setMaterialType(material.wireframe ? 'wireframe' : 'standard');
        }
      }
    }
  }, [selectedObject]);

  // Синхронізація з Three.js у реальному часі (тільки коли немає активного вводу)
  useEffect(() => {
    if (!selectedObject) return;

    const updateFromObject = () => {
      // Не перезаписуємо поля поки юзер щось вводить
      if (focusCountRef.current > 0) return;

      const newPosStr = vec3ToStr(selectedObject.position);
      const newScaleStr = vec3ToStr(selectedObject.scale, 3);
      const newRotStr = vec3ToStr({
        x: (selectedObject.rotation.x * 180) / Math.PI,
        y: (selectedObject.rotation.y * 180) / Math.PI,
        z: (selectedObject.rotation.z * 180) / Math.PI,
      });

      // Оновлюємо тільки якщо значення реально змінились (щоб не дергати ре-рендери)
      setPosStr(prev =>
        prev.x !== newPosStr.x || prev.y !== newPosStr.y || prev.z !== newPosStr.z ? newPosStr : prev
      );
      setScaleStr(prev =>
        prev.x !== newScaleStr.x || prev.y !== newScaleStr.y || prev.z !== newScaleStr.z ? newScaleStr : prev
      );
      setRotStr(prev =>
        prev.x !== newRotStr.x || prev.y !== newRotStr.y || prev.z !== newRotStr.z ? newRotStr : prev
      );
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

  // Безпечний парсинг: ігноруємо NaN (дозволяємо вводити "-", ".", "" без скидання)
  const safeParseFloat = (val: string): number | null => {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? null : parsed;
  };

  const handlePositionChange = (axis: 'x' | 'y' | 'z', strVal: string) => {
    setPosStr(prev => ({ ...prev, [axis]: strVal }));
    const val = safeParseFloat(strVal);
    if (val !== null) {
      const current = {
        x: safeParseFloat(posStr.x) ?? 0,
        y: safeParseFloat(posStr.y) ?? 0,
        z: safeParseFloat(posStr.z) ?? 0,
      };
      onUpdateObject({ position: { ...current, [axis]: val } });
    }
  };

  const handleScaleChange = (axis: 'x' | 'y' | 'z', strVal: string) => {
    setScaleStr(prev => ({ ...prev, [axis]: strVal }));
    const val = safeParseFloat(strVal);
    if (val !== null && val !== 0) {
      const current = {
        x: safeParseFloat(scaleStr.x) ?? 1,
        y: safeParseFloat(scaleStr.y) ?? 1,
        z: safeParseFloat(scaleStr.z) ?? 1,
      };
      onUpdateObject({ scale: { ...current, [axis]: val } });
    }
  };

  const handleRotationChange = (axis: 'x' | 'y' | 'z', strVal: string) => {
    setRotStr(prev => ({ ...prev, [axis]: strVal }));
    const val = safeParseFloat(strVal);
    if (val !== null) {
      const current = {
        x: safeParseFloat(rotStr.x) ?? 0,
        y: safeParseFloat(rotStr.y) ?? 0,
        z: safeParseFloat(rotStr.z) ?? 0,
      };
      const newRot = { ...current, [axis]: val };
      onUpdateObject({
        rotation: {
          x: (newRot.x * Math.PI) / 180,
          y: (newRot.y * Math.PI) / 180,
          z: (newRot.z * Math.PI) / 180,
        },
      });
    }
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    const hexColor = parseInt(newColor.replace('#', ''), 16);
    onUpdateObject({ color: hexColor });
  };

  const handleMaterialTypeChange = (type: 'standard' | 'wireframe' | 'points') => {
    setMaterialType(type);
    // Якщо перемикаємо через Select — синхронізуємо wireframe стейт
    if (type === 'wireframe') setWireframe(true);
    else if (type === 'standard') setWireframe(false);
    onUpdateObject({ materialType: type });
  };

  // Wireframe через onUpdateObject — більше не мутує матеріал напряму
  const handleWireframeChange = (checked: boolean) => {
    setWireframe(checked);
    const newType = checked ? 'wireframe' : 'standard';
    setMaterialType(newType);
    onUpdateObject({ materialType: newType });
  };

  const focusProps = {
    onFocus: () => { focusCountRef.current += 1; },
    onBlur: () => { focusCountRef.current = Math.max(0, focusCountRef.current - 1); },
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleConfirmNameChange();
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
        {(['x', 'y', 'z'] as const).map(axis => (
          <TextField
            key={axis}
            label={axis.toUpperCase()}
            type="number"
            value={posStr[axis]}
            onChange={(e) => handlePositionChange(axis, e.target.value)}
            size="small"
            sx={{ flex: 1 }}
            inputProps={{ step: 0.1 }}
            {...focusProps}
          />
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Масштаб */}
      <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
        Масштаб
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {(['x', 'y', 'z'] as const).map(axis => (
          <TextField
            key={axis}
            label={axis.toUpperCase()}
            type="number"
            value={scaleStr[axis]}
            onChange={(e) => handleScaleChange(axis, e.target.value)}
            size="small"
            sx={{ flex: 1 }}
            inputProps={{ step: 0.1 }}
            {...focusProps}
          />
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Обертання */}
      <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
        Обертання (градуси)
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {(['x', 'y', 'z'] as const).map(axis => (
          <TextField
            key={axis}
            label={axis.toUpperCase()}
            type="number"
            value={rotStr[axis]}
            onChange={(e) => handleRotationChange(axis, e.target.value)}
            size="small"
            sx={{ flex: 1 }}
            inputProps={{ step: 1 }}
            {...focusProps}
          />
        ))}
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
