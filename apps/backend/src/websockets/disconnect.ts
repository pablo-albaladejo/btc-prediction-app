import { APIGatewayEvent } from "aws-lambda";
import { deleteConnection } from "../services/connections";
import { createErrorResponse, createSuccessResponse } from "../utils/responses";

export const handler = async (event: APIGatewayEvent) => {
  const connectionId = event.requestContext.connectionId;
  if (!connectionId) {
    return createErrorResponse("Invalid connection ID", 400);
  }

  try {
    await deleteConnection(connectionId);
    return createSuccessResponse("Disconnected");
  } catch {
    return createErrorResponse("Failed to disconnect");
  }
};
