import { saveConnection } from "../services/connections";
import WebSocketConnectEvent from "./webSocketConnectEvent.interface";

exports.handler = async (event: WebSocketConnectEvent) => {
  const connectionId = event.requestContext.connectionId;

  try {
    await saveConnection(connectionId);
    return { statusCode: 200, body: "Connected." };
  } catch {
    return { statusCode: 500, body: "Failed to connect." };
  }
};
