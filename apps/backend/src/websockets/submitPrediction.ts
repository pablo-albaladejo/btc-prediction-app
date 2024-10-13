import { APIGatewayEvent } from "aws-lambda";
import { createSuccessResponse, createErrorResponse } from "../utils/responses";
import { savePrediction } from "../services/predictionStore";

export const handler = async (event: APIGatewayEvent) => {
  const connectionId = event.requestContext.connectionId;
  const userUUID = event.queryStringParameters?.userUUID;
  const body = JSON.parse(event.body || "{}");

  if (!connectionId || !userUUID || !body.prediction) {
    return createErrorResponse(
      "Invalid connection ID or user UUID or Body",
      400,
    );
  }

  const timestamp = Date.now();
  const prediction = body.prediction;

  try {
    await savePrediction(userUUID, timestamp, prediction);

    return createSuccessResponse("Prediction submitted");
  } catch (error) {
    console.error("Failed to submit prediction:", error);
    return createErrorResponse("Failed to submit prediction");
  }
};
