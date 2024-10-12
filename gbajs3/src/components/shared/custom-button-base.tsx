import styled from '@emotion/styled';
import React, { type ReactNode } from 'react';

type ButtonBaseProps = {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  id?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const StyledButton = styled.button`
  font-size: inherit;
  font-family: inherit;
  line-height: inherit;
  padding: inherit;
`;

export const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonBaseProps>(
  ({ children, ...rest }, ref) => {
    return (
      <StyledButton ref={ref} {...rest}>
        {children}
      </StyledButton>
    );
  }
);
