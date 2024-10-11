import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApiWebsocket } from './api-websocket';
import { Authentication } from './authentication';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const apiWebsocket = new ApiWebsocket(this, 'ApiWebsocket');
    new cdk.CfnOutput(this, 'WebSocketApiEndpoint', {
      value: apiWebsocket.webSocketApiEndpoint,
      description: 'The endpoint of the WebSocket API',
      exportName: 'webSocketApiEndpoint',
    });

    const auth = new Authentication(this, 'Authentication');
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: auth.userPool.userPoolId,
      description: 'The ID of the user pool',
      exportName: 'userPoolId',
    });
    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: auth.userPoolClient.userPoolClientId,
      description: 'The ID of the user pool client',
      exportName: 'userPoolClientId',
    });
    new cdk.CfnOutput(this, 'IdentityPoolId', {
      value: auth.identityPool.ref,
      description: 'The ID of the identity pool',
      exportName: 'identityPoolId',
    });
  }
}
