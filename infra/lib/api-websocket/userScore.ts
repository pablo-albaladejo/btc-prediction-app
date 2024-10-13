import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayv2integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as path from 'path';

export interface UserScoreProps {
  readonly webSocketApi: apigatewayv2.WebSocketApi;
  readonly webSocketApiEndpoint: string;
  readonly connectionsTable: dynamodb.Table;
  readonly removalPolicy?: cdk.RemovalPolicy;
}

export class UserScore extends Construct {
  public readonly scoreTable: dynamodb.Table;
  public readonly requestUserScoreLambda: lambdaNodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: UserScoreProps) {
    super(scope, id);

    this.scoreTable = new dynamodb.Table(this, 'ScoreTable', {
      tableName: 'UserScores',
      partitionKey: { name: 'userUUID', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: props.removalPolicy || cdk.RemovalPolicy.RETAIN,
    });

    this.requestUserScoreLambda = new lambdaNodejs.NodejsFunction(
      this,
      'RequestUserScoreLambda',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        projectRoot: path.join(__dirname, '../../../'),
        entry: path.join(
          __dirname,
          '../../../apps/backend/src/websockets/requestUserScore.ts',
        ),
        environment: {
          SCORE_TABLE: this.scoreTable.tableName,
          WEBSOCKET_API_ENDPOINT: props.webSocketApiEndpoint,
        },
      },
    );
    this.scoreTable.grantReadData(this.requestUserScoreLambda);

    props.webSocketApi.addRoute('requestUserScore', {
      integration: new apigatewayv2integrations.WebSocketLambdaIntegration(
        'RequestUserScoreIntegration',
        this.requestUserScoreLambda,
      ),
    });
  }
}
