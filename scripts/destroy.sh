#!/bin/bash

cd infra

echo "Destroying FrontendStack"
npx cdk destroy FrontendStack --force --require-approval never

echo "Destroying BackendStack"
npx cdk destroy BackendStack --force --require-approval never