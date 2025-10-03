'use client';

import { useState, useCallback, useMemo } from 'react';

// Визначаємо типи для нашого дерева
export interface TreeNode {
  id: string;
  name: string;
  type: string;
  shape?: string | null;
  children?: TreeNode[];
}

function useSceneTree() {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  // Мемоізуємо updateTree функцію
  const updateTree = useCallback((newData: TreeNode[]) => {
    // Перевіряємо, чи дані дійсно змінилися
    if (JSON.stringify(newData) !== JSON.stringify(treeData)) {
      setTreeData(newData);
    }
  }, [treeData]); // Залежність від treeData потрібна для порівняння

  // Мемоізуємо значення, що повертаються
  const value = useMemo(() => ({
    treeData,
    updateTree,
  }), [treeData, updateTree]);

  return value;
}

export default useSceneTree;