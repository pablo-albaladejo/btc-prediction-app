import { createUpdatePriceMessage } from "@my-org/shared";
import { DynamoDBStreamEvent } from "aws-lambda";
import { getAllConnections } from "../services/connections";
import { broadcastMessage } from "../services/messaging";

export const handler = async (event: DynamoDBStreamEvent) => {
  for (const record of event.Records) {
    console.log("Event type:", record.eventName);
    console.log("Record data:", JSON.stringify(record.dynamodb, null, 2));

    if (record.dynamodb?.NewImage) {
      const newPrice = record.dynamodb.NewImage.price.N;

      if (newPrice) {
        const connections = await getAllConnections();
        const postData = createUpdatePriceMessage({ price: Number(newPrice) });
        const dataToSend = JSON.stringify(postData);

        await broadcastMessage(connections, dataToSend);
      }
    }
  }

  return `Processed ${event.Records.length} records.`;
};
