import { saveConnection } from "../services/connections";
import { createErrorResponse, createSuccessResponse } from "../utils/responses";
import WebSocketConnectEvent from "./webSocketConnectEvent.interface";

export const handler = async (event: WebSocketConnectEvent) => {
  const connectionId = event.requestContext.connectionId;
  const userUUID = event.queryStringParameters?.userUUID;

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
