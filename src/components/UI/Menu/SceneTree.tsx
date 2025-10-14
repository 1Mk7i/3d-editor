'use client';

import { useState } from 'react';
import { CollectionElementProps } from '@/components/UI/Collection/types'

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

  const getIcon = (shape: string) => {
    switch (shape.toLowerCase()) {
      case 'boxgeometry': return '⬛';
      case 'spheregeometry': return '⚪';
      case 'cylindergeometry': return '🟤';
      case 'planegeometry': return '▭';
      case 'mesh': return '🔲';
      case 'group': return '📁';
      case 'light': return '💡';
      case 'camera': return '📷';
      default: return '❓';
    }
  };

  return (
    <div>
      <div
        style={{
          padding: '4px 8px',
          paddingLeft: `${level * 16 + 8}px`,
          cursor: 'pointer',
          backgroundColor: selectedObjectId === node.id ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
          borderRadius: '4px',
          margin: '2px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          userSelect: 'none'
        }}
        onClick={handleClick}
      >
        {hasChildren && (
          <span style={{ width: '12px', display: 'inline-block' }}>
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
        {!hasChildren && <span style={{ width: '12px', display: 'inline-block' }}>•</span>}
        <span>{getIcon(node.shape || node.type)}</span>
        <span>{node.shape || node.id}</span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedObjectId={selectedObjectId}
              onSelectObject={onSelectObject}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SceneTree: React.FC<SceneTreeProps> = ({ 
  treeData, 
  selectedObjectId, 
  onSelectObject 
}) => {
  return (
    <div style={{ 
      padding: '10px', 
      color: 'white', 
      fontSize: '12px', 
      height: '50%', 
      overflowY: 'auto',
      backgroundColor: '#2d2d2d',
      fontFamily: 'Arial, sans-serif'
    }}>
      
      {treeData.length === 0 ? (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          color: '#888',
          fontStyle: 'italic'
        }}>
          No objects in scene
        </div>
      ) : (
        treeData.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            level={0}
            selectedObjectId={selectedObjectId}
            onSelectObject={onSelectObject}
          />
        ))
      )}
    </div>
  );
};

export default SceneTree;