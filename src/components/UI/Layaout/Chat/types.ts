export interface ChatProps {
  onClose?: () => void;
}

export interface ChatData {
  messages: { id: number; text: string; sender: 'user' | 'bot' }[];
  inputText: string;
}