import { createUpdateUserScoreMessage } from "@my-org/shared";
import { DynamoDBStreamEvent } from "aws-lambda";
import { getAllConnectionsByUUID } from "../services/connections";
import { broadcastMessage } from "../services/messaging";

export const handler = async (event: DynamoDBStreamEvent) => {
  for (const record of event.Records) {
    if (record.dynamodb?.NewImage) {
      const newScore = record.dynamodb.NewImage.score.N;
      const userUUID = record.dynamodb.NewImage.userUUID.S;

      if (newScore && userUUID) {
        const connections = await getAllConnectionsByUUID(userUUID);
        const postData = createUpdateUserScoreMessage({
          score: Number(newScore),
        });
        const dataToSend = JSON.stringify(postData);

        await broadcastMessage(connections, dataToSend);
      }
    }
  }
};
