import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';

export interface PoliciesProps {
  readonly broadcastPriceLambda: lambda.IFunction;
  readonly requestLatestPriceLambda: lambda.IFunction;
  readonly requestUserScoreLambda: lambda.IFunction;
  readonly updateUserScoreLambda: lambda.IFunction;
  readonly webSocketApiId: string;
  readonly webSocketStageName: string;
}

export class Policies extends Construct {
  constructor(scope: Construct, id: string, props: PoliciesProps) {
    super(scope, id);

    const manageConnectionsPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['execute-api:ManageConnections'],
      resources: [
        `arn:aws:execute-api:${cdk.Stack.of(this).region}:${cdk.Stack.of(this).account}:${props.webSocketApiId}/${props.webSocketStageName}/POST/@connections/*`,
      ],
    });

    props.broadcastPriceLambda.addToRolePolicy(manageConnectionsPolicy);
    props.requestLatestPriceLambda.addToRolePolicy(manageConnectionsPolicy);
    props.requestUserScoreLambda.addToRolePolicy(manageConnectionsPolicy);
    props.updateUserScoreLambda.addToRolePolicy(manageConnectionsPolicy);
  }
}
