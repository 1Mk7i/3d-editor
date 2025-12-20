'use client';

import { THREE_OBJECT_TYPES } from '@/shared/constants/threeObjects';

export type ChatMode = 'chat' | 'agent';

export interface AgentCommand {
  action: 'create' | 'delete' | 'update' | 'select' | 'clear';
  objectId?: string;
  objectType?: string;
  name?: string;
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
  color?: string; // hex color
  materialType?: 'standard' | 'wireframe' | 'points';
}

/**
 * Генерує системний промпт для агента
 */
export function generateAgentPrompt(): string {
  const objectTypesList = THREE_OBJECT_TYPES.map(obj => 
    `- ${obj.id}: ${obj.name}`
  ).join('\n');

  return `You are a 3D scene assistant. User sends commands to manipulate a 3D scene. Return ONLY valid JSON, no explanations.

Available object types:
${objectTypesList}

Available actions:
- create: Create new object. Requires objectType. Optional: name, position, rotation, scale, color, materialType
- delete: Delete object. Requires objectId
- update: Update object properties. Requires objectId. Optional: name, position, rotation, scale, color, materialType
- select: Select object. Requires objectId
- clear: Clear selection

Response format (single command):
{
  "action": "create|delete|update|select|clear",
  "objectId": "string (for delete/update/select)",
  "objectType": "string (for create: box|sphere|cylinder|cone|torus|torusKnot|octahedron|tetrahedron|icosahedron|dodecahedron|plane|ring|tube|lathe|capsule)",
  "name": "string (optional)",
  "position": {"x": number, "y": number, "z": number} (optional),
  "rotation": {"x": number, "y": number, "z": number} (optional, in radians),
  "scale": {"x": number, "y": number, "z": number} (optional),
  "color": "hex string like #FF0000" (optional),
  "materialType": "standard|wireframe|points" (optional)
}

Examples:
User: "Create a red cube"
{"action":"create","objectType":"box","color":"#FF0000"}

User: "Add a sphere at position 2, 0, 0"
{"action":"create","objectType":"sphere","position":{"x":2,"y":0,"z":0}}

User: "Rotate the selected object 90 degrees on X axis"
{"action":"update","objectId":"selected","rotation":{"x":1.5708,"y":0,"z":0}}

User: "Change color to blue"
{"action":"update","objectId":"selected","color":"#0000FF"}

User: "Delete the cube"
{"action":"delete","objectId":"cube-id"}

Important:
- Return ONLY JSON, no markdown, no code blocks
- Use radians for rotation (90° = 1.5708)
- Default position is {0,0,0} if not specified
- Default scale is {1,1,1} if not specified
- Color must be hex format (#RRGGBB)
- For update/delete/select, use "selected" as objectId if user refers to selected object`;
}

/**
 * Парсить JSON команду від агента
 */
export function parseAgentCommand(jsonString: string): AgentCommand | null {
  try {
    // Видаляємо markdown code blocks якщо є
    let cleaned = jsonString.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```\n?/g, '');
    }
    
    const command = JSON.parse(cleaned) as AgentCommand;
    
    // Валідація
    if (!command.action || !['create', 'delete', 'update', 'select', 'clear'].includes(command.action)) {
      return null;
    }
    
    return command;
  } catch (error) {
    console.error('Error parsing agent command:', error);
    return null;
  }
}

