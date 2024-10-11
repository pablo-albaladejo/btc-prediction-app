#!/bin/bash

echo "Installing dependencies"
npm  i

echo "Building packages folder"
cd packages/shared && npm run build && cd ../..

echo "Deploying BackendStack"
cd infra && npx cdk deploy BackendStack --require-approval never --outputs-file backend-output.json && cd ..

echo "Getting the value of WebSocketApiEndpoint"
FILE_PATH="./infra/backend-output.json"
websocket_api_endpoint=$(jq -r '.BackendStack.WebSocketApiEndpoint' "$FILE_PATH")

if [ -z "$websocket_api_endpoint" ]; then
  echo "Error: WebSocketApiEndpoint not found in $FILE_PATH"
  exit 1
else
  echo "The value of WebSocketApiEndpoint is: $websocket_api_endpoint"
fi

echo "Building frontend"
cd apps/frontend && REACT_APP_WEBSOCKET_API_ENDPOINT=$websocket_api_endpoint npm run build && cd ../..

echo "Deploying FrontendStack"
cd infra && npx cdk deploy FrontendStack --require-approval never  --outputs-file frontend-output.json && cd ..

echo "Getting the value of WebsiteURL"
FILE_PATH="./infra/frontend-output.json"
websocket_api_endpoint=$(jq -r '.FrontendStack.WebsiteURL' "$FILE_PATH")
echo "The value of WebsiteURL is: $websocket_api_endpoint"

echo "Deployment complete"