import { APIGatewayEvent } from "aws-lambda";
import { createSuccessResponse, createErrorResponse } from "../utils/responses";
import { savePrediction } from "../services/predictionStore";
import { getAllConnectionsByUUID } from "../services/connections";
import { createUpdatePredictionMessage } from "@my-org/shared";
import { broadcastMessage } from "../services/messaging";

export const handler = async (event: APIGatewayEvent) => {
  const connectionId = event.requestContext.connectionId;
  const body = JSON.parse(event.body || "{}");

  const userUUID = body.userUUID;
  const prediction = body.prediction;

  if (!connectionId || !userUUID || !body.prediction) {
    return createErrorResponse(
      "Invalid connection ID or user UUID or Body",
      400,
    );
  }

  const timestamp = Date.now();

  try {
    await savePrediction(userUUID, timestamp, prediction);

    //TODO: Use DynamoDB streams to broadcast the message
    const connections = await getAllConnectionsByUUID(userUUID);
    const message = createUpdatePredictionMessage({
      prediction,
    });
    const dataToSend = JSON.stringify(message);
    await broadcastMessage(connections, dataToSend);

    return createSuccessResponse("Prediction submitted");
  } catch {
    return createErrorResponse("Failed to submit prediction");
  }
};
