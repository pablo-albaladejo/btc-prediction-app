import React from 'react';
import {
  PredictionContainer,
  PredictionText,
  PendingText,
  CustomButton,
  ButtonGroup,
} from './Prediction.styles';
import { PredictionDirection } from '@my-org/shared';

interface PredictionProps {
  hasPendingPrediction: boolean;
  onPrediction: (direction: PredictionDirection) => void;
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
            <CustomButton onClick={() => onPrediction(PredictionDirection.Up)}>
              Up
            </CustomButton>
            <CustomButton
              onClick={() => onPrediction(PredictionDirection.Down)}
            >
              Down
            </CustomButton>
          </ButtonGroup>
        </>
      )}
    </PredictionContainer>
  );
};

export default Prediction;
