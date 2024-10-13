import React, { useContext } from 'react';
import Prediction from './Prediction';
import { WebSocketContext } from '../../contexts';
import {
  PredictionDirection,
  createSubmitPredictionMessage,
} from '@my-org/shared';
import { getCurrentUser } from '@aws-amplify/auth';

const PredictionContainer = () => {
  const { prediction, sendMessage, clearPrediction } =
    useContext(WebSocketContext);

  const handlePrediction = async (direction: PredictionDirection) => {
    const userId = (await getCurrentUser()).userId;
    const message = createSubmitPredictionMessage({
      prediction: direction,
      userUUID: userId,
    });
    sendMessage(JSON.stringify(message));
    clearPrediction();
  };

  return <Prediction prediction={prediction} onPrediction={handlePrediction} />;
};

export default PredictionContainer;
