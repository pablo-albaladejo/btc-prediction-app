import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as Infrastructure from '../lib/frontend-stack';

test('CloudFront Distribution Created', () => {
  const app = new cdk.App();
  const stack = new Infrastructure.FrontendStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::CloudFront::Distribution', {});
});
