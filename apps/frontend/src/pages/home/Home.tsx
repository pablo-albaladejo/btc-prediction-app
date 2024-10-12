import React from 'react';
import { Divider } from '@aws-amplify/ui-react';
import Prediction from '../../components/Prediction/Prediction';
import BTCPrice from '../../components/BTCPrice/BTCPrice';
import UserScore from '../../components/UserScore/UserScore';
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
