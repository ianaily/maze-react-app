import React from 'react';
import { useOutsideClick } from 'src/hooks/useOutsideClick';
import { Dropdown } from 'src/components/dropdown';
import { DropdownInputProps } from './types';
import { AcceptButton, Container, InlineInput, InputContainer } from './styled';

export const DropdownInput: React.FC<DropdownInputProps> = ({
  required,
  invalid,
  maxlength = 24,
  initialValue,
  onAccept,
  children,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const [isOpened, setOpened] = React.useState(false);
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const isInvalid = React.useMemo(() => {
    const isEmpty = required && !value.length;
    const tooLong = value.length > maxlength;

    return isEmpty || tooLong || invalid?.(value) || false;
  }, [required, invalid, value]);

  const handleClose = () => setOpened(false);

  const handleChange = ({ target }) => setValue(target.value);

  const handleAccept = () => {
    onAccept(value);
    setTimeout(handleClose);
  };

  useOutsideClick([ref], handleClose);

  return (
    <Container ref={triggerRef} onClick={() => setOpened(true)}>
      {children}
      <Dropdown isOpened={isOpened} onHide={handleClose} triggerRef={triggerRef} theme="dark">
        <InputContainer ref={ref}>
          <InlineInput
            type="text"
            maxLength={maxlength}
            value={value}
            onChange={handleChange}
            invalid={isInvalid}
          />
          <AcceptButton variant="green" onClick={handleAccept} disabled={isInvalid}>
            ✓
          </AcceptButton>
        </InputContainer>
      </Dropdown>
    </Container>
  );
};
