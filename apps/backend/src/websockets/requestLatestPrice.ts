import { getLatestPrice } from "../services/priceStore";
import { sendMessage } from "../services/messaging";
import { createUpdatePriceMessage } from "@my-org/shared";
import WebSocketConnectEvent from "./webSocketConnectEvent.interface";

export const handler = async (event: WebSocketConnectEvent) => {
  const connectionId = event.requestContext.connectionId;
  if (!connectionId) {
    return { statusCode: 400, body: "Invalid connection ID" };
  }

  try {
    const latestPrice = await getLatestPrice();

    if (latestPrice !== null) {
      const postData = createUpdatePriceMessage({ price: latestPrice });
      const dataToSend = JSON.stringify(postData);

      await sendMessage(connectionId, dataToSend);
    }

    return { statusCode: 200, body: "Latest price sent." };
  } catch {
    return { statusCode: 500, body: "Failed to send latest price." };
  }
};
