import styled from 'styled-components';

export const WelcomeHeading = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.large};
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin: 20px 0;
`;
