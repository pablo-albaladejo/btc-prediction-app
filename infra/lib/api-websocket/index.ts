import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ConnectionHandling } from './connectionHandling';
import * as apigatewayv2Authorizers from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import { Price } from './price';
import { WebSocketApi } from './webSocketApi';
import { Policies } from './policies';
import { UserScore } from './userScore';
import { Predictions } from './predictions';

interface ApiWebsocketProps {
  webSocketAuthorizer: apigatewayv2Authorizers.WebSocketLambdaAuthorizer;
}

export class ApiWebsocket extends Construct {
  webSocketApiEndpoint: string;
  constructor(scope: Construct, id: string, props: ApiWebsocketProps) {
    super(scope, id);

    const webSocketApiConstruct = new WebSocketApi(this, 'WebSocketApi');
    this.webSocketApiEndpoint = `${webSocketApiConstruct.webSocketApi.apiEndpoint}/${webSocketApiConstruct.webSocketStage.stageName}`;

    const connectionHandling = new ConnectionHandling(
      this,
      'ConnectionHandling',
      {
        authorizer: props.webSocketAuthorizer,
        webSocketApi: webSocketApiConstruct.webSocketApi,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    );

    const price = new Price(this, 'Price', {
      webSocketApi: webSocketApiConstruct.webSocketApi,
      connectionsTable: connectionHandling.connectionsTable,
      webSocketApiEndpoint: webSocketApiConstruct.webSocketApiEndpoint,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const userScore = new UserScore(this, 'UserScore', {
      webSocketApi: webSocketApiConstruct.webSocketApi,
      webSocketApiEndpoint: this.webSocketApiEndpoint,
      connectionsTable: connectionHandling.connectionsTable,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const predictions = new Predictions(this, 'Predictions', {
      webSocketApi: webSocketApiConstruct.webSocketApi,
      webSocketApiEndpoint: this.webSocketApiEndpoint,
      connectionsTable: connectionHandling.connectionsTable,
      priceTable: price.priceTable,
      scoreTable: userScore.scoreTable,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new Policies(this, 'Policies', {
      lamdas: [
        price.priceUpdateLambda,
        price.requestLatestPriceLambda,
        userScore.requestUserScoreLambda,
        predictions.submitPredictionLambda,
        predictions.evaluatePredictionsLambda,
        predictions.requestPredictionLambda,
      ],
      webSocketApiId: webSocketApiConstruct.webSocketApi.apiId,
      webSocketStageName: webSocketApiConstruct.webSocketStage.stageName,
    });
  }
}
