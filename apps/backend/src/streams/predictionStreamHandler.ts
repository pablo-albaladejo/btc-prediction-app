import {
  createUpdatePredictionMessage,
  PredictionDirection,
} from "@my-org/shared";
import { DynamoDBStreamEvent, StreamRecord } from "aws-lambda";
import { getAllConnectionsByUUID } from "../services/connections";
import { broadcastMessage } from "../services/messaging";

const broadcastUpdateMessage = async (dynamodb: StreamRecord | undefined) => {
  const userUUID = dynamodb?.NewImage?.userUUID.S;
  const direction = dynamodb?.NewImage?.direction.S as PredictionDirection;
  if (userUUID && direction) {
    const connections = await getAllConnectionsByUUID(userUUID);
    const message = createUpdatePredictionMessage({
      direction,
    });
    const dataToSend = JSON.stringify(message);
    await broadcastMessage(connections, dataToSend);
  }
};

const broadcastDeleteMessage = async (dynamodb: StreamRecord | undefined) => {
  const userUUID = dynamodb?.Keys?.userUUID.S;
  if (userUUID) {
    const connections = await getAllConnectionsByUUID(userUUID);
    const message = createUpdatePredictionMessage({
      direction: PredictionDirection.NONE,
    });
    const dataToSend = JSON.stringify(message);
    await broadcastMessage(connections, dataToSend);
  }
};

export const handler = async (event: DynamoDBStreamEvent) => {
  for (const record of event.Records) {
    console.log("Processing record", JSON.stringify(record, null, 2));

    switch (record.eventName) {
      case "INSERT":
        await broadcastUpdateMessage(record.dynamodb);
        break;
      case "REMOVE":
        await broadcastDeleteMessage(record.dynamodb);
        break;
    }
  }
};
