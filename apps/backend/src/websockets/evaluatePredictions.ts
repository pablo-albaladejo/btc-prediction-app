import {
  getPendingPredictions,
  deleteResolvedPrediction,
} from "../services/predictionStore";

import { createErrorResponse, createSuccessResponse } from "../utils/responses";

export const handler = async () => {
  try {
    const predictions = await getPendingPredictions();

    for (const prediction of predictions) {
      //const isPredictionCorrect = await evaluatePrediction(prediction);
      //await updateUserScore(prediction.userId, isPredictionCorrect);

      await deleteResolvedPrediction(prediction.userId, prediction.timestamp);
    }
    return createSuccessResponse("Predictions evaluated");
  } catch (error) {
    console.error("Error evaluating predictions:", error);
    return createErrorResponse("Failed to evaluate predictions");
  }
};
