/*import { broadcastMessage } from "../services/messaging";
import { getAllConnectionsByUUID } from "../services/connections";
import { APIGatewayEvent } from "aws-lambda";
import { getUserScore } from "../services/scoreStore";

export const handler = async (event: APIGatewayEvent) => {
  const connectionId = event.requestContext.connectionId;
  const userUUID = event.queryStringParameters?.userUUID;

  if (!connectionId || !userUUID) {
    return { statusCode: 400, body: "Invalid connection ID or user UUID" };
  }

  try {
    const connections = await getAllConnectionsByUUID(userUUID);
    const score = await getUserScore(userUUID);

    await broadcastMessage(connections, dataToSend);

    return { statusCode: 200, body: "User score sent" };
  } catch {
    return { statusCode: 500, body: "Failed to send user score" };

  }
};*/
export const handler = async () => {
  return { statusCode: 200, body: "User score sent" };
};
