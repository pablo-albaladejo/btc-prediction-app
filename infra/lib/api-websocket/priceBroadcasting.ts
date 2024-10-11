import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayv2Integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';

export interface PriceBroadcastingProps {
  readonly webSocketApi: apigatewayv2.WebSocketApi;
  readonly connectionsTable: dynamodb.Table;
  readonly webSocketApiEndpoint: string;
  readonly removalPolicy?: cdk.RemovalPolicy;
}

export class PriceBroadcasting extends Construct {
  public readonly priceTable: dynamodb.Table;
  public readonly broadcastPriceLambda: lambdaNodejs.NodejsFunction;
  public readonly requestLatestPriceLambda: lambdaNodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: PriceBroadcastingProps) {
    super(scope, id);

    const removalPolicy = props.removalPolicy || cdk.RemovalPolicy.RETAIN;

    this.priceTable = new dynamodb.Table(this, 'PriceTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      tableName: 'LatestBTCPrice',
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: removalPolicy,
    });

    this.broadcastPriceLambda = new lambdaNodejs.NodejsFunction(
      this,
      'BroadcastPriceLambda',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        projectRoot: path.join(__dirname, '../../../'),
        entry: path.join(
          __dirname,
          '../../../apps/backend/src/websockets/broadcastBTCPrice.ts',
        ),
        environment: {
          CONNECTIONS_TABLE: props.connectionsTable.tableName,
          COINGECKO_API_URL: 'https://api.coingecko.com/api/v3/simple/price',
          WEBSOCKET_API_ENDPOINT: props.webSocketApiEndpoint,
          PRICE_TABLE: this.priceTable.tableName,
        },
      },
    );

    props.connectionsTable.grantReadData(this.broadcastPriceLambda);
    this.priceTable.grantWriteData(this.broadcastPriceLambda);

    this.requestLatestPriceLambda = new lambdaNodejs.NodejsFunction(
      this,
      'RequestLatestPriceLambda',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        projectRoot: path.join(__dirname, '../../../'),
        entry: path.join(
          __dirname,
          '../../../apps/backend/src/websockets/requestLatestPrice.ts',
        ),
        environment: {
          PRICE_TABLE: this.priceTable.tableName,
          WEBSOCKET_API_ENDPOINT: props.webSocketApiEndpoint,
        },
      },
    );

    this.priceTable.grantReadData(this.requestLatestPriceLambda);

    props.webSocketApi.addRoute('requestLatestPrice', {
      integration: new apigatewayv2Integrations.WebSocketLambdaIntegration(
        'RequestLatestPriceIntegration',
        this.requestLatestPriceLambda,
      ),
    });

    const rule = new events.Rule(this, 'BroadcastPriceRule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });

    rule.addTarget(new targets.LambdaFunction(this.broadcastPriceLambda));
  }
}
