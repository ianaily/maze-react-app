import React from 'react';
import { toast } from 'react-toastify';
import { readFile } from 'src/utils/ioFiles';
import { UploadInputProps } from './types';
import { FileInput, ImportWrap } from './styled';

export const UploadInput: React.FC<UploadInputProps> = ({
  onImport,
  type,
  children,
  fullWidth = false,
}) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const content = await readFile(file);
      onImport(content, file.name || '');
    } catch (error) {
      toast.error(`Error reading file: ${error}`);
    }
  };

  return (
    <ImportWrap fullWidth={fullWidth} onClick={() => inputRef.current?.click()}>
      <FileInput ref={inputRef} type="file" accept={type} onChange={handleImport} />
      {children}
    </ImportWrap>
  );
};
