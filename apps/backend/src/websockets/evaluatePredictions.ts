import { PredictionDirection } from "@my-org/shared";
import {
  getPendingPredictions,
  deleteResolvedPrediction,
} from "../services/predictionStore";
import { getLatestPrice } from "../services/priceStore";

import { createErrorResponse, createSuccessResponse } from "../utils/responses";
import { updateUserScore } from "../services/scoreStore";

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

        const delta = getEvaluation(latestPrice, price, direction);

        // TODO: use transaction to update score and delete prediction
        await updateUserScore(userUUID, delta);
        await deleteResolvedPrediction(userUUID, timestamp);
      },
    );
    await Promise.all(promises);

    return createSuccessResponse("Predictions evaluated");
  } catch {
    return createErrorResponse("Failed to evaluate predictions");
  }
};
