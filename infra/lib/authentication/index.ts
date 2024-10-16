import { Construct } from 'constructs';
import { RemovalPolicy } from 'aws-cdk-lib';

import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';
import * as apigatewayv2Authorizers from 'aws-cdk-lib/aws-apigatewayv2-authorizers';

export class Authentication extends Construct {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;
  public readonly identityPool: cognito.CfnIdentityPool;
  public readonly webSocketAuthorizer: apigatewayv2Authorizers.WebSocketLambdaAuthorizer;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const preSignUpFunction = new lambdaNodejs.NodejsFunction(
      this,
      'PreSignUpLambda',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        projectRoot: path.join(__dirname, '../../../'),
        entry: path.join(
          __dirname,
          '../../../apps/backend/src/authentication/preSignUp.ts',
        ),
      },
    );

    this.userPool = new cognito.UserPool(this, 'UserPool', {
      selfSignUpEnabled: true,
      signInAliases: { username: true },
      autoVerify: {
        email: false,
        phone: false,
      },
      lambdaTriggers: {
        preSignUp: preSignUpFunction,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool: this.userPool,
    });

    this.identityPool = new cognito.CfnIdentityPool(this, 'IdentityPool', {
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: this.userPoolClient.userPoolClientId,
          providerName: this.userPool.userPoolProviderName,
        },
      ],
    });

    const authenticatedRole = new iam.Role(
      this,
      'CognitoDefaultAuthenticatedRole',
      {
        assumedBy: new iam.FederatedPrincipal(
          'cognito-identity.amazonaws.com',
          {
            StringEquals: {
              'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
            },
            'ForAnyValue:StringLike': {
              'cognito-identity.amazonaws.com:amr': 'authenticated',
            },
          },
          'sts:AssumeRoleWithWebIdentity',
        ),
      },
    );

    authenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['cognito-sync:*'],
        resources: ['*'],
      }),
    );

    new cognito.CfnIdentityPoolRoleAttachment(
      this,
      'IdentityPoolRoleAttachment',
      {
        identityPoolId: this.identityPool.ref,
        roles: {
          authenticated: authenticatedRole.roleArn,
        },
      },
    );

    const websocketAuthFunction = new lambdaNodejs.NodejsFunction(
      this,
      'WebSocketAuthLambda',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        projectRoot: path.join(__dirname, '../../../'),
        entry: path.join(
          __dirname,
          '../../../apps/backend/src/websockets/auth.ts',
        ),
        environment: {
          COGNITO_USER_POOL_ID: this.userPool.userPoolId,
          COGNITO_USER_POOL_CLIENT_ID: this.userPoolClient.userPoolClientId,
        },
      },
    );

    websocketAuthFunction.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['cognito-idp:List*', 'cognito-idp:Describe*'],
        resources: [this.userPool.userPoolArn],
      }),
    );

    this.webSocketAuthorizer =
      new apigatewayv2Authorizers.WebSocketLambdaAuthorizer(
        'WebSocketAuthorizer',
        websocketAuthFunction,
        {
          identitySource: ['route.request.querystring.Authorization'],
        },
      );
  }
}
