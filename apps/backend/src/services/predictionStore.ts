import { PredictionDirection } from "@my-org/shared";
import { dynamoDB } from "../utils/awsClients";

const PREDICTIONS_TABLE = process.env.PREDICTIONS_TABLE!;

export const savePrediction = async (
  userUUID: string,
  timestamp: number,
  prediction: string,
) => {
  await dynamoDB
    .put({
      TableName: PREDICTIONS_TABLE,
      Item: {
        userUUID,
        timestamp,
        prediction,
        status: "pending",
      },
    })
    .promise();
};

export const getPendingPredictions = async () => {
  const pendingPredictions = await dynamoDB
    .scan({
      TableName: PREDICTIONS_TABLE,
      FilterExpression: "status = :status",
      ExpressionAttributeValues: {
        ":status": "pending",
      },
    })
    .promise();

  return pendingPredictions.Items || [];
};

export const deleteResolvedPrediction = async (
  userUUID: string,
  timestamp: number,
) => {
  await dynamoDB
    .delete({
      TableName: PREDICTIONS_TABLE,
      Key: {
        userUUID,
        timestamp,
      },
    })
    .promise();
};

export const getPrediction = async (
  userUUID: string,
): Promise<PredictionDirection> => {
  const result = await dynamoDB
    .query({
      TableName: PREDICTIONS_TABLE,
      KeyConditionExpression: "userUUID = :userUUID",
      FilterExpression: "#status = :status",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":userUUID": userUUID,
        ":status": "pending",
      },
    })
    .promise();
  return result.Items?.[0]?.prediction ?? PredictionDirection.NONE;
};
