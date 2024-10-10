import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

import { ApiEndpoint } from './api-endpoint';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new apigateway.RestApi(this, 'BackendApi');

    new ApiEndpoint(this, 'PriceEndpoint', {
      api,
      entry: path.join(
        __dirname,
        '../../apps/backend/src/handlers/getPrice/index.ts',
      ),
      environment: {
        COINGECKO_API_URL: 'https://api.coingecko.com/api/v3/simple/price',
      },
      resource: 'price',
      httpMethod: 'GET',
    });

    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: api.url,
      description: 'The URL of the API Gateway',
    });
  }
}
