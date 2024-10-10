import { Construct } from 'constructs';
import * as lambda_nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { IRestApi } from 'aws-cdk-lib/aws-apigateway';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

interface ApiEndpointProps {
  api: IRestApi;
  entry: string;
  environment: Record<string, string>;
  resource: string;
  httpMethod: string;
}
export class ApiEndpoint extends Construct {
  constructor(scope: Construct, id: string, props: ApiEndpointProps) {
    super(scope, id);

    const endpointLambda = new lambda_nodejs.NodejsFunction(
      this,
      `${id}Function`,
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        projectRoot: path.join(__dirname, '../../../'),
        entry: props.entry,
        environment: props.environment,
      },
    );

    const resource = props.api.root.addResource(props.resource);
    resource.addMethod(
      props.httpMethod,
      new apigateway.LambdaIntegration(endpointLambda),
    );
  }
}
