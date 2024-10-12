import { useState, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { isUpdatePriceMessage } from '@my-org/shared';

export const useBTCPrice = () => {
  const [btcPrice, setBTCPrice] = useState<number | null>(null);

  const handlePriceUpdate = useCallback((message: MessageEvent) => {
    const data = JSON.parse(message.data);
    if (isUpdatePriceMessage(data)) {
      setBTCPrice(data.price);
    }
  }, []);

  useWebSocket(handlePriceUpdate);

  return btcPrice;
};
