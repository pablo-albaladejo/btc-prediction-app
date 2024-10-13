import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StaticSite } from './static-site';

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const staticSite = new StaticSite(this, 'StaticSite', {
      assetsFolder: '../apps/frontend/dist',
    });

    new cdk.CfnOutput(this, 'WebsiteURL', {
      value: staticSite.distribution.distributionDomainName,
    });

    const storybookSite = new StaticSite(this, 'StorybookSite', {
      assetsFolder: '../apps/frontend/storybook-static',
    });

    new cdk.CfnOutput(this, 'StorybookURL', {
      value: storybookSite.distribution.distributionDomainName,
    });
  }
}
