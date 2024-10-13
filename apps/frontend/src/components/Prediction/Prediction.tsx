import React from 'react';
import {
  PredictionContainer,
  PredictionText,
  PendingText,
  CustomButton,
  ButtonGroup,
} from './Prediction.styles';

interface PredictionProps {
  hasPendingPrediction: boolean;
  onPrediction: (direction: string) => void;
}

const Prediction = ({
  hasPendingPrediction,
  onPrediction,
}: PredictionProps) => {
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
            <CustomButton onClick={() => onPrediction('up')}>Up</CustomButton>
            <CustomButton onClick={() => onPrediction('down')}>
              Down
            </CustomButton>
          </ButtonGroup>
        </>
      )}
    </PredictionContainer>
  );
};

export default Prediction;
