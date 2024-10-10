import { dynamoDB } from "../utils/awsClients";

const CONNECTIONS_TABLE = process.env.CONNECTIONS_TABLE!;

export interface Connection {
  connectionId: string;
}

export const getAllConnections = async (): Promise<Connection[]> => {
  const params = {
    TableName: CONNECTIONS_TABLE,
    ProjectionExpression: "connectionId",
  };

  try {
    const result = await dynamoDB.scan(params).promise();
    return result.Items as Connection[];
  } catch {
    throw new Error("Error getting connections");
  }
};

export const saveConnection = async (connectionId: string): Promise<void> => {
  const params = {
    TableName: CONNECTIONS_TABLE,
    Item: {
      connectionId: connectionId,
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
