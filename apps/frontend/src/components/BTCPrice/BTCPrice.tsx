import React, { useState, useCallback } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { isUpdatePriceMessage } from '@my-org/shared';
import { Text } from '@aws-amplify/ui-react';

function BTCPrice() {
  const [btcPrice, setBTCPrice] = useState<number | null>(null);

  const handlePriceUpdate = useCallback((message: MessageEvent) => {
    const data = JSON.parse(message.data);
    if (isUpdatePriceMessage(data)) {
      console.log('Received message at BTCPrice:', data);
      setBTCPrice(data.price);
    }
  }, []);

  useWebSocket(handlePriceUpdate);

  return (
    <Text className="btc-price-text">
      BTC: {btcPrice !== null ? `$${btcPrice}` : 'Loading...'}
    </Text>
  );
}

export default BTCPrice;
