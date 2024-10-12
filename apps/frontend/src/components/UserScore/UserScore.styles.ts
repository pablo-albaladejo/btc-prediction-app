import styled from 'styled-components';

export const ScoreText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.medium};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin: 10px 0;
`;
