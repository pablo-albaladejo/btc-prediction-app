import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StaticSite } from './static-site';

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const staticSite = new StaticSite(this, 'StaticSite');

    new cdk.CfnOutput(this, 'WebsiteURL', {
      value: staticSite.distribution.distributionDomainName,
    });
  }
}
