import { useState, useCallback } from 'react';
import { isUpdatePredictionMessage, PredictionDirection } from '@my-org/shared';
import { useWebSocket } from './useWebSocket';

export const usePrediction = () => {
  const [prediction, setPrediction] = useState<PredictionDirection | null>(
    null,
  );

  const handlePredictionStatus = useCallback((message: MessageEvent) => {
    const data = JSON.parse(message.data);
    console.log('Data', data);
    if (isUpdatePredictionMessage(data)) {
      setPrediction(data.prediction);
    }
  }, []);
  useWebSocket(handlePredictionStatus);

  const handlePrediction = (direction: PredictionDirection) =>
    console.log('Prediction', direction);

  return { prediction, handlePrediction };
};
