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
