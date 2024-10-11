import { Construct } from 'constructs';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';

export class WebSocketApi extends Construct {
  public readonly webSocketApi: apigatewayv2.WebSocketApi;
  public readonly webSocketStage: apigatewayv2.WebSocketStage;
  public readonly webSocketApiEndpoint: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.webSocketApi = new apigatewayv2.WebSocketApi(this, 'WebSocketAPI');

    this.webSocketStage = new apigatewayv2.WebSocketStage(
      this,
      'WebSocketStage',
      {
        webSocketApi: this.webSocketApi,
        stageName: 'prod',
        autoDeploy: true,
      },
    );

    this.webSocketApiEndpoint = `${this.webSocketApi.apiEndpoint}/${this.webSocketStage.stageName}`;
  }
}
