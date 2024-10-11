import { APIGatewayEvent } from "aws-lambda";
import { getUserScore } from "../services/scoreStore";
import { sendMessage } from "../services/messaging";
import { createUpdateUserScoreMessage } from "@my-org/shared";

export const handler = async (event: APIGatewayEvent) => {
  const connectionId = event.requestContext.connectionId;
  const body = JSON.parse(event.body || "{}");
  const userUUID = body.userUUID;

  console.log("Connection ID:", connectionId);
  console.log("User UUID:", userUUID);

  if (!connectionId || !userUUID) {
    return { statusCode: 400, body: "Invalid connection ID or user UUID" };
  }

  try {
    console.log("Getting user score");
    const score = await getUserScore(userUUID);
    console.log("Got user score", score);

    const message = createUpdateUserScoreMessage({ score });
    const dataToSend = JSON.stringify(message);
    console.log("Sending user score", dataToSend);

    await sendMessage(connectionId, dataToSend);
    console.log("User score sent");
    return { statusCode: 200, body: "User score sent" };
  } catch {
    console.log("Failed to send user score");
    return { statusCode: 500, body: "Failed to send user score" };
  }
};
