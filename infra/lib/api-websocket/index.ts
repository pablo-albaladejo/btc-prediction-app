import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ConnectionHandling } from './connectionHandling';
import { PriceBroadcasting } from './priceBroadcasting';
import { WebSocketApi } from './webSocketApi';
import { Policies } from './policies';

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

    new Policies(this, 'Policies', {
      broadcastPriceLambda: priceBroadcasting.broadcastPriceLambda,
      requestLatestPriceLambda: priceBroadcasting.requestLatestPriceLambda,
      webSocketApiId: webSocketApiConstruct.webSocketApi.apiId,
      webSocketStageName: webSocketApiConstruct.webSocketStage.stageName,
    });
  }
}
