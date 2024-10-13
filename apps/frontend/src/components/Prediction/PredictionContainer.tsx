import React from 'react';
import Prediction from './Prediction';
import { usePrediction } from '../../hooks';

const PredictionContainer = () => {
  const { hasPendingPrediction, handlePrediction } = usePrediction();

  return (
    <Prediction
      hasPendingPrediction={hasPendingPrediction}
      onPrediction={handlePrediction}
    />
  );
};

export default PredictionContainer;
