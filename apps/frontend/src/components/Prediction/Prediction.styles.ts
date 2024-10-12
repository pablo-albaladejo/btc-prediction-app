import styled from 'styled-components';

export const PredictionContainer = styled.div`
  padding: 5%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2%;
`;

export const PredictionText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
`;

export const PendingText = styled.p`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.error};
  font-size: ${({ theme }) => theme.fontSize.medium};
  text-align: center;
`;

export const CustomButton = styled.button`
  background-color: ${({ theme }) => theme.colors.ui.secondary};
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
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.ui.primary};
  }
`;
