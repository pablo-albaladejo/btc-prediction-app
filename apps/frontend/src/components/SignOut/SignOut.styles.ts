import styled from 'styled-components';

export const CustomSignOutButton = styled.button`
  background-color: ${({ theme }) => theme.colors.ui.error};
  color: ${({ theme }) => theme.colors.text.surface};
  border: none;
  padding: 10px 20px;
  font-size: ${({ theme }) => theme.fontSize.medium};
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.ui.primary};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.ui.error};
  }
`;
