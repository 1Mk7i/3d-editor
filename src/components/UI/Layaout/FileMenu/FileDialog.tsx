'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  TextField,
  Divider,
} from '@mui/material';
import { CollectionElementProps } from '@/components/UI/Collection/types';

export type FileOperation = 'import' | 'export';
// Формати, які підтримує Three.js
export type FileFormat = 'json' | 'gltf' | 'glb' | 'obj' | 'stl' | 'ply' | 'fbx' | 'dae' | '3mf' | 'amf';

interface FileDialogProps {
  open: boolean;
  operation: FileOperation;
  onClose: () => void;
  onConfirm: (format: FileFormat, fileName?: string) => void;
  objectsCount?: number;
}

export const FileDialog: React.FC<FileDialogProps> = ({
  open,
  operation,
  onClose,
  onConfirm,
  objectsCount = 0,
}) => {
  const [format, setFormat] = useState<FileFormat>('json');
  const [fileName, setFileName] = useState<string>('scene');

  const handleConfirm = () => {
    onConfirm(format, fileName);
    onClose();
  };

  const formatDescriptions: Record<FileFormat, string> = {
    json: 'JSON - Зберігає всі дані сцени (об\'єкти, позиції, кольори)',
    gltf: 'GLTF - Стандартний формат для 3D моделей (текстовий)',
    glb: 'GLB - Бінарний формат GLTF',
    obj: 'OBJ - Простий формат для 3D моделей',
    stl: 'STL - Формат для 3D друку',
    ply: 'PLY - Формат для зберігання 3D сканувань',
    fbx: 'FBX - Формат Autodesk для 3D моделей',
    dae: 'DAE - Collada формат для 3D моделей',
    '3mf': '3MF - Формат для 3D друку (Microsoft)',
    amf: 'AMF - Additive Manufacturing Format',
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {operation === 'import' ? 'Імпорт моделі' : 'Експорт моделі'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          {operation === 'export' && (
            <>
              <TextField
                label="Назва файлу"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                fullWidth
                helperText="Без розширення"
              />
              <Typography variant="body2" color="text.secondary">
                Кількість об'єктів для експорту: {objectsCount}
              </Typography>
              <Divider />
            </>
          )}

          <FormControl fullWidth>
            <InputLabel>Формат файлу</InputLabel>
            <Select
              value={format}
              label="Формат файлу"
              onChange={(e) => setFormat(e.target.value as FileFormat)}
            >
              <MenuItem value="json">JSON</MenuItem>
              <MenuItem value="gltf">GLTF</MenuItem>
              <MenuItem value="glb">GLB</MenuItem>
              <MenuItem value="obj">OBJ</MenuItem>
              <MenuItem value="stl">STL</MenuItem>
              <MenuItem value="ply">PLY</MenuItem>
              <MenuItem value="fbx">FBX</MenuItem>
              <MenuItem value="dae">DAE (Collada)</MenuItem>
              <MenuItem value="3mf">3MF</MenuItem>
              <MenuItem value="amf">AMF</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {formatDescriptions[format]}
            </Typography>
          </Box>

          {operation === 'import' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Формат файлу буде автоматично визначено за розширенням
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Скасувати</Button>
        <Button onClick={handleConfirm} variant="contained">
          {operation === 'import' ? 'Вибрати файл' : 'Експортувати'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

