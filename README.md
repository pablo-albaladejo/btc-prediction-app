# BTC Prediction App

## General Description

The **BTC Prediction App** is a multiplayer, multi-session, and multi-platform game where users predict the future price movement of Bitcoin (BTC). Developed using modern technologies like TypeScript, Node.js, Vite, and AWS CDK, the application provides real-time updates and a seamless user experience.

**Key Features:**

- **Real-time BTC price updates.**
- **User predictions of BTC price movement ("Up" or "Down").**
- **Score tracking based on prediction accuracy.**
- **Persistent user sessions with AWS Cognito.**
- **WebSocket implementation for real-time communication.**

**Technologies Used:**

- **Frontend:** React, Vite, styled-components, Amplify, Storybook.
- **Backend:** Node.js, AWS Lambda, WebSocket API, DynamoDB.
- **Infrastructure:** AWS CDK, CloudFront, CloudWatch, Cognito.


## Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Infrastructure](#infrastructure)
- [Scripts](#scripts)
- [Testing](#testing)
- [App Functionality](#app-functionality)
- [TODO](#todo)
  - [Infrastructure](#infrastructure-1)
  - [Frontend](#frontend-1)
  - [Backend](#backend-1)
- [Contributing](#contributing)
- [License](#license)

## Project Structure

This project follows a monorepo structure based on [TurboRepo](https://turbo.build/).

- **apps/frontend/**: Frontend application built with [Vite](https://vitejs.dev/).
- **apps/backend/**: Backend application built with [Node.js](https://nodejs.org/).
- **infra/**: Infrastructure definition using [AWS CDK](https://aws.amazon.com/cdk/).
- **packages/**: Shared libraries between applications.
- **scripts/**: Automation scripts.
- **.github/**: GitHub Actions workflows for CI/CD. The project is automatically deployed on AWS, updating on every commit or PR to the main branch.

## Prerequisites

- **[Node.js](https://nodejs.org/)**
- **[npm](https://www.npmjs.com/)**
- **[Docker](https://www.docker.com/)**
- **[AWS CDK](https://aws.amazon.com/cdk/)**
- **AWS Account** (required for deployment with CDK)
- **AWS CLI v2** installed and configured. Use `AWS_PROFILE` for different profiles (see [AWS documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html)).

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/pablo-albaladejo/btc-prediction-app.git
   cd btc-prediction-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   - Copy the example environment file and adjust as necessary:

     ```bash
     cp apps/frontend/.env.example apps/frontend/.env.local
     ```

   - If you do not have access to the already deployed infrastructure, proceed to the [Deployment](#scripts) step to deploy it.

## Usage

### Frontend

The frontend is developed with React (latest version), Vite, styled-components, and uses AWS Amplify for connection to Cognito. It follows an architecture of components, containers, pages, themes, and contexts.

**How to Run:**

1. **Navigate to the frontend directory:**

   ```bash
   cd apps/frontend
   ```

2. **Start the frontend application:**

   ```bash
   npm run dev
   ```

3. **Access the application:**

   Open your browser and navigate to the URL provided by the Vite development server (usually `http://localhost:3000`).

4. **User Account:**

   - You will need a user account to log in.
   - If you do not have one, you can create a new account on the main screen.

5. **Run Storybook (Optional):**

   - To view and develop UI components in isolation:

     ```bash
     npm run storybook
     ```

   - For more information, see the [Storybook documentation](https://storybook.js.org/docs/react/get-started/introduction).

### Backend

The backend consists of Node.js functions used as AWS Lambda functions. They are designed to be agnostic and could be used in other serverless frameworks or as routes in Express, etc.

**Note:** The backend functions cannot be executed directly. To test their isolated behavior, run the tests:

```bash
cd apps/backend
npm run test
```

### Infrastructure

The infrastructure is defined using AWS CDK, with two main stacks:

- **Frontend Stack:**

  - Consists of custom constructs to host the static files of Vite and Storybook on AWS CloudFront.

- **Backend Stack:**

  - Defines the WebSocket API and the endpoints exposed to it.
  - Endpoints are grouped into constructs of related infrastructure elements.
  - Applies the principle of least privilege to each resource.
  - Includes authentication using AWS Cognito.

**Deployment and Infrastructure Management:** See the [Scripts](#scripts) section for deployment instructions.

## Scripts

Automation scripts are provided to help with common tasks:

- **Deploy:** Create the necessary infrastructure to support the application.

  ```bash
  ./scripts/deploy.sh
  ```

  *Note:* Running this script will create resources in your AWS account, which may incur costs.

- **Destroy:** Delete all the infrastructure created by the deploy script.

  ```bash
  ./scripts/destroy.sh
  ```

  *Warning:* No backups are kept, and no information is saved.

- **Generate Local Environment Variables:** Generate the local environment variables file for the frontend after deploying the infrastructure.

  ```bash
  ./scripts/generateLocalEnv.sh
  ```

## Testing

### Frontend Tests

To run the frontend tests:

```bash
cd apps/frontend
npm run test
```

### Backend Tests

To run the backend tests:

```bash
cd apps/backend
npm run test
```

*Note:* Ensure that any necessary mock services or environment variables are configured for the tests.

## App Functionality

### User Flow

1. **View Current BTC Price and Score:**

   - Upon logging in, users can see the latest BTC price in USD and their current score.

2. **Make a Prediction:**

   - Users can choose to predict whether the BTC price will go **"Up"** or **"Down"**.

3. **Prediction Rules:**

   - After making a prediction, users cannot make another guess until the existing guess is resolved.
   - A prediction is resolved when the price changes and at least 60 seconds have passed since the guess was made.
   - If the guess is correct (e.g., predicted "Up" and the price went higher), the user gains 1 point.
   - If the guess is incorrect, the user loses 1 point.
   - New players start with a score of 0.

4. **Multi-Session Support:**

   - Users can close their browser and return later to see their score and continue making guesses.

### Technical Details

- **Real-Time Price Updates:**

  - Uses the [CoinGecko API](https://api.coingecko.com/api/v3/simple/price) to obtain the BTC price in real-time.
  - The price is cached once per minute in a DynamoDB table to reduce API calls.

- **WebSocket Communication:**

  - Implements WebSocket API for real-time communication between the client and server.
  - AWS Lambda functions handle WebSocket connections and messages.

- **Data Persistence:**

  - User scores and predictions are stored in DynamoDB.
  - AWS Cognito manages user authentication and session management.

- **Infrastructure:**

  - The application uses AWS services such as Lambda, DynamoDB, API Gateway, CloudFront, CloudWatch, and Cognito.
  - The infrastructure is defined and managed using AWS CDK.

## TODO

As the project is under active development, the following tasks are planned:

### Infrastructure

- **Local Emulation:**

  - Emulate architecture components locally with [LocalStack](https://localstack.cloud/).
  - Emulate DynamoDB for tests using [dynamodb-local](https://github.com/rynop/dynamodb-local).

- **Testing and Simulation:**

  - Define test suites with [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) to simulate local invocation of Lambdas.

- **Improve Decoupling:**

  - Use [DynamoDB Streams](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html) to decouple dependencies between Lambdas.

- **Enhancements:**

  - Implement error management, environment variable control, and monitoring.


### Frontend

- **Interface Emulation:**

  - Investigate [Mock Service Worker (MSW)](https://mswjs.io/) to emulate interfaces for testing.
  - Explore solutions for WebSocket support in mocks.

### Backend

- **Testing and Coverage:**

  - Increase test coverage and focus on stricter typing of functions.
  - Improve error handling mechanisms.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or suggestions.

## License

This project is licensed under the [MIT License](LICENSE).