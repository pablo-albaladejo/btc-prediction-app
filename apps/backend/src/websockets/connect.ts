import { saveConnection } from "../services/connections";
import WebSocketConnectEvent from "./webSocketConnectEvent.interface";

export const handler = async (event: WebSocketConnectEvent) => {
  const connectionId = event.requestContext.connectionId;
  if (!connectionId) {
    return { statusCode: 400, body: "Invalid connection ID" };
  }

  try {
    await saveConnection(connectionId);
    return { statusCode: 200, body: "Connected." };
  } catch {
    return { statusCode: 500, body: "Failed to connect." };
  }
};
