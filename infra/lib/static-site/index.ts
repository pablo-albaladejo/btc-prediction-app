import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfront_origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

interface StaticSiteProps {
  assetsFolder: string;
}

export class StaticSite extends Construct {
  public readonly distribution: cloudfront.Distribution;
  constructor(scope: Construct, id: string, props: StaticSiteProps) {
    super(scope, id);

    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const oai = new cloudfront.OriginAccessIdentity(this, 'OAI');

    this.distribution = new cloudfront.Distribution(
      this,
      'WebsiteDistribution',
      {
        defaultBehavior: {
          origin: cloudfront_origins.S3BucketOrigin.withOriginAccessIdentity(
            websiteBucket,
            {
              originAccessIdentity: oai,
            },
          ),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        defaultRootObject: 'index.html',
      },
    );

    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset(props.assetsFolder)],
      destinationBucket: websiteBucket,
      distribution: this.distribution,
      distributionPaths: ['/*'],
    });
  }
}
