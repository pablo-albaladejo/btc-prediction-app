import { PredictionDirection } from "./enums";

export enum WebSocketAction {
  updatePrice = "updatePrice",
  updateLeaderboard = "updateLeaderboard",
  requestLatestPrice = "requestLatestPrice",
  requestUserScore = "requestUserScore",
  requestPendingPrediction = "requestPendingPrediction",
  updateUserScore = "updateUserScore",
  updatePendingPrediction = "updatePendingPrediction",
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

export interface UpdatePendingPredictionMessage extends WebSocketMessageBase {
  action: WebSocketAction.updatePendingPrediction;
  hasPendingPrediction: boolean;
}

export interface SubmitPredictionMessage extends WebSocketMessageBase {
  action: WebSocketAction.submitPrediction;
  prediction: PredictionDirection;
}

export interface RequestPendingPredictionMessage extends WebSocketMessageBase {
  action: WebSocketAction.requestPendingPrediction;
  userUUID: string;
}

export type WebSocketMessage =
  | UpdatePriceMessage
  | UpdateLeaderboardMessage
  | RequestLatestPriceMessage
  | RequestUserScoreMessage
  | UpdateUserScoreMessage
  | RequestPendingPredictionMessage
  | SubmitPredictionMessage
  | UpdatePendingPredictionMessage;

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

export const createUpdatePendingPredictionMessage = (
  payload: MessagePayload<UpdatePendingPredictionMessage>,
): UpdatePendingPredictionMessage => {
  return {
    action: WebSocketAction.updatePendingPrediction,
    ...payload,
  };
};

export const createRequestPendingPredictionMessage = (
  payload: MessagePayload<RequestPendingPredictionMessage>,
): RequestPendingPredictionMessage => {
  return {
    action: WebSocketAction.requestPendingPrediction,
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
