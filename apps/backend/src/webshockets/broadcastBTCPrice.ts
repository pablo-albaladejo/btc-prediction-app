import { getCurrentBTCPrice } from "../services/coinGecko";
import { getAllConnections } from "../services/connections";
import { broadcastMessage } from "../services/messaging";
import { createUpdatePriceMessage } from "@my-org/shared";

export const handler = async () => {
  try {
    const currentPrice = await getCurrentBTCPrice();

    const connections = await getAllConnections();

    const postData = createUpdatePriceMessage({ price: currentPrice });
    const dataToSend = JSON.stringify(postData);

    await broadcastMessage(connections, dataToSend);
  } catch {
    // TODO: Handle when the main error handler is implemented
  }
};
