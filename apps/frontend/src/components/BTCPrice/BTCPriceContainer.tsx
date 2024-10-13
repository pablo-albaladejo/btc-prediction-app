import React, { useContext } from 'react';
import BTCPrice from './BTCPrice';
import { WebSocketContext } from '../../contexts';

const BTCPriceContainer = () => {
  const { btcPrice } = useContext(WebSocketContext);

  return <BTCPrice btcPrice={btcPrice} />;
};

export default BTCPriceContainer;
