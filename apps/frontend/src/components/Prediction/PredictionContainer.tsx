import React, { useContext } from 'react';
import Prediction from './Prediction';
import { WebSocketContext } from '../../contexts';
import {
  PredictionDirection,
  createSubmitPredictionMessage,
} from '@my-org/shared';

const PredictionContainer = () => {
  const { direction, btcPrice, sendMessage, clearPrediction } =
    useContext(WebSocketContext);

  const handlePrediction = async (direction: PredictionDirection) => {
    if (direction && btcPrice) {
      const message = createSubmitPredictionMessage({
        direction,
        price: btcPrice,
      });
      sendMessage(JSON.stringify(message));
      clearPrediction();
    }
  };

  return <Prediction direction={direction} onPrediction={handlePrediction} />;
};

export default PredictionContainer;
