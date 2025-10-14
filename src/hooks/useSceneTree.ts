'use client';

import { useState, useCallback, useMemo } from 'react';
import { CollectionElementProps } from '@/components/UI/Collection/types'

function useSceneTree() {
  const [treeData, setTreeData] = useState<CollectionElementProps[]>([]);

  // Мемоізуємо updateTree функцію
  const updateTree = useCallback((newData: CollectionElementProps[]) => {
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