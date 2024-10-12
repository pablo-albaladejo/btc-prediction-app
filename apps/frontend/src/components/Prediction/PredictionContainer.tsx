import React, { useState } from 'react';
import Prediction from './Prediction';

const PredictionContainer = () => {
  const [hasPendingPrediction, setHasPendingPrediction] = useState(false);

  const handlePrediction = async (direction: string) => {
    try {
      console.log('Prediction submitted:', direction);
      setHasPendingPrediction(true);
    } catch (error) {
      console.error('Error submitting prediction:', error);
    }
  };

  return (
    <Prediction
      hasPendingPrediction={hasPendingPrediction}
      onPrediction={handlePrediction}
    />
  );
};

export default PredictionContainer;
