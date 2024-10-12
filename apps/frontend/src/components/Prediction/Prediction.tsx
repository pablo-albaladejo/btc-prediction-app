import React, { useState } from 'react';
import { View, Flex, Button, Text } from '@aws-amplify/ui-react';

//import { hasUnresolvedPrediction, submitPrediction } from '../../services/api';

const Prediction = () => {
  const [hasPendingPrediction] = useState(false);

  /*useEffect(() => {
    const checkPrediction = async () => {
      try {
        const response = await hasUnresolvedPrediction();
        setHasPendingPrediction(response.hasUnresolvedPrediction);
      } catch (error) {
        console.error('Error verifying predictions:', error);
      }
    };

    checkPrediction();
  }, []);*/

  const handlePrediction = async (direction: string) => {
    try {
      //await submitPrediction(direction);
      //setHasPendingPrediction(true);
      console.log('Prediction submitted:', direction);
    } catch (error) {
      console.error('Error submitting prediction:', error);
    }
  };

  return (
    <View padding="medium" width="100%">
      {hasPendingPrediction ? (
        <Text as="p" fontWeight="bold" color="red">
          You have a pending prediction. Please wait for it to be resolved.
        </Text>
      ) : (
        <Flex direction="column" alignItems="center" gap="1rem">
          <Text>Make your prediction:</Text>
          <Flex gap="1rem">
            <Button variation="link" onClick={() => handlePrediction('up')}>
              Up
            </Button>
            <Button variation="link" onClick={() => handlePrediction('down')}>
              Down
            </Button>
          </Flex>
        </Flex>
      )}
    </View>
  );
};

export default Prediction;
