import React, { useState } from 'react';
import { ButtonGroup } from '@aws-amplify/ui-react';
import {
  PredictionContainer,
  PredictionText,
  PendingText,
  CustomButton,
} from './Prediction.styles';

const Prediction = () => {
  const [hasPendingPrediction] = useState(false);

  const handlePrediction = async (direction: string) => {
    try {
      console.log('Prediction submitted:', direction);
    } catch (error) {
      console.error('Error submitting prediction:', error);
    }
  };

  return (
    <PredictionContainer>
      {hasPendingPrediction ? (
        <PendingText>
          You have a pending prediction. Please wait for it to be resolved.
        </PendingText>
      ) : (
        <>
          <PredictionText>Make your prediction:</PredictionText>
          <ButtonGroup>
            <CustomButton onClick={() => handlePrediction('up')}>
              Up
            </CustomButton>
            <CustomButton onClick={() => handlePrediction('down')}>
              Down
            </CustomButton>
          </ButtonGroup>
        </>
      )}
    </PredictionContainer>
  );
};

export default Prediction;
