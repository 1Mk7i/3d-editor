'use client';

import React from 'react';
import { Menu } from '@/components/UI/Menu/Menu';
import SceneTree from '@/components/UI/Menu/SceneTree';

interface RightMenuProps {
    treeData: any;
    onUpdateTree: (data: any) => void;
}

export const RightMenu: React.FC<RightMenuProps> = ({
    treeData,
    onUpdateTree
}) => {
    return (
        <Menu
            position='right'
            variant='secondary'
            title="Scene Tree"
        >
            <SceneTree treeData={treeData} updateTree={onUpdateTree}/>
        </Menu>
    );
};