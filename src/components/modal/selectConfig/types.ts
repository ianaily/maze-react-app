import { Config } from 'src/types/config';

export interface SelectConfigModalProps {
  configs: Config[];
  onSelect: (config: Config) => void;
  onDelete: (config: Config) => void;
  onCancel: VoidFunction;
}
