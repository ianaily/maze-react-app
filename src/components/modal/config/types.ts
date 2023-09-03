import { Config } from 'src/types/config';

export interface ConfigModalProps {
  onSave: (config: Config) => void;
  onCancel: VoidFunction;
}
