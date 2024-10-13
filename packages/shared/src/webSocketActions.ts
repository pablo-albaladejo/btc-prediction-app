import { PredictionDirection } from "./enums";

export enum WebSocketAction {
  updatePrice = "updatePrice",
  updateLeaderboard = "updateLeaderboard",
  requestLatestPrice = "requestLatestPrice",
  requestUserScore = "requestUserScore",
  requestPrediction = "requestPrediction",
  updateUserScore = "updateUserScore",
  updatePrediction = "updatePrediction",
  submitPrediction = "submitPrediction",
}

export interface WebSocketMessageBase {
  action: WebSocketAction;
}

export type MessagePayload<T extends WebSocketMessageBase> = Omit<T, "action">;

export interface UpdatePriceMessage extends WebSocketMessageBase {
  action: WebSocketAction.updatePrice;
  price: number;
}

export interface UpdateLeaderboardMessage extends WebSocketMessageBase {
  action: WebSocketAction.updateLeaderboard;
  leaderboard: Array<{ username: string; score: number }>;
}

export interface RequestLatestPriceMessage extends WebSocketMessageBase {
  action: WebSocketAction.requestLatestPrice;
}

export interface RequestUserScoreMessage extends WebSocketMessageBase {
  action: WebSocketAction.requestUserScore;
  userUUID: string;
}

export interface UpdateUserScoreMessage extends WebSocketMessageBase {
  action: WebSocketAction.updateUserScore;
  score: number;
}

export interface UpdatePredictionMessage extends WebSocketMessageBase {
  action: WebSocketAction.updatePrediction;
  prediction: PredictionDirection;
}

export interface SubmitPredictionMessage extends WebSocketMessageBase {
  action: WebSocketAction.submitPrediction;
  prediction: PredictionDirection;
}

export interface RequestPredictionMessage extends WebSocketMessageBase {
  action: WebSocketAction.requestPrediction;
  userUUID: string;
}

export type WebSocketMessage =
  | UpdatePriceMessage
  | UpdateLeaderboardMessage
  | RequestLatestPriceMessage
  | RequestUserScoreMessage
  | UpdateUserScoreMessage
  | RequestPredictionMessage
  | SubmitPredictionMessage
  | UpdatePredictionMessage;

export const createUpdatePriceMessage = (
  payload: MessagePayload<UpdatePriceMessage>,
): UpdatePriceMessage => {
  return {
    action: WebSocketAction.updatePrice,
    ...payload,
  };
};

export const createUpdateLeaderboardMessage = (
  payload: MessagePayload<UpdateLeaderboardMessage>,
): UpdateLeaderboardMessage => {
  return {
    action: WebSocketAction.updateLeaderboard,
    ...payload,
  };
};

export const createRequestLatestPriceMessage =
  (): RequestLatestPriceMessage => {
    return {
      action: WebSocketAction.requestLatestPrice,
    };
  };

export const createRequestUserScoreMessage = (
  payload: MessagePayload<RequestUserScoreMessage>,
): RequestUserScoreMessage => {
  return {
    action: WebSocketAction.requestUserScore,
    ...payload,
  };
};

export const createUpdateUserScoreMessage = (
  payload: MessagePayload<UpdateUserScoreMessage>,
): UpdateUserScoreMessage => {
  return {
    action: WebSocketAction.updateUserScore,
    ...payload,
  };
};

export const createUpdatePredictionMessage = (
  payload: MessagePayload<UpdatePredictionMessage>,
): UpdatePredictionMessage => {
  return {
    action: WebSocketAction.updatePrediction,
    ...payload,
  };
};

export const createRequestPredictionMessage = (
  payload: MessagePayload<RequestPredictionMessage>,
): RequestPredictionMessage => {
  return {
    action: WebSocketAction.requestPrediction,
    ...payload,
  };
};

export const createSubmitPredictionMessage = (
  payload: MessagePayload<SubmitPredictionMessage>,
): SubmitPredictionMessage => {
  return {
    action: WebSocketAction.submitPrediction,
    ...payload,
  };
};
