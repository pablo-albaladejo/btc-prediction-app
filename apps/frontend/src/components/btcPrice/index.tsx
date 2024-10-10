import React, { useState, useCallback } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import TimeCounter from '../timeCounter';
import { isUpdatePriceMessage } from '@my-org/shared';

function BTCPrice() {
  const [price, setPrice] = useState<number | null>(null);
  const [updateCount, setUpdateCount] = useState(0);

  const handlePriceUpdate = useCallback((message: MessageEvent) => {
    const data = JSON.parse(message.data);
    console.log('Received message:', data);
    if (isUpdatePriceMessage(data)) {
      setPrice(data.price);
      setUpdateCount((prev) => prev + 1);
    }
  }, []);

  useWebSocket(handlePriceUpdate);

  return (
    <div data-testid="btc-price">
      <h1>Current Bitcoin Price</h1>
      {price !== null ? <h2>${price}</h2> : <h2>Loading price...</h2>}
      <TimeCounter resetTrigger={updateCount} />
    </div>
  );
}

export default BTCPrice;
