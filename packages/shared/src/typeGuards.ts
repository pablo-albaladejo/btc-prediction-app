import {
  UpdatePriceMessage,
  WebSocketAction,
  UpdateLeaderboardMessage,
} from "./webSocketActions";

export function isUpdatePriceMessage(
  message: UpdatePriceMessage | UpdateLeaderboardMessage,
): message is UpdatePriceMessage {
  return (
    message &&
    message.action === WebSocketAction.updatePrice &&
    typeof message.price === "number"
  );
}

export function isUpdateLeaderboardMessage(
  message: UpdatePriceMessage | UpdateLeaderboardMessage,
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
