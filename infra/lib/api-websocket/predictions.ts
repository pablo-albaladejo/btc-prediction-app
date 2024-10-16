import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayv2integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as path from 'path';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';

export interface PredictionsProps {
  readonly webSocketApi: apigatewayv2.WebSocketApi;
  readonly webSocketApiEndpoint: string;
  readonly connectionsTable: dynamodb.Table;
  readonly priceTable: dynamodb.Table;
  readonly scoreTable: dynamodb.Table;
  readonly removalPolicy?: cdk.RemovalPolicy;
}

export class Predictions extends Construct {
  public readonly predictionsTable: dynamodb.Table;
  public readonly submitPredictionLambda: lambdaNodejs.NodejsFunction;
  public readonly evaluatePredictionsLambda: lambdaNodejs.NodejsFunction;
  public readonly requestPredictionLambda: lambdaNodejs.NodejsFunction;

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
          CONNECTIONS_TABLE: props.connectionsTable.tableName,
          WEBSOCKET_API_ENDPOINT: props.webSocketApiEndpoint,
        },
      },
    );

    this.predictionsTable.grantReadWriteData(this.submitPredictionLambda);
    props.connectionsTable.grantReadData(this.submitPredictionLambda);

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
        timeout: cdk.Duration.minutes(5),
        entry: path.join(
          __dirname,
          '../../../apps/backend/src/websockets/evaluatePredictions.ts',
        ),
        environment: {
          PREDICTIONS_TABLE: this.predictionsTable.tableName,
          CONNECTIONS_TABLE: props.connectionsTable.tableName,
          WEBSOCKET_API_ENDPOINT: props.webSocketApiEndpoint,
          PRICE_TABLE: props.priceTable.tableName,
          SCORE_TABLE: props.scoreTable.tableName,
        },
      },
    );

    this.predictionsTable.grantReadWriteData(this.evaluatePredictionsLambda);
    props.connectionsTable.grantReadData(this.evaluatePredictionsLambda);
    props.priceTable.grantReadData(this.evaluatePredictionsLambda);
    props.scoreTable.grantReadWriteData(this.evaluatePredictionsLambda);

    const rule = new events.Rule(this, 'EvaluatePredictionsRule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });
    rule.addTarget(new targets.LambdaFunction(this.evaluatePredictionsLambda));

    this.requestPredictionLambda = new lambdaNodejs.NodejsFunction(
      this,
      'requestPredictionLambda',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        projectRoot: path.join(__dirname, '../../../'),
        entry: path.join(
          __dirname,
          '../../../apps/backend/src/websockets/requestPrediction.ts',
        ),
        environment: {
          PREDICTIONS_TABLE: this.predictionsTable.tableName,
          WEBSOCKET_API_ENDPOINT: props.webSocketApiEndpoint,
        },
      },
    );

    this.predictionsTable.grantReadData(this.requestPredictionLambda);

    props.webSocketApi.addRoute('requestPrediction', {
      integration: new apigatewayv2integrations.WebSocketLambdaIntegration(
        'RequestPredictionIntegration',
        this.requestPredictionLambda,
      ),
    });
  }
}
