import { getLatestPrice } from "../services/priceStore";
import { sendMessage } from "../services/messaging";
import { createUpdatePriceMessage } from "@my-org/shared";
import { createErrorResponse, createSuccessResponse } from "../utils/responses";
import { APIGatewayEvent } from "aws-lambda";

export const handler = async (event: APIGatewayEvent) => {
  const connectionId = event.requestContext.connectionId;
  if (!connectionId) {
    return createErrorResponse("Invalid connection ID", 400);
  }

  try {
    const latestPrice = await getLatestPrice();

    if (latestPrice !== null) {
      const postData = createUpdatePriceMessage({ price: latestPrice });
      const dataToSend = JSON.stringify(postData);

      await sendMessage(connectionId, dataToSend);
    }

    return createSuccessResponse("Latest price sent");
  } catch {
    return createErrorResponse("Failed to send latest price");
  }
};
