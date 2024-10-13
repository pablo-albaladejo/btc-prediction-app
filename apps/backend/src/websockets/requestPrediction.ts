import { APIGatewayEvent } from "aws-lambda";
import { createSuccessResponse, createErrorResponse } from "../utils/responses";
import { sendMessage } from "../services/messaging";
import { getPrediction } from "../services/predictionStore";
import { createUpdatePredictionMessage } from "@my-org/shared";

export const handler = async (event: APIGatewayEvent) => {
  const connectionId = event.requestContext.connectionId;
  const body = JSON.parse(event.body || "{}");
  const userUUID = body.userUUID;

  if (!connectionId || !userUUID) {
    return createErrorResponse("Invalid connection ID or user UUID", 400);
  }

  try {
    const direction = await getPrediction(userUUID);
    const message = createUpdatePredictionMessage({
      direction,
    });

    await sendMessage(connectionId, JSON.stringify(message));

    return createSuccessResponse("Pending prediction status sent");
  } catch {
    return createErrorResponse("Failed to send prediction status");
  }
};
