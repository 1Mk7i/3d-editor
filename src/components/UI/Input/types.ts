export type InputType = 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url'
export type InputSize = 'small' | 'medium' | 'large'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: InputType;
  inputSize?: InputSize; // Renamed to avoid conflict
  className?: string;
  error?: boolean;
  icon?: 'left' | 'right';
}