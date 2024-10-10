import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApiWebsocket } from './api-websocket';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new ApiWebsocket(this, 'ApiWebsocket');
  }
}
