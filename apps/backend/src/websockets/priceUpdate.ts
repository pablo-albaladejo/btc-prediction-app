import { getCurrentBTCPrice } from "../services/coinGecko";
import { saveLatestPrice } from "../services/priceStore";

export const handler = async () => {
  try {
    const currentPrice = await getCurrentBTCPrice();
    await saveLatestPrice(currentPrice);
  } catch {
    // TODO: Handle when the main error handler is implemented
  }
};
