import React from 'react';
import { BTCPriceText } from './BTCPrice.styles';

interface BTCPriceProps {
  btcPrice: number | null;
}

function BTCPrice({ btcPrice }: BTCPriceProps) {
  return (
    <BTCPriceText>
      BTC: {btcPrice !== null ? `$${btcPrice}` : 'Loading...'}
    </BTCPriceText>
  );
}

export default BTCPrice;
