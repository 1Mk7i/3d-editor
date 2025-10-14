/**
 * Константи для роботи зі сценою та 3D об'єктами
 */

export const SCENE_CONSTANTS = {
  // Позиціонування вікон
  DEFAULT_POSITION: { x: 100, y: 100 },
  POSITION_OFFSET: 30,
  
  // Розміри вікон
  DEFAULT_WINDOW_SIZE: { width: 600, height: 400 },
  MIN_WINDOW_SIZE: { width: 300, height: 200 },
  
  // Viewport та UI
  MIN_VIEWPORT_MARGIN: 10,
  DRAG_THRESHOLD: 5,
  SUBMENU_HOVER_DELAY: 200,
  
  // Режими трансформації
  TRANSFORM_MODES: ['translate', 'rotate', 'scale'] as const,
  
  // Z-index для UI елементів
  Z_INDEX: {
    CONTEXT_MENU: 9999,
    WINDOW_BASE: 1000,
    SUBMENU: 10000,
  },
  
  // Розміри підменю
  SUBMENU: {
    WIDTH: 250,
    MAX_HEIGHT: 400,
    ITEM_HEIGHT: 45,
    VISUAL_GAP: 2,
  },
} as const;

export const MATERIAL_COLORS = {
  // Кольори об'єктів за замовчуванням
  CUBE: 0x00ff00,
  SPHERE: 0xff0000,
  CYLINDER: 0x0000ff,
  TORUS: 0xffff00,
  
  // Кольори стану
  SELECTED: 0x444400,
  UNSELECTED: 0x000000,
  
  // Кольори освітлення
  AMBIENT_LIGHT: 0.5,
  DIRECTIONAL_LIGHT: 0.8,
} as const;

export const GEOMETRY_DEFAULTS = {
  CUBE: {
    width: 1,
    height: 1,
    depth: 1,
  },
  SPHERE: {
    radius: 0.5,
    widthSegments: 32,
    heightSegments: 32,
  },
  CYLINDER: {
    radiusTop: 0.5,
    radiusBottom: 0.5,
    height: 1,
    radialSegments: 32,
  },
  TORUS: {
    radius: 0.5,
    tube: 0.2,
    radialSegments: 16,
    tubularSegments: 100,
  },
} as const;

export const GRID_HELPER_CONFIG = {
  size: 20,
  divisions: 20,
  colorCenterLine: 'gray',
  colorGrid: 'lightgray',
} as const;
