"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, CircularProgress } from '@mui/material';

const Editor = dynamic(
  () => import('@/components/UI/Layaout/EditField/Editor'),
  { 
    ssr: false,
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#1a1a1a' }}>
        <CircularProgress />
      </Box>
    )
  }
);

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ backgroundColor: '#1a1a1a', height: '100vh' }} />;
  }

  return <Editor />;
}