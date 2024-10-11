#!/bin/bash

# Path to the JSON file
JSON_FILE="./infra/backend-output.json"

# Read values from the JSON using jq
USER_POOL_CLIENT_ID=$(jq -r '.BackendStack.UserPoolClientId' "$JSON_FILE")
USER_POOL_ID=$(jq -r '.BackendStack.UserPoolId' "$JSON_FILE")
IDENTITY_POOL_ID=$(jq -r '.BackendStack.IdentityPoolId' "$JSON_FILE")
WEBSOCKET_API_ENDPOINT=$(jq -r '.BackendStack.WebSocketApiEndpoint' "$JSON_FILE")
AWS_REGION="eu-west-1"

# Create the .env.local file with environment variables
cat <<EOL > apps/frontend/.env.local
REACT_APP_WEBSOCKET_API_ENDPOINT="$WEBSOCKET_API_ENDPOINT"
REACT_APP_AWS_REGION="$AWS_REGION"
REACT_APP_USER_POOL_ID="$USER_POOL_ID"
REACT_APP_USER_POOL_CLIENT_ID="$USER_POOL_CLIENT_ID"
REACT_APP_IDENTITY_POOL_ID="$IDENTITY_POOL_ID"
EOL

echo ".env.local generated successfully."
