import { dynamoDB } from "../utils/awsClients";

const CONNECTIONS_TABLE = process.env.CONNECTIONS_TABLE!;

export interface Connection {
  connectionId: string;
  userUUID: string;
}

export const getAllConnections = async (): Promise<Connection[]> => {
  const params = {
    TableName: CONNECTIONS_TABLE,
    ProjectionExpression: "connectionId, userUUID",
  };

  try {
    const result = await dynamoDB.scan(params).promise();
    return result.Items as Connection[];
  } catch {
    throw new Error("Error getting connections");
  }
};

export const getAllConnectionsByUUID = async (
  userUUID: string,
): Promise<Connection[]> => {
  const params = {
    TableName: CONNECTIONS_TABLE,
    IndexName: "UserUUIDIndex",
    KeyConditionExpression: "userUUID = :uuid",
    ExpressionAttributeValues: {
      ":uuid": userUUID,
    },
    ProjectionExpression: "connectionId, userUUID",
  };

  try {
    const result = await dynamoDB.query(params).promise();
    return result.Items as Connection[];
  } catch {
    throw new Error(`Error getting connections for userUUID: ${userUUID}`);
  }
};

export const saveConnection = async (
  connectionId: string,
  userUUID: string,
): Promise<void> => {
  const params = {
    TableName: CONNECTIONS_TABLE,
    Item: {
      connectionId: connectionId,
      userUUID: userUUID,
    },
  };

  try {
    await dynamoDB.put(params).promise();
  } catch {
    throw new Error("Error saving connection");
  }
};

export const deleteConnection = async (connectionId: string): Promise<void> => {
  const params = {
    TableName: CONNECTIONS_TABLE,
    Key: { connectionId },
  };

  try {
    await dynamoDB.delete(params).promise();
  } catch {
    // We do not throw the error to avoid interrupting the process
    // TODO: Handle when the main error handler is implemented
  }
};
