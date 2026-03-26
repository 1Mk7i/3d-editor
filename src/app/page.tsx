"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/UI/Layaout/EditField'), { 
  ssr: false,
  loading: () => <div>Завантаження 3D сцени...</div>
});

const Home: React.FC = () => {
  return <Editor />;
};

export default Home;
