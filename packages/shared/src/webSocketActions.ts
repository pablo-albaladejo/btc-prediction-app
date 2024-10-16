import { PredictionDirection } from "./enums";

export enum WebSocketAction {
  updatePrice = "updatePrice",
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

export interface RequestLatestPriceMessage extends WebSocketMessageBase {
  action: WebSocketAction.requestLatestPrice;
}

export interface RequestUserScoreMessage extends WebSocketMessageBase {
  action: WebSocketAction.requestUserScore;
}

export interface UpdateUserScoreMessage extends WebSocketMessageBase {
  action: WebSocketAction.updateUserScore;
  score: number;
}

export interface UpdatePredictionMessage extends WebSocketMessageBase {
  action: WebSocketAction.updatePrediction;
  direction: PredictionDirection;
}

export interface SubmitPredictionMessage extends WebSocketMessageBase {
  action: WebSocketAction.submitPrediction;
  direction: PredictionDirection;
  price: number;
}

export interface RequestPredictionMessage extends WebSocketMessageBase {
  action: WebSocketAction.requestPrediction;
}

export type WebSocketMessage =
  | UpdatePriceMessage
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

export const createRequestLatestPriceMessage =
  (): RequestLatestPriceMessage => {
    return {
      action: WebSocketAction.requestLatestPrice,
    };
  };

export const createRequestUserScoreMessage = (): RequestUserScoreMessage => {
  return {
    action: WebSocketAction.requestUserScore,
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

export const createRequestPredictionMessage = (): RequestPredictionMessage => {
  return {
    action: WebSocketAction.requestPrediction,
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
