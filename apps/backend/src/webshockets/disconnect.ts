import { deleteConnection } from "../services/connections";
import WebSocketConnectEvent from "./webSocketConnectEvent.interface";

exports.handler = async (event: WebSocketConnectEvent) => {
  const connectionId = event.requestContext.connectionId;

  try {
    await deleteConnection(connectionId);
    return { statusCode: 200, body: "Disconnected." };
  } catch {
    return { statusCode: 500, body: "Failed to disconnect." };
  }
};
