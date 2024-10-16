import {
  APIGatewayAuthorizerResult,
  APIGatewayAuthorizerResultContext,
} from "aws-lambda";

// https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html

const generatePolicy = (
  principalId: string,
  effect: "Allow" | "Deny",
  resource: string,
  context?: APIGatewayAuthorizerResultContext,
): APIGatewayAuthorizerResult => ({
  context,
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resource,
      },
    ],
  },
  principalId,
});

export const generateAllowPolicy = (
  principalId: string,
  resource: string,
  context?: APIGatewayAuthorizerResultContext,
): APIGatewayAuthorizerResult =>
  generatePolicy(principalId, "Allow", resource, context);

export const generateDenyPolicy = (
  principalId: string,
  resource: string,
  context?: APIGatewayAuthorizerResultContext,
): APIGatewayAuthorizerResult =>
  generatePolicy(principalId, "Deny", resource, context);
