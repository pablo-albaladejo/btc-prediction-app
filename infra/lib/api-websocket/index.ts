import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ConnectionHandling } from './connectionHandling';
import { PriceBroadcasting } from './priceBroadcasting';
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

    const priceBroadcasting = new PriceBroadcasting(this, 'PriceBroadcasting', {
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
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new Policies(this, 'Policies', {
      lamdas: [
        priceBroadcasting.broadcastPriceLambda,
        priceBroadcasting.requestLatestPriceLambda,
        userScore.requestUserScoreLambda,
        userScore.updateUserScoreLambda,
        predictions.submitPredictionLambda,
        predictions.evaluatePredictionsLambda,
        predictions.requestPendingPredictionLambda,
      ],
      webSocketApiId: webSocketApiConstruct.webSocketApi.apiId,
      webSocketStageName: webSocketApiConstruct.webSocketStage.stageName,
    });
  }
}
