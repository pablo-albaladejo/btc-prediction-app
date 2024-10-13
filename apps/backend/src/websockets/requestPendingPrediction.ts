import { APIGatewayEvent } from "aws-lambda";
import { createSuccessResponse, createErrorResponse } from "../utils/responses";
import { sendMessage } from "../services/messaging";
import { getPredictionStatus } from "../services/predictionStore";
import { createUpdatePendingPredictionMessage } from "@my-org/shared";

export const handler = async (event: APIGatewayEvent) => {
  const connectionId = event.requestContext.connectionId;
  const body = JSON.parse(event.body || "{}");
  const userUUID = body.userUUID;

  console.log("Connection ID:", connectionId);
  console.log("User UUID:", userUUID);
  if (!connectionId || !userUUID) {
    return createErrorResponse("Invalid connection ID or user UUID", 400);
  }

  try {
    console.log("Getting prediction status for user:", userUUID);
    const hasPendingPrediction = await getPredictionStatus(userUUID);
    console.log("Has pending prediction:", hasPendingPrediction);
    const message = createUpdatePendingPredictionMessage({
      hasPendingPrediction,
    });
    console.log("Sending message:", message);

    await sendMessage(connectionId, JSON.stringify(message));
    console.log("Message sent");
    return createSuccessResponse("Pending prediction status sent");
  } catch (error) {
    console.error("Error sending prediction status:", error);
    return createErrorResponse("Failed to send prediction status");
  }
};
