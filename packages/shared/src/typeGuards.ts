import { PredictionDirection } from "./enums";
import {
  UpdatePriceMessage,
  WebSocketAction,
  WebSocketMessage,
  RequestLatestPriceMessage,
  UpdateUserScoreMessage,
  SubmitPredictionMessage,
  UpdatePredictionMessage,
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
    Object.values(PredictionDirection).includes(message.direction) &&
    typeof message.price === "number"
  );
};

export const isUpdatePredictionMessage = (
  message: WebSocketMessage,
): message is UpdatePredictionMessage => {
  return (
    message.action === WebSocketAction.updatePrediction &&
    Object.values(PredictionDirection).includes(message.direction)
  );
};
