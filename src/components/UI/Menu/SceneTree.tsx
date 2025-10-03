'use client';

interface SceneTreeProps {
  treeData: any[];
  updateTree: (newData: any[]) => void;
}

const SceneTree: React.FC<SceneTreeProps> = ({ treeData, updateTree }) => {

  return (
    <div style={{ padding: '10px', color: 'white', fontSize: '12px', overflowY: 'auto', height: '50%', overflow: 'scroll' }}>
      <pre>{JSON.stringify(treeData, null, 2)}</pre>
    </div>
  );
};

export default SceneTree;
