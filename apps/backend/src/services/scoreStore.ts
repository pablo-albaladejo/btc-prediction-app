import { dynamoDB } from "../utils/awsClients";

const SCORE_TABLE = process.env.SCORE_TABLE!;

export const getUserScore = async (userUUID: string): Promise<number> => {
  const result = await dynamoDB
    .get({
      TableName: SCORE_TABLE,
      Key: { userUUID },
    })
    .promise();
  return result.Item?.score ?? 0;
};

export const updateUserScore = async (
  userUUID: string,
  amount: number,
): Promise<number> => {
  const result = await dynamoDB
    .update({
      TableName: SCORE_TABLE,
      Key: { userUUID },
      UpdateExpression: "ADD score :amount",
      ExpressionAttributeValues: {
        ":amount": amount,
      },
      ReturnValues: "UPDATED_NEW",
    })
    .promise();
  return result.Attributes?.score || 0;
};
