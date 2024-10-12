import React from 'react';
import { Divider } from '@aws-amplify/ui-react';
import Prediction from '../../components/Prediction';
import BTCPrice from '../../components/BTCPrice';
import UserScore from '../../components/UserScore';
import Welcome from '../../components/Welcome';
import SignOut from '../../components/SignOut';
import { HomeContainer, StyledCard, ButtonWrapper } from './Home.styles';

const Home = () => {
  return (
    <HomeContainer>
      <StyledCard>
        <Welcome />
        <BTCPrice />
        <UserScore />
        <Divider />
        <Prediction />
        <ButtonWrapper>
          <SignOut />
        </ButtonWrapper>
      </StyledCard>
    </HomeContainer>
  );
};

export default Home;
