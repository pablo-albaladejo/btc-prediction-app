import {
  UpdatePriceMessage,
  WebSocketAction,
  UpdateLeaderboardMessage,
  WebSocketMessage,
  RequestLatestPriceMessage,
} from "./webSocketActions";

export function isUpdatePriceMessage(
  message: WebSocketMessage,
): message is UpdatePriceMessage {
  return (
    message &&
    message.action === WebSocketAction.updatePrice &&
    typeof message.price === "number"
  );
}

export function isUpdateLeaderboardMessage(
  message: WebSocketMessage,
): message is UpdateLeaderboardMessage {
  return (
    message &&
    message.action === WebSocketAction.updateLeaderboard &&
    Array.isArray(message.leaderboard) &&
    message.leaderboard.every(
      (item: { username: string; score: number }) =>
        typeof item.username === "string" && typeof item.score === "number",
    )
  );
}

export function isRequestLatestPriceMessage(
  message: WebSocketMessage,
): message is RequestLatestPriceMessage {
  return message && message.action === WebSocketAction.requestLatestPrice;
}
