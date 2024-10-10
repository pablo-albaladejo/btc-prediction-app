import axios from "axios";
import { getCurrentBTCPrice } from "./coinGecko";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getCurrentBTCPrice", () => {
  const COINGECKO_API_URL = process.env.COINGECKO_API_URL!;

  it("should return the current price of BTC/USD", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        bitcoin: {
          usd: 34000.5,
        },
      },
    });

    const price = await getCurrentBTCPrice();

    expect(price).toBe(34000.5);
    expect(mockedAxios.get).toHaveBeenCalledWith(COINGECKO_API_URL, {
      params: { ids: "bitcoin", vs_currencies: "usd", precision: 4 },
    });
  });

  it("should throw an error if there is an error fetching the price", async () => {
    mockedAxios.get.mockRejectedValue(new Error("API error"));

    await expect(getCurrentBTCPrice()).rejects.toThrow(
      "Error fetching BTC price",
    );
  });
});
