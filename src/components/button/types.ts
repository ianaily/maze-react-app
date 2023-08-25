type Variants = 'green' | 'blue' | 'yellow' | 'red' | 'grey';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: Variants;
  fullWidth?: boolean;
}
