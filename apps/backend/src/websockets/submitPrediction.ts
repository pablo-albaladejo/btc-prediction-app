import { APIGatewayEvent } from "aws-lambda";
import { createSuccessResponse, createErrorResponse } from "../utils/responses";
import { savePrediction } from "../services/predictionStore";
import { getAllConnectionsByUUID } from "../services/connections";
import { createUpdatePredictionMessage } from "@my-org/shared";
import { broadcastMessage } from "../services/messaging";

export const handler = async (event: APIGatewayEvent) => {
  const connectionId = event.requestContext.connectionId;
  const userUUID = event.requestContext.authorizer?.userUUID;

  const body = JSON.parse(event.body || "{}");
  const { direction, price } = body;

  if (!connectionId || !userUUID || !direction || !price) {
    return createErrorResponse(
      "Invalid connection ID or user UUID or Body",
      400,
    );
  }

  const timestamp = Date.now();

  try {
    await savePrediction(userUUID, timestamp, direction, price);

    //TODO: Use DynamoDB streams to broadcast the message
    const connections = await getAllConnectionsByUUID(userUUID);
    const message = createUpdatePredictionMessage({
      direction,
    });
    const dataToSend = JSON.stringify(message);
    await broadcastMessage(connections, dataToSend);

    return createSuccessResponse("Prediction submitted");
  } catch {
    return createErrorResponse("Failed to submit prediction");
  }
};
