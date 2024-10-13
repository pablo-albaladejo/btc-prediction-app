import {
  createUpdatePredictionMessage,
  createUpdateUserScoreMessage,
  PredictionDirection,
} from "@my-org/shared";
import {
  getPendingPredictions,
  deleteResolvedPrediction,
} from "../services/predictionStore";
import { getLatestPrice } from "../services/priceStore";

import { createErrorResponse, createSuccessResponse } from "../utils/responses";
import { updateUserScore } from "../services/scoreStore";
import { getAllConnectionsByUUID } from "../services/connections";
import { broadcastMessage } from "../services/messaging";

const getEvaluation = (
  latestPrice: number,
  price: number,
  direction: PredictionDirection,
): number => {
  if (latestPrice === price) return 0;
  if (latestPrice > price && direction === PredictionDirection.Up) return 1;
  if (latestPrice < price && direction === PredictionDirection.Down) return 1;
  return -1;
};

export const handler = async () => {
  try {
    const latestPrice = await getLatestPrice();
    const predictions = await getPendingPredictions();

    if (!latestPrice || !predictions)
      return createErrorResponse("Failed to evaluate predictions");

    const promises = predictions.map(
      async ({ userUUID, direction, price, timestamp }) => {
        const timeLapsed = Math.floor((Date.now() - timestamp) / 1000);
        if (timeLapsed < 60) return;

        const connections = await getAllConnectionsByUUID(userUUID);

        const delta = getEvaluation(latestPrice, price, direction);
        const score = await updateUserScore(userUUID, delta);

        //TODO: Use DynamoDB streams to broadcast the message
        const scoreMessage = createUpdateUserScoreMessage({
          score,
        });
        const scoreDataToSend = JSON.stringify(scoreMessage);
        await broadcastMessage(connections, scoreDataToSend);

        await deleteResolvedPrediction(userUUID, timestamp);
        //TODO: Use DynamoDB streams to broadcast the message
        const message = createUpdatePredictionMessage({
          direction: PredictionDirection.NONE,
        });
        const dataToSend = JSON.stringify(message);
        await broadcastMessage(connections, dataToSend);
      },
    );

    // Esperar a que todas las promesas se resuelvan
    await Promise.all(promises);
    return createSuccessResponse("Predictions evaluated");
  } catch {
    return createErrorResponse("Failed to evaluate predictions");
  }
};
