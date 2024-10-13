import { dynamoDB } from "../utils/awsClients";

const PRICE_TABLE = process.env.PRICE_TABLE!;
const LATEST_PRICE_ITEM_KEY = { id: "latest" };

export const saveLatestPrice = async (price: number): Promise<void> => {
  try {
    const latestPriceParams = {
      TableName: PRICE_TABLE,
      Item: {
        ...LATEST_PRICE_ITEM_KEY,
        price,
        timestamp: Date.now(),
      },
    };
    await dynamoDB.put(latestPriceParams).promise();
  } catch {
    throw new Error("Error saving latest price");
  }
};

export const getLatestPrice = async (): Promise<number | null> => {
  const params = {
    TableName: PRICE_TABLE,
    Key: LATEST_PRICE_ITEM_KEY,
  };

  try {
    const result = await dynamoDB.get(params).promise();
    return result.Item ? result.Item.price : null;
  } catch {
    throw new Error("Error getting latest price");
  }
};
