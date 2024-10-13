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
  direction: PredictionDirection | null;
  onPrediction: (direction: PredictionDirection) => void;
}

const Prediction = ({ direction, onPrediction }: PredictionProps) => {
  if (direction === null) {
    return <PredictionText>Loading...</PredictionText>;
  }

  return (
    <PredictionContainer>
      {direction === PredictionDirection.NONE ? (
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
      ) : (
        <PendingText>
          You have a pending prediction: {direction}. <br /> Please wait for it
          to be resolved.
        </PendingText>
      )}
    </PredictionContainer>
  );
};

export default Prediction;
