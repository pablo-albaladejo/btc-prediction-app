import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayv2Integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export class ApiWebsocket extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const connectionsTable = new dynamodb.Table(this, 'ConnectionsTable', {
      partitionKey: {
        name: 'connectionId',
        type: dynamodb.AttributeType.STRING,
      },
      tableName: 'WebSocketConnections',
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const priceTable = new dynamodb.Table(this, 'PriceTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      tableName: 'LatestBTCPrice',
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const connectHandler = new lambdaNodejs.NodejsFunction(
      this,
      'ConnectHandler',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        projectRoot: path.join(__dirname, '../../../'),
        entry: path.join(
          __dirname,
          '../../../apps/backend/src/websockets/connect.ts',
        ),
        environment: {
          CONNECTIONS_TABLE: connectionsTable.tableName,
        },
      },
    );

    const disconnectHandler = new lambdaNodejs.NodejsFunction(
      this,
      'DisconnectHandler',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(
          __dirname,
          '../../../apps/backend/src/websockets/disconnect.ts',
        ),
        projectRoot: path.join(__dirname, '../../../'),
        environment: {
          CONNECTIONS_TABLE: connectionsTable.tableName,
        },
      },
    );

    connectionsTable.grantReadWriteData(connectHandler);
    connectionsTable.grantReadWriteData(disconnectHandler);

    const broadcastPriceLambda = new lambdaNodejs.NodejsFunction(
      this,
      'BroadcastPriceLambda',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(
          __dirname,
          '../../../apps/backend/src/websockets/broadcastBTCPrice.ts',
        ),
        projectRoot: path.join(__dirname, '../../../'),
        environment: {
          CONNECTIONS_TABLE: connectionsTable.tableName,
          COINGECKO_API_URL: 'https://api.coingecko.com/api/v3/simple/price',
          WEBSOCKET_API_ENDPOINT: '',
          PRICE_TABLE: priceTable.tableName,
        },
      },
    );

    connectionsTable.grantReadData(broadcastPriceLambda);
    priceTable.grantWriteData(broadcastPriceLambda);

    const requestLatestPriceLambda = new lambdaNodejs.NodejsFunction(
      this,
      'RequestLatestPriceLambda',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(
          __dirname,
          '../../../apps/backend/src/websockets/requestLatestPrice.ts',
        ),
        projectRoot: path.join(__dirname, '../../../'),
        environment: {
          PRICE_TABLE: priceTable.tableName,
          WEBSOCKET_API_ENDPOINT: '',
        },
      },
    );
    priceTable.grantReadData(requestLatestPriceLambda);

    const webSocketApi = new apigatewayv2.WebSocketApi(this, 'WebSocketAPI', {
      connectRouteOptions: {
        integration: new apigatewayv2Integrations.WebSocketLambdaIntegration(
          'ConnectIntegration',
          connectHandler,
        ),
      },
      disconnectRouteOptions: {
        integration: new apigatewayv2Integrations.WebSocketLambdaIntegration(
          'DisconnectIntegration',
          disconnectHandler,
        ),
      },
    });

    webSocketApi.addRoute('requestLatestPrice', {
      integration: new apigatewayv2Integrations.WebSocketLambdaIntegration(
        'RequestLatestPriceIntegration',
        requestLatestPriceLambda,
      ),
    });

    const webSocketStage = new apigatewayv2.WebSocketStage(
      this,
      'WebSocketStage',
      {
        webSocketApi,
        stageName: 'prod',
        autoDeploy: true,
      },
    );

    const webSocketApiEndpoint = `${webSocketApi.apiEndpoint}/${webSocketStage.stageName}`;

    broadcastPriceLambda.addEnvironment(
      'WEBSOCKET_API_ENDPOINT',
      webSocketApiEndpoint,
    );

    requestLatestPriceLambda.addEnvironment(
      'WEBSOCKET_API_ENDPOINT',
      webSocketApiEndpoint,
    );

    const policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['execute-api:ManageConnections'],
      resources: [
        `arn:aws:execute-api:${cdk.Stack.of(this).region}:${cdk.Stack.of(this).account}:${webSocketApi.apiId}/${webSocketStage.stageName}/POST/@connections/*`,
      ],
    });

    broadcastPriceLambda.addToRolePolicy(policy);
    requestLatestPriceLambda.addToRolePolicy(policy);

    const rule = new events.Rule(this, 'BroadcastPriceRule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });

    rule.addTarget(new targets.LambdaFunction(broadcastPriceLambda));
  }
}
