import { saveConnection } from "../services/connections";
import WebSocketConnectEvent from "./webSocketConnectEvent.interface";

export const handler = async (event: WebSocketConnectEvent) => {
  const connectionId = event.requestContext.connectionId;
  const userUUID = event.queryStringParameters?.userUUID;

  if (!connectionId || !userUUID) {
    return { statusCode: 400, body: "Invalid connection ID or user UUID" };
  }

  try {
    await saveConnection(connectionId, userUUID);
    return { statusCode: 200, body: "Connected." };
  } catch {
    return { statusCode: 500, body: "Failed to connect." };
  }
};
