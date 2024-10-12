import React from 'react';
import { Flex, Card } from '@aws-amplify/ui-react';
import Prediction from '../../components/Prediction/Prediction';
import BTCPrice from '../../components/BTCPrice/BTCPrice';
import UserScore from '../../components/UserScore/UserScore';
import Welcome from '../../components/Welcome';
import SignOut from '../../components/SignOut';

const Home = () => {
  return (
    <Flex
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f0f4f8',
      }}
    >
      <Card
        style={{
          width: '400px',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff',
        }}
      >
        <Welcome />
        <BTCPrice />
        <UserScore />
        <Prediction />
        <SignOut />
      </Card>
    </Flex>
  );
};

export default Home;
