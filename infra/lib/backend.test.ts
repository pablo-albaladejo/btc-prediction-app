import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { BackendStack } from './backend-stack';
import { ApiWebsocket } from './api-websocket';

// Mock the ApiWebsocket class
jest.mock('./api-websocket');

describe('BackendStack', () => {
  let app: cdk.App;

  beforeEach(() => {
    app = new cdk.App();
  });

  it('should create the stack successfully', () => {
    const stack = new BackendStack(app, 'TestStack');
    const template = Template.fromStack(stack);

    expect(template).toBeDefined();
  });

  it('should instantiate ApiWebsocket with correct parameters', () => {
    new BackendStack(app, 'TestStack');

    expect(ApiWebsocket).toHaveBeenCalledWith(
      expect.any(BackendStack),
      'ApiWebsocket',
    );
  });
});
