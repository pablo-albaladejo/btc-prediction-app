import { dynamoDB } from "../utils/awsClients";

const PRICE_TABLE = process.env.PRICE_TABLE!;
const PRICE_ITEM_KEY = { id: "latest" };

export const saveLatestPrice = async (price: number): Promise<void> => {
  const params = {
    TableName: PRICE_TABLE,
    Item: {
      ...PRICE_ITEM_KEY,
      price,
      timestamp: Date.now(),
    },
  };

  try {
    await dynamoDB.put(params).promise();
  } catch {
    throw new Error("Error saving latest price");
  }
};

export const getLatestPrice = async (): Promise<number | null> => {
  const params = {
    TableName: PRICE_TABLE,
    Key: PRICE_ITEM_KEY,
  };

  try {
    const result = await dynamoDB.get(params).promise();
    return result.Item ? result.Item.price : null;
  } catch {
    throw new Error("Error getting latest price");
  }
};
