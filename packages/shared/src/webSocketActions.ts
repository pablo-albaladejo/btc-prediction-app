export enum WebSocketAction {
  updatePrice = "updatePrice",
  updateLeaderboard = "updateLeaderboard",
  requestLatestPrice = "requestLatestPrice",
  requestUserScore = "requestUserScore",
  updateUserScore = "updateUserScore",
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

export type WebSocketMessage =
  | UpdatePriceMessage
  | UpdateLeaderboardMessage
  | RequestLatestPriceMessage
  | RequestUserScoreMessage
  | UpdateUserScoreMessage;

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
