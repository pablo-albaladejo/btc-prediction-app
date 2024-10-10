import { APIGatewayProxyResult } from "aws-lambda";
import axios from "axios";

export const handler = async (): Promise<APIGatewayProxyResult> => {
  try {
    const response = await axios.get(process.env.COINGECKO_API_URL!, {
      params: {
        ids: "bitcoin",
        vs_currencies: "usd",
      },
    });

    const price = response.data.bitcoin.usd;

    return {
      statusCode: 200,
      body: JSON.stringify({ price }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error fetching BTC price" }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};
