import React from 'react';
import BTCPrice from './BTCPrice';
import { useBTCPrice } from '../../hooks';

const BTCPriceContainer = () => {
  const btcPrice = useBTCPrice();

  return <BTCPrice btcPrice={btcPrice} />;
};

export default BTCPriceContainer;
