import AWS from "aws-sdk";
import { deleteConnection, Connection } from "./connections";

const WEBSOCKET_API_ENDPOINT = process.env.WEBSOCKET_API_ENDPOINT;

const apigwManagementApi = new AWS.ApiGatewayManagementApi({
  endpoint: WEBSOCKET_API_ENDPOINT?.replace("wss://", ""),
});

export const sendMessage = async (
  connectionId: string,
  data: string,
): Promise<void> => {
  try {
    await apigwManagementApi
      .postToConnection({
        ConnectionId: connectionId,
        Data: data,
      })
      .promise();
  } catch (err) {
    console.error("Failed to send message:", err);
    if ((err as AWS.AWSError).statusCode === 410) {
      // Invalid connection, delete it
      await deleteConnection(connectionId);
    } else {
      // Throw the error so it can be handled by the caller
      throw err;
    }
  }
};

export const broadcastMessage = async (
  connections: Connection[],
  data: string,
): Promise<void> => {
  const sendPromises = connections.map(({ connectionId }) =>
    sendMessage(connectionId, data),
  );

  try {
    await Promise.all(sendPromises);
  } catch {
    // Error handling, but we do not throw to continue the flow
    // TODO: Handle when the main error handler is implemented
  }
};
