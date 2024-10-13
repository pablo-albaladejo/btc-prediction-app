import { deleteConnection } from "../services/connections";
import { createErrorResponse, createSuccessResponse } from "../utils/responses";
import WebSocketConnectEvent from "./webSocketConnectEvent.interface";

export const handler = async (event: WebSocketConnectEvent) => {
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
