export interface DropdownInputProps {
  required: boolean;
  invalid?: (value: string) => boolean;
  maxlength?: number;
  initialValue: string;
  onAccept: (value: string) => void;
  children: React.ReactNode;
}
