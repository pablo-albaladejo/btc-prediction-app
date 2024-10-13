import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayv2integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as path from 'path';

export interface PredictionsProps {
  readonly webSocketApi: apigatewayv2.WebSocketApi;
  readonly webSocketApiEndpoint: string;
  readonly connectionsTable: dynamodb.Table;
  readonly removalPolicy?: cdk.RemovalPolicy;
}

export class Predictions extends Construct {
  public readonly predictionsTable: dynamodb.Table;
  public readonly submitPredictionLambda: lambdaNodejs.NodejsFunction;
  public readonly evaluatePredictionsLambda: lambdaNodejs.NodejsFunction;
  public readonly requestPendingPredictionLambda: lambdaNodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: PredictionsProps) {
    super(scope, id);

    this.predictionsTable = new dynamodb.Table(this, 'PredictionsTable', {
      tableName: 'UserPredictions',
      partitionKey: { name: 'userUUID', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.NUMBER },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: props.removalPolicy || cdk.RemovalPolicy.RETAIN,
    });

    this.submitPredictionLambda = new lambdaNodejs.NodejsFunction(
      this,
      'SubmitPredictionLambda',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        projectRoot: path.join(__dirname, '../../../'),
        entry: path.join(
          __dirname,
          '../../../apps/backend/src/websockets/submitPrediction.ts',
        ),
        environment: {
          PREDICTIONS_TABLE: this.predictionsTable.tableName,
        },
      },
    );

    this.predictionsTable.grantReadWriteData(this.submitPredictionLambda);

    props.webSocketApi.addRoute('submitPrediction', {
      integration: new apigatewayv2integrations.WebSocketLambdaIntegration(
        'SubmitPredictionIntegration',
        this.submitPredictionLambda,
      ),
    });

    this.evaluatePredictionsLambda = new lambdaNodejs.NodejsFunction(
      this,
      'EvaluatePredictionsLambda',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        projectRoot: path.join(__dirname, '../../../'),
        entry: path.join(
          __dirname,
          '../../../apps/backend/src/websockets/evaluatePredictions.ts',
        ),
        environment: {
          PREDICTIONS_TABLE: this.predictionsTable.tableName,
          CONNECTIONS_TABLE: props.connectionsTable.tableName,
        },
      },
    );

    this.predictionsTable.grantReadWriteData(this.evaluatePredictionsLambda);
    props.connectionsTable.grantReadData(this.evaluatePredictionsLambda);

    this.requestPendingPredictionLambda = new lambdaNodejs.NodejsFunction(
      this,
      'requestPendingPredictionLambda',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        projectRoot: path.join(__dirname, '../../../'),
        entry: path.join(
          __dirname,
          '../../../apps/backend/src/websockets/requestPendingPrediction.ts',
        ),
        environment: {
          PREDICTIONS_TABLE: this.predictionsTable.tableName,
          WEBSOCKET_API_ENDPOINT: props.webSocketApiEndpoint,
        },
      },
    );

    this.predictionsTable.grantReadData(this.requestPendingPredictionLambda);

    props.webSocketApi.addRoute('requestPendingPrediction', {
      integration: new apigatewayv2integrations.WebSocketLambdaIntegration(
        'RequestPredictionIntegration',
        this.requestPendingPredictionLambda,
      ),
    });
  }
}
