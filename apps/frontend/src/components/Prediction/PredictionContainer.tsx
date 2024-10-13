import React from 'react';
import Prediction from './Prediction';
import { usePrediction } from '../../hooks';

const PredictionContainer = () => {
  const { prediction, handlePrediction } = usePrediction();

  return <Prediction prediction={prediction} onPrediction={handlePrediction} />;
};

export default PredictionContainer;
