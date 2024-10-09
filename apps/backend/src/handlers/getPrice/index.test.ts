import { handler } from ".";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getPrice handler", () => {
  it("should return the current price of BTC/USD", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        bitcoin: {
          usd: 34000.5,
        },
      },
    });

    const result = await handler();

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify({ price: 34000.5 }));
  });

  it("should return 500 if there is an error fetching the price", async () => {
    mockedAxios.get.mockRejectedValue(new Error("API error"));

    const result = await handler();

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe("Error fetching BTC price");
  });
});
