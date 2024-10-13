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
  prediction: PredictionDirection | null;
  onPrediction: (direction: PredictionDirection) => void;
}

const Prediction = ({ prediction, onPrediction }: PredictionProps) => {
  if (prediction === null) {
    return <PredictionText>Loading...</PredictionText>;
  }

  return (
    <PredictionContainer>
      {prediction === PredictionDirection.NONE ? (
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
          You have a pending prediction: {prediction}. <br /> Please wait for it
          to be resolved.
        </PendingText>
      )}
    </PredictionContainer>
  );
};

export default Prediction;
