import React from 'react';
import { BTCPriceText } from './BTCPrice.styles';
import { useBTCPrice } from '../../hooks';

function BTCPrice() {
  const btcPrice = useBTCPrice();

  return (
    <BTCPriceText>
      BTC: {btcPrice !== null ? `$${btcPrice}` : 'Loading...'}
    </BTCPriceText>
  );
}

export default BTCPrice;
