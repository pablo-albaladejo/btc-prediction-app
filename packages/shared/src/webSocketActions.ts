export enum WebSocketAction {
  updatePrice = "updatePrice",
  updateLeaderboard = "updateLeaderboard",
  requestLatestPrice = "requestLatestPrice",
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

export type WebSocketMessage =
  | UpdatePriceMessage
  | UpdateLeaderboardMessage
  | RequestLatestPriceMessage;

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
