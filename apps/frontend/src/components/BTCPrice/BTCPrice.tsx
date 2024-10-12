import React from 'react';
import { Text } from '@aws-amplify/ui-react';
import { useBTCPrice } from '../../hooks';

function BTCPrice() {
  const btcPrice = useBTCPrice();

  return <Text>BTC: {btcPrice !== null ? `$${btcPrice}` : 'Loading...'}</Text>;
}

export default BTCPrice;
