import { APIGatewayProxyResult } from "aws-lambda";

export const createSuccessResponse = (
  message: string,
  data: object = {},
  statusCode: number = 200,
): APIGatewayProxyResult => {
  return {
    statusCode,
    body: JSON.stringify({
      status: "success",
      message,
      ...data,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};

export const createErrorResponse = (
  message: string,
  statusCode: number = 500,
): APIGatewayProxyResult => {
  return {
    statusCode,
    body: JSON.stringify({
      status: "error",
      message,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
