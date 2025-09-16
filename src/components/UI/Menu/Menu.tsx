import React, { ReactNode, CSSProperties } from 'react';

type MenuProps = {
  style?: CSSProperties;
  title?: string;
  children?: ReactNode;
};

const defaultMenuSettings: CSSProperties = {
  position: 'absolute',
  zIndex: 1000,
  backgroundColor: 'black',
  padding: '10px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  width: '100%',
  height: 60,
};

const Menu: React.FC<MenuProps> = ({ style, title = "Top Menu", children }) => {
  return (
    <div style={{ ...defaultMenuSettings, ...style }}>
      <h1 style={{ color: 'white', margin: 0 }}>{title}</h1>
      {children}
    </div>
  );
};

export default Menu;