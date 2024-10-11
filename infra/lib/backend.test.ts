import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as Infrastructure from '../lib/backend-stack';

test('WebSocket API Created', () => {
  const app = new cdk.App();
  const stack = new Infrastructure.BackendStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::ApiGatewayV2::Api', {
    Name: 'WebSocketAPI',
  });
});
