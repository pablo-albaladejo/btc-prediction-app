import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ConnectionHandling } from './connectionHandling';
import { Price } from './price';
import { WebSocketApi } from './webSocketApi';
import { Policies } from './policies';
import { UserScore } from './userScore';
import { Predictions } from './predictions';

export class ApiWebsocket extends Construct {
  webSocketApiEndpoint: string;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const webSocketApiConstruct = new WebSocketApi(this, 'WebSocketApi');
    this.webSocketApiEndpoint = `${webSocketApiConstruct.webSocketApi.apiEndpoint}/${webSocketApiConstruct.webSocketStage.stageName}`;

    const connectionHandling = new ConnectionHandling(
      this,
      'ConnectionHandling',
      {
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
