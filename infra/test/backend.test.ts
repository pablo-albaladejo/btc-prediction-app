import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { BackendStack } from '../lib/backend-stack';

test('Lambda Function Created', () => {
  const app = new cdk.App();
  const stack = new BackendStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'index.handler',
    Runtime: 'nodejs20.x',
  });
});

test('API Gateway Created', () => {
  const app = new cdk.App();
  const stack = new BackendStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::ApiGateway::RestApi', {
    Name: 'BackendApi',
  });
});

test('Lambda Function has correct environment variables', () => {
  const app = new cdk.App();
  const stack = new BackendStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::Lambda::Function', {
    Environment: {
      Variables: {
        COINGECKO_API_URL: 'https://api.coingecko.com/api/v3/simple/price',
      },
    },
  });
});
