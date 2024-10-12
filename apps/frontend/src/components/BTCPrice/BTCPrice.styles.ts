import styled from 'styled-components';

export const BTCPriceText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.medium};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
  margin: 10px 0;
`;
