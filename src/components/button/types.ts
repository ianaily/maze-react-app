type Variants = 'green' | 'blue' | 'yellow' | 'red' | 'grey' | 'transparent';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: Variants;
  fullWidth?: boolean;
}
