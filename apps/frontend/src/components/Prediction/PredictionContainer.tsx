import React, { useContext } from 'react';
import Prediction from './Prediction';
import { WebSocketContext } from '../../contexts';
import {
  PredictionDirection,
  createSubmitPredictionMessage,
} from '@my-org/shared';
import { getCurrentUser } from '@aws-amplify/auth';

const PredictionContainer = () => {
  const { direction, btcPrice, sendMessage, clearPrediction } =
    useContext(WebSocketContext);

  const handlePrediction = async (direction: PredictionDirection) => {
    const userId = (await getCurrentUser()).userId;

    if (direction && btcPrice && userId) {
      const message = createSubmitPredictionMessage({
        direction,
        userUUID: userId,
        price: btcPrice,
      });
      sendMessage(JSON.stringify(message));
      clearPrediction();
    }
  };

  return <Prediction direction={direction} onPrediction={handlePrediction} />;
};

export default PredictionContainer;
