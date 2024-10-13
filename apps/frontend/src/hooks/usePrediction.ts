import { useState, useCallback } from 'react';
import {
  isUpdatePendingPredictionMessage,
  PredictionDirection,
} from '@my-org/shared';
import { useWebSocket } from './useWebSocket';

export const usePrediction = () => {
  const [hasPendingPrediction, setHasPendingPrediction] = useState(false);

  const handlePendingPredictionStatus = useCallback((message: MessageEvent) => {
    const data = JSON.parse(message.data);
    if (isUpdatePendingPredictionMessage(data)) {
      setHasPendingPrediction(data.hasPendingPrediction);
    }
  }, []);
  useWebSocket(handlePendingPredictionStatus);

  /*const { sendMessage } = useWebSocket(handlePendingPredictionStatus);

  const handlePrediction = useCallback(
    (direction: PredictionDirection) => {
      const message = createSubmitPredictionMessage({ prediction: direction });
      sendMessage(message);
    },
    [sendMessage],
  );*/

  const handlePrediction = (direction: PredictionDirection) =>
    console.log('Prediction', direction);

  return { hasPendingPrediction, handlePrediction };
};
