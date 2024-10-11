import React, { useState, useCallback } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { isUpdatePriceMessage } from '@my-org/shared';
import { Heading } from '@aws-amplify/ui-react';

function BTCPrice() {
  const [btcPrice, setBTCPrice] = useState<number | null>(null);

  const handlePriceUpdate = useCallback((message: MessageEvent) => {
    const data = JSON.parse(message.data);
    console.log('Received message:', data);
    if (isUpdatePriceMessage(data)) {
      setBTCPrice(data.price);
    }
  }, []);

  useWebSocket(handlePriceUpdate);

  return (
    <Heading level={1}>
      BTC: {btcPrice !== null ? `$${btcPrice}` : 'Loading...'}
    </Heading>
  );
}

export default BTCPrice;
