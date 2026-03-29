'use client';

import { useState, useCallback, useMemo } from 'react';
import { CollectionElementProps } from '@/components/UI/Collection/types'

function useSceneTree() {
  const [treeData, setTreeData] = useState<CollectionElementProps[]>([]);

  // Мемоізуємо updateTree функцію
  const updateTree = useCallback((newData: CollectionElementProps[]) => {
    setTreeData(prev => {
      // Перевіряємо, чи дані дійсно змінилися
      const prevString = JSON.stringify(prev);
      const newString = JSON.stringify(newData);
      if (prevString !== newString) {
        return newData;
      }
      return prev;
    });
  }, []);

  // Мемоізуємо значення, що повертаються
  const value = useMemo(() => ({
    treeData,
    updateTree,
  }), [treeData, updateTree]);

  return value;
}

export default useSceneTree;