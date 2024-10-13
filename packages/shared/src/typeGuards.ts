import { PredictionDirection } from "./enums";
import {
  UpdatePriceMessage,
  WebSocketAction,
  UpdateLeaderboardMessage,
  WebSocketMessage,
  RequestLatestPriceMessage,
  UpdateUserScoreMessage,
  SubmitPredictionMessage,
  UpdatePendingPredictionMessage,
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

export function isUpdateUserScoreMessage(
  message: WebSocketMessage,
): message is UpdateUserScoreMessage {
  return (
    message &&
    message.action === WebSocketAction.updateUserScore &&
    typeof message.score === "number"
  );
}

export const isSubmitPredictionMessage = (
  message: WebSocketMessage,
): message is SubmitPredictionMessage => {
  return (
    message.action === WebSocketAction.submitPrediction &&
    Object.values(PredictionDirection).includes(message.prediction)
  );
};

export const isUpdatePendingPredictionMessage = (
  message: WebSocketMessage,
): message is UpdatePendingPredictionMessage => {
  return (
    message.action === WebSocketAction.updatePendingPrediction &&
    typeof message.hasPendingPrediction === "boolean"
  );
};
