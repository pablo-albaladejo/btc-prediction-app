export enum WebSocketAction {
  updatePrice = "updatePrice",
  updateLeaderboard = "updateLeaderboard",
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

export type WebSocketMessage = UpdatePriceMessage | UpdateLeaderboardMessage;

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
