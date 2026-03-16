'use client';

import { useState } from 'react';
import { CollectionElementProps } from '@/components/UI/Collection/types';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Inventory2 as BoxGeometryIcon,
  Circle as CircleIcon,
  RadioButtonUnchecked as CylinderIcon,
  CropSquare as SquareIcon,
  Folder as FolderIcon,
  Lightbulb as LightIcon,
  CameraAlt as CameraIcon,
  HelpOutline as HelpIcon,
} from '@mui/icons-material';

interface SceneTreeProps {
  treeData: CollectionElementProps[];
  updateTree: (newData: CollectionElementProps[]) => void;
  selectedObjectId?: string | null;
  onSelectObject?: (id: string) => void;
}

const TreeNode: React.FC<{
  node: CollectionElementProps;
  level: number;
  selectedObjectId?: string | null;
  onSelectObject?: (id: string) => void;
}> = ({ node, level, selectedObjectId, onSelectObject }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
    if (onSelectObject) {
      onSelectObject(node.id);
    }
  };

  const getIcon = (shape: string | null | undefined, type: string | undefined) => {
    const shapeLower = (shape || type || '').toLowerCase();
    let fileName = 'help.svg';

    if (shapeLower.includes('box')) fileName = 'box.svg';
    if (shapeLower.includes('sphere')) fileName = 'sphere.svg';
    if (shapeLower.includes('cylinder')) fileName = 'cylinder.svg';
    if (shapeLower.includes('cone')) fileName = 'cone.svg';
    if (shapeLower.includes('plane')) fileName = 'plane.svg';
    if (shapeLower.includes('capsule')) fileName = 'capsule.svg';
    if (shapeLower.includes('dodecahedron')) fileName = 'dodecahedron.svg';
    if (shapeLower.includes('icosahedron')) fileName = 'icosahedron.svg';
    if (shapeLower.includes('lathe')) fileName = 'lathe.svg';
    if (shapeLower.includes('octahedron')) fileName = 'octahedron.svg';
    if (shapeLower.includes('ring')) fileName = 'ring.svg';
    if (shapeLower.includes('tetrahedron')) fileName = 'tetrahedron.svg';
    if (shapeLower.includes('torus')) fileName = 'torus.svg';
    if (shapeLower.includes('tube')) fileName = 'tube.svg';
    if (shapeLower.includes('torusknot')) fileName = 'torusKnot.svg';
    if (shapeLower.includes('group')) return <FolderIcon fontSize="small" />;
    if (shapeLower.includes('light')) return <LightIcon fontSize="small" />;
    if (shapeLower.includes('camera')) return <CameraIcon fontSize="small" />;

    return (
      <Box
        component="img"
        src={`/assets/shapes/${fileName}`}
        sx={{
          width: 20,
          height: 20,
          display: 'block',
          filter: (theme) => {
            const baseFilter = theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : '';
            // Додаємо невелику тінь того ж кольору, що й лінія, щоб вона здавалася товстішою
            return `${baseFilter} drop-shadow(0.5px 0px 0px white) drop-shadow(-0.5px 0px 0px white)`;
          },
        }}
        alt={shapeLower}
      />
    );
  };

  return (
    <>
      <ListItem
        disablePadding
        sx={{
          pl: level * 2,
          bgcolor: selectedObjectId === node.id ? 'action.selected' : 'transparent',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <ListItemButton onClick={handleClick} dense>
          <ListItemIcon sx={{ minWidth: 32 }}>
            {hasChildren ? (
              isExpanded ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />
            ) : (
              <Box sx={{ width: 20 }} />
            )}
          </ListItemIcon>
          <ListItemIcon sx={{ minWidth: 32 }}>
            {getIcon(node.shape, node.type)}
          </ListItemIcon>
          <ListItemText
            primary={node.name || 'Unnamed Object'}
            primaryTypographyProps={{
              variant: 'body2',
              sx: { fontSize: '0.875rem' },
            }}
          />
        </ListItemButton>
      </ListItem>
      {hasChildren && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {node.children!.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                level={level + 1}
                selectedObjectId={selectedObjectId}
                onSelectObject={onSelectObject}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

const SceneTree: React.FC<SceneTreeProps> = ({ 
  treeData, 
  selectedObjectId, 
  onSelectObject 
}) => {
  return (
    <Box
      sx={{
        p: 1,
        height: '100%',
        overflow: 'auto',
      }}
    >
      {treeData.length === 0 ? (
        <Box
          sx={{
            p: 3,
            textAlign: 'center',
            color: 'text.secondary',
          }}
        >
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            Немає об'єктів у сцені
          </Typography>
        </Box>
      ) : (
        <List dense>
          {treeData.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              level={0}
              selectedObjectId={selectedObjectId}
              onSelectObject={onSelectObject}
            />
          ))}
        </List>
      )}
    </Box>
  );
};

export default SceneTree;
