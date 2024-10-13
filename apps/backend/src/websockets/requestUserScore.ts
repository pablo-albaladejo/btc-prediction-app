import { APIGatewayEvent } from "aws-lambda";
import { getUserScore } from "../services/scoreStore";
import { sendMessage } from "../services/messaging";
import { createUpdateUserScoreMessage } from "@my-org/shared";
import { createErrorResponse, createSuccessResponse } from "../utils/responses";

export const handler = async (event: APIGatewayEvent) => {
  const connectionId = event.requestContext.connectionId;
  const body = JSON.parse(event.body || "{}");
  const userUUID = body.userUUID;

  if (!connectionId || !userUUID) {
    return createErrorResponse("Invalid connection ID or user UUID", 400);
  }

  try {
    const score = await getUserScore(userUUID);

    const message = createUpdateUserScoreMessage({ score });
    const dataToSend = JSON.stringify(message);

    await sendMessage(connectionId, dataToSend);
    return createSuccessResponse("User score sent");
  } catch {
    return createErrorResponse("Failed to send user score");
  }
};
