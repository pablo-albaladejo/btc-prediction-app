import { APIGatewayProxyEventV2 } from "aws-lambda";

interface WebSocketConnectEvent
  extends Omit<APIGatewayProxyEventV2, "requestContext"> {
  requestContext: {
    connectionId: string;
  } & APIGatewayProxyEventV2["requestContext"];
}
export default WebSocketConnectEvent;
