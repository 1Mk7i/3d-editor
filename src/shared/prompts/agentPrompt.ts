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
 * @param sceneInfo - JSON рядок з інформацією про поточну сцену
 */
export function generateAgentPrompt(sceneInfo?: string): string {
  const objectTypesList = THREE_OBJECT_TYPES.map(obj => 
    `- ${obj.id}: ${obj.name}`
  ).join('\n');

  const sceneContext = sceneInfo 
    ? `\n\nCurrent scene information:\n${sceneInfo}\n` 
    : '\n\nNote: You don\'t have information about current scene objects yet.\n';

  return `You are a 3D scene assistant. You can both execute commands to manipulate a 3D scene AND answer questions about the scene.

IMPORTANT: You have TWO response modes:
1. COMMAND MODE: When user asks to CREATE, DELETE, UPDATE, SELECT, or CLEAR - return ONLY valid JSON with action commands
2. INFORMATION MODE: When user asks QUESTIONS about the scene (e.g., "How many objects?", "What objects are on scene?", "Describe the scene") - return a TEXT response in Ukrainian, NO JSON${sceneContext}

Available object types:
${objectTypesList}

Available actions:
- create: Create new object. Requires objectType. Optional: name, position, rotation, scale, color, materialType
- delete: Delete object. Requires objectId (use the ID from current scene information, NOT the name)
- update: Update object properties. Requires objectId (use the ID from current scene information, NOT the name). Optional: name, position, rotation, scale, color, materialType
- select: Select object. Requires objectId (use the ID from current scene information, NOT the name)
- clear: Clear selection

CRITICAL: For delete/update/select commands, you MUST use the objectId field from the current scene information provided above. Each object has an ID like "uuid-string-here". Use that ID, not the object name!

Response format (single command or array of commands):
Single command:
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

Array of commands (for multiple operations):
[
  {"action":"create","objectType":"box","name":"Cube 1","position":{"x":0,"y":0,"z":0},"color":"#FF0000"},
  {"action":"create","objectType":"box","name":"Cube 2","position":{"x":2,"y":0,"z":0},"color":"#00FF00"},
  {"action":"create","objectType":"box","name":"Cube 3","position":{"x":4,"y":0,"z":0},"color":"#0000FF"}
]

Examples:
User: "Create a red cube"
{"action":"create","objectType":"box","color":"#FF0000"}

User: "Add a sphere at position 2, 0, 0"
{"action":"create","objectType":"sphere","position":{"x":2,"y":0,"z":0}}

User: "Create four cubes with different colors"
[
  {"action":"create","objectType":"box","name":"Red Cube","position":{"x":0,"y":0,"z":0},"color":"#FF0000"},
  {"action":"create","objectType":"box","name":"Green Cube","position":{"x":2,"y":0,"z":0},"color":"#00FF00"},
  {"action":"create","objectType":"box","name":"Blue Cube","position":{"x":4,"y":0,"z":0},"color":"#0000FF"},
  {"action":"create","objectType":"box","name":"Yellow Cube","position":{"x":6,"y":0,"z":0},"color":"#FFFF00"}
]

User: "Rotate the selected object 90 degrees on X axis"
{"action":"update","objectId":"selected","rotation":{"x":1.5708,"y":0,"z":0}}

User: "Change color to blue"
{"action":"update","objectId":"selected","color":"#0000FF"}

User: "Delete the cube"
{"action":"delete","objectId":"abc123-def456-..."} (use actual ID from scene info)

User: "Delete all blocks from the scene" or "Remove all boxes"
[
  {"action":"delete","objectId":"abc123-def456-..."},
  {"action":"delete","objectId":"xyz789-uvw012-..."},
  {"action":"delete","objectId":"mno345-pqr678-..."}
]
NOTE: Use actual object IDs from the current scene information, not placeholder IDs!

User: "Select the red cube"
{"action":"select","objectId":"abc123-def456-..."} (use actual ID from scene info)

User: "Create a house" or "Build a house"
[
  {"action":"create","objectType":"box","name":"House_Base","position":{"x":0,"y":-1.75,"z":0},"scale":{"x":4,"y":0.5,"z":4},"color":"#8B4513"},
  {"action":"create","objectType":"box","name":"House_Wall_Front","position":{"x":0,"y":0.75,"z":1.75},"scale":{"x":4,"y":3,"z":0.1},"color":"#FFFFFF"},
  {"action":"create","objectType":"box","name":"House_Wall_Back","position":{"x":0,"y":0.75,"z":-1.75},"scale":{"x":4,"y":3,"z":0.1},"color":"#FFFFFF"},
  {"action":"create","objectType":"box","name":"House_Wall_Left","position":{"x":-1.75,"y":0.75,"z":0},"scale":{"x":0.1,"y":3,"z":4},"color":"#FFFFFF"},
  {"action":"create","objectType":"box","name":"House_Wall_Right","position":{"x":1.75,"y":0.75,"z":0},"scale":{"x":0.1,"y":3,"z":4},"color":"#FFFFFF"},
  {"action":"create","objectType":"box","name":"House_Roof","position":{"x":0,"y":2.5,"z":0},"scale":{"x":4.5,"y":0.3,"z":4.5},"color":"#8B0000"}
]

Examples of questions (INFORMATION MODE - answer with text, not JSON):
User: "Скільки ти бачиш об'єктів на сцені?"
You: "На сцені я бачу 3 об'єкти: Cube 1 (box), Sphere 1 (sphere), та House_Base (box)."

User: "Які об'єкти є на сцені?"
You: "На сцені є такі об'єкти: червоний куб на позиції (0, 0, 0), зелена сфера на позиції (2, 0, 0), та синій циліндр на позиції (4, 0, 0)."

User: "Опиши сцену"
You: "На сцені знаходяться 5 об'єктів: основа будинку (box, коричневий), 4 стіни (box, білі), та дах (box, темно-червоний). Будинок розташований в центрі сцени."

Important for COMMAND MODE:
- Return ONLY JSON, no markdown, no code blocks
- Use radians for rotation (90° = 1.5708)
- Default position is {0,0,0} if not specified
- Default scale is {1,1,1} if not specified
- Color must be hex format (#RRGGBB)
- For update/delete/select, use "selected" as objectId ONLY if user explicitly refers to the currently selected object
- For delete/update/select commands, ALWAYS use the objectId from the current scene information provided above. Look for "ID: \"...\"" in the scene info.
- If you need to delete/update/select an object, first check the scene information to find its exact ID
- ALWAYS ensure the JSON response is complete and properly closed (all brackets and braces must be closed)
- If creating complex structures (like a house), break them into multiple create commands in an array
- DO NOT truncate the JSON response - ensure all commands are included and properly formatted
- DO NOT use object names as objectId - always use the actual ID from scene information!

Important for INFORMATION MODE:
- Answer in Ukrainian language
- Use the scene information provided to give accurate answers
- Be concise but informative
- If you don't have scene information, say so honestly`;
}

/**
 * Парсить JSON команду або масив команд від агента
 * @returns Масив команд (навіть якщо одна команда) або null
 */
export function parseAgentCommand(jsonString: string): AgentCommand[] | null {
  try {
    // Видаляємо markdown code blocks якщо є
    let cleaned = jsonString.trim();
    
    // Видаляємо markdown code blocks
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```[a-z]*\n?/g, '').replace(/```\n?/g, '');
    }
    
    // Видаляємо зайві пробіли та переноси рядків на початку та в кінці
    cleaned = cleaned.trim();
    
    // Перевіряємо, чи JSON завершений (чи є закриваючі дужки)
    const openBraces = (cleaned.match(/\{/g) || []).length;
    const closeBraces = (cleaned.match(/\}/g) || []).length;
    const openBrackets = (cleaned.match(/\[/g) || []).length;
    const closeBrackets = (cleaned.match(/\]/g) || []).length;
    
    // Якщо JSON неповний, спробуємо виправити або вивести попередження
    if (openBraces !== closeBraces || openBrackets !== closeBrackets) {
      console.warn('JSON appears to be incomplete:', {
        openBraces,
        closeBraces,
        openBrackets,
        closeBrackets,
        length: cleaned.length,
        lastChars: cleaned.slice(-100)
      });
      
      // Спробуємо додати відсутні закриваючі дужки
      const missingBraces = openBraces - closeBraces;
      const missingBrackets = openBrackets - closeBrackets;
      
      if (missingBraces > 0 || missingBrackets > 0) {
        cleaned += '}'.repeat(missingBraces) + ']'.repeat(missingBrackets);
        console.log('Attempted to fix incomplete JSON by adding closing brackets');
      }
    }
    
    // Спробуємо знайти JSON об'єкт або масив у тексті
    // Шукаємо перший символ { або [
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');
    
    let jsonStart = -1;
    let jsonEnd = -1;
    
    if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
      // Знайшли масив
      jsonStart = firstBracket;
      // Знаходимо закриваючу дужку
      let bracketCount = 0;
      for (let i = firstBracket; i < cleaned.length; i++) {
        if (cleaned[i] === '[') bracketCount++;
        if (cleaned[i] === ']') bracketCount--;
        if (bracketCount === 0) {
          jsonEnd = i + 1;
          break;
        }
      }
      // Якщо не знайшли закриваючу дужку, використовуємо весь рядок від початку масиву
      if (jsonEnd === -1) {
        jsonEnd = cleaned.length;
      }
    } else if (firstBrace !== -1) {
      // Знайшли об'єкт
      jsonStart = firstBrace;
      // Знаходимо закриваючу фігурну дужку
      let braceCount = 0;
      for (let i = firstBrace; i < cleaned.length; i++) {
        if (cleaned[i] === '{') braceCount++;
        if (cleaned[i] === '}') braceCount--;
        if (braceCount === 0) {
          jsonEnd = i + 1;
          break;
        }
      }
      // Якщо не знайшли закриваючу дужку, використовуємо весь рядок від початку об'єкта
      if (jsonEnd === -1) {
        jsonEnd = cleaned.length;
      }
    }
    
    // Якщо знайшли JSON, витягуємо його
    if (jsonStart !== -1 && jsonEnd !== -1) {
      cleaned = cleaned.substring(jsonStart, jsonEnd);
    }
    
    // Видаляємо зайві символи після останньої закриваючої дужки
    cleaned = cleaned.trim();
    
    // Пробуємо парсити JSON
    const parsed = JSON.parse(cleaned);
    
    // Перевіряємо, чи це масив команд
    if (Array.isArray(parsed)) {
      const commands: AgentCommand[] = [];
      for (const item of parsed) {
        if (item && typeof item === 'object' && item.action) {
          if (['create', 'delete', 'update', 'select', 'clear'].includes(item.action)) {
            commands.push(item as AgentCommand);
          }
        }
      }
      return commands.length > 0 ? commands : null;
    }
    
    // Якщо це одна команда
    if (parsed && typeof parsed === 'object' && parsed.action) {
      const command = parsed as AgentCommand;
      
      // Валідація
      if (['create', 'delete', 'update', 'select', 'clear'].includes(command.action)) {
        // Повертаємо як масив з однією командою
        return [command];
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing agent command:', error);
    console.error('JSON string length:', jsonString.length);
    console.error('JSON string (first 500 chars):', jsonString.substring(0, 500));
    console.error('JSON string (last 500 chars):', jsonString.substring(Math.max(0, jsonString.length - 500)));
    
    // Перевіряємо, чи це може бути обрізана відповідь
    if (jsonString.includes('"action"') && !jsonString.trim().endsWith(']') && !jsonString.trim().endsWith('}')) {
      console.warn('JSON response appears to be truncated!');
      console.warn('This might be due to maxOutputTokens limit in the API');
    }
    
    // Спробуємо витягти JSON з тексту, використовуючи регулярний вираз
    try {
      // Шукаємо масив або об'єкт, навіть якщо вони неповні
      const jsonMatch = jsonString.match(/(\[[\s\S]*?\]|\{[\s\S]*?\})/);
      if (jsonMatch && jsonMatch[1]) {
        let jsonText = jsonMatch[1];
        
        // Спробуємо виправити неповний JSON
        const openBraces = (jsonText.match(/\{/g) || []).length;
        const closeBraces = (jsonText.match(/\}/g) || []).length;
        const openBrackets = (jsonText.match(/\[/g) || []).length;
        const closeBrackets = (jsonText.match(/\]/g) || []).length;
        
        if (openBraces > closeBraces) {
          jsonText += '}'.repeat(openBraces - closeBraces);
        }
        if (openBrackets > closeBrackets) {
          jsonText += ']'.repeat(openBrackets - closeBrackets);
        }
        
        const parsed = JSON.parse(jsonText);
        
        if (Array.isArray(parsed)) {
          const commands: AgentCommand[] = [];
          for (const item of parsed) {
            if (item && typeof item === 'object' && item.action) {
              if (['create', 'delete', 'update', 'select', 'clear'].includes(item.action)) {
                commands.push(item as AgentCommand);
              }
            }
          }
          return commands.length > 0 ? commands : null;
        }
        
        if (parsed && typeof parsed === 'object' && parsed.action) {
          const command = parsed as AgentCommand;
          if (['create', 'delete', 'update', 'select', 'clear'].includes(command.action)) {
            return [command];
          }
        }
      }
    } catch (fallbackError) {
      console.error('Fallback parsing also failed:', fallbackError);
    }
    
    return null;
  }
}

