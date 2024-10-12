import styled from 'styled-components';

export const HomeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f4f8;
  padding: 0 10%;
`;

export const StyledCard = styled.div`
  width: 80%;
  max-width: 400px;
  padding: 5%;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

export const ButtonWrapper = styled.div`
  margin-top: 15%;
  align-self: flex-end;
`;
