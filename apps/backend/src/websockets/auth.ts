import {
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerEvent,
} from "aws-lambda";

import { generateAllowPolicy, generateDenyPolicy } from "../utils/policy";
import { CognitoJwtVerifier } from "aws-jwt-verify";

export const cognitoJwtVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID!,
  tokenUse: "access",
  clientId: process.env.COGNITO_USER_POOL_CLIENT_ID!,
});

export const handler = async (
  event: APIGatewayRequestAuthorizerEvent,
): Promise<APIGatewayAuthorizerResult> => {
  const token = event.queryStringParameters?.Authorization;

  if (!token) {
    return generateDenyPolicy("user", event.methodArn);
  }

  try {
    const payload = await cognitoJwtVerifier.verify(token);
    const userUUID = payload.sub;
    const result = generateAllowPolicy(userUUID, event.methodArn, { userUUID });
    return result;
  } catch {
    return generateDenyPolicy("user", event.methodArn);
  }
};
