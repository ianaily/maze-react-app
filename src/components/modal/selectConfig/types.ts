import { ConfigInfo } from 'src/types/config';

export interface SelectConfigModalProps {
  configs: ConfigInfo[];
  onSelect: (config: ConfigInfo) => void;
  onDelete: (config: ConfigInfo) => void;
  onCancel: VoidFunction;
}
