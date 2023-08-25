export interface UploadInputProps {
  onImport: (content: string, name: string) => void;
  type: string;
  children: React.ReactNode;
}
