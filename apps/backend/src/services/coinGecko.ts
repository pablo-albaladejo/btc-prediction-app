import axios from "axios";

const COINGECKO_API_URL = process.env.COINGECKO_API_URL!;

export const getCurrentBTCPrice = async (): Promise<number> => {
  try {
    const response = await axios.get(COINGECKO_API_URL, {
      params: { ids: "bitcoin", vs_currencies: "usd", precision: 4 },
    });
    return response.data.bitcoin.usd;
  } catch {
    throw new Error("Error fetching BTC price");
  }
};
