import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cdk from 'aws-cdk-lib';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayv2Integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as path from 'path';
import * as apigatewayv2Authorizers from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export interface ConnectionHandlingProps {
  readonly authorizer: apigatewayv2Authorizers.WebSocketLambdaAuthorizer;
  readonly webSocketApi: apigatewayv2.WebSocketApi;
  readonly removalPolicy?: cdk.RemovalPolicy;
}

export class ConnectionHandling extends Construct {
  public readonly connectionsTable: dynamodb.Table;
  public readonly connectHandler: lambdaNodejs.NodejsFunction;
  public readonly disconnectHandler: lambdaNodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: ConnectionHandlingProps) {
    super(scope, id);

    const removalPolicy = props.removalPolicy || cdk.RemovalPolicy.RETAIN;

    this.connectionsTable = new dynamodb.Table(this, 'ConnectionsTable', {
      partitionKey: {
        name: 'connectionId',
        type: dynamodb.AttributeType.STRING,
      },
      tableName: 'WebSocketConnections',
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: removalPolicy,
    });
    this.connectionsTable.addGlobalSecondaryIndex({
      indexName: 'UserUUIDIndex',
      partitionKey: {
        name: 'userUUID',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    this.connectHandler = new lambdaNodejs.NodejsFunction(
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
          CONNECTIONS_TABLE: this.connectionsTable.tableName,
        },
      },
    );

    this.disconnectHandler = new lambdaNodejs.NodejsFunction(
      this,
      'DisconnectHandler',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        projectRoot: path.join(__dirname, '../../../'),
        entry: path.join(
          __dirname,
          '../../../apps/backend/src/websockets/disconnect.ts',
        ),
        environment: {
          CONNECTIONS_TABLE: this.connectionsTable.tableName,
        },
      },
    );

    this.connectionsTable.grantReadWriteData(this.connectHandler);
    this.connectionsTable.grantReadWriteData(this.disconnectHandler);

    props.webSocketApi.addRoute('$connect', {
      integration: new apigatewayv2Integrations.WebSocketLambdaIntegration(
        'ConnectIntegration',
        this.connectHandler,
      ),
      authorizer: props.authorizer,
    });

    props.webSocketApi.addRoute('$disconnect', {
      integration: new apigatewayv2Integrations.WebSocketLambdaIntegration(
        'DisconnectIntegration',
        this.disconnectHandler,
      ),
    });
  }
}
