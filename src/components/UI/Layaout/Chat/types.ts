/**
 * Типи для компонента Chat
 * Основні типи визначені в shared/types/chat.types.ts
 */

import { ChatProps } from '@/shared/types/chat.types';
import { AgentCommand } from '@/shared/prompts/agentPrompt';
import { CollectionElementProps } from '@/components/UI/Collection/types';

export interface ChatPropsWithSceneManager {
  onClose?: () => void;
  onAgentCommand?: (command: AgentCommand) => void;
  selectedObjectId?: string | null;
  objects?: CollectionElementProps[];
}