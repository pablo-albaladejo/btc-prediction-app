import { createUpdatePredictionMessage, createUpdateUserScoreMessage, PredictionDirection } from "@my-org/shared";
import {
  getPendingPredictions,
  deleteResolvedPrediction,
} from "../services/predictionStore";
import { getLatestPrice, getPreviousPrice } from "../services/priceStore";

import { createErrorResponse, createSuccessResponse } from "../utils/responses";
import { updateUserScore } from "../services/scoreStore";
import { getAllConnectionsByUUID } from "../services/connections";
import { broadcastMessage } from "../services/messaging";

export const handler = async () => {
  try {
    const latestPrice = await getLatestPrice();
    const previousPrice = await getPreviousPrice();

    if (!latestPrice || !previousPrice || latestPrice === previousPrice) {
      return createSuccessResponse("No predictions to evaluate");
    }
    const isPriceIncrease = latestPrice > previousPrice;

    const predictions = await getPendingPredictions();
    for (const { userUUID, prediction, timestamp } of predictions) {
      const connections = await getAllConnectionsByUUID(userUUID);

      const isPredictionCorrect =
        prediction === PredictionDirection.Up && isPriceIncrease;
      const delta = isPredictionCorrect ? 1 : -1;
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
        prediction: PredictionDirection.NONE,
      });
      const dataToSend = JSON.stringify(message);
      await broadcastMessage(connections, dataToSend);
    }
    return createSuccessResponse("Predictions evaluated");
  } catch {
    return createErrorResponse("Failed to evaluate predictions");
  }
};
