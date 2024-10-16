import { APIGatewayEvent } from "aws-lambda";

import { saveConnection } from "../services/connections";
import { createErrorResponse, createSuccessResponse } from "../utils/responses";

export const handler = async (event: APIGatewayEvent) => {
  const connectionId = event.requestContext.connectionId;
  const userUUID = event.requestContext.authorizer?.userUUID;

  if (!connectionId || !userUUID) {
    return createErrorResponse("Invalid connection ID or user UUID");
  }

  try {
    await saveConnection(connectionId, userUUID);
    return createSuccessResponse("Connected");
  } catch {
    return createErrorResponse("Failed to connect");
  }
};
