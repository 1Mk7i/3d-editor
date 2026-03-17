'use client';

import { useState, useCallback } from 'react';
import * as THREE from 'three';

export type ClipboardType = 'object' | 'parameter';
export type ParameterSubType = 'color' | 'scale' | 'position' | 'rotation' | 'opacity' | 'material';

interface ClipboardContent {
  type: ClipboardType;
  subType?: ParameterSubType;
  data: any;
}

export function useClipboard() {
  const [content, setContent] = useState<ClipboardContent | null>(null);

  const copy = useCallback((data: any, type: ClipboardType, subType?: ParameterSubType) => {
    let dataToSave = data;

    if (data && typeof data.clone === 'function') {
      dataToSave = data.clone();
    }

    setContent({ type, subType, data: dataToSave });
  }, []);

  return {
    clipboard: content,
    copy,
    hasContent: !!content,
    clearClipboard: () => setContent(null)
  };
}