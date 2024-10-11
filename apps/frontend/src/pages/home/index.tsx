import React from 'react';
import {
  Button,
  Flex,
  Heading,
  useAuthenticator,
  View,
} from '@aws-amplify/ui-react';
import Prediction from '../../components/prediction';
import BTCPrice from '../../components/btcPrice';

const Home = () => {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  /*const [btcPrice, setBTCPrice] = useState<number | null>(null);

  const handlePriceUpdate = useCallback((message: MessageEvent) => {
    const data = JSON.parse(message.data);
    console.log('Received message:', data);
    if (isUpdatePriceMessage(data)) {
      setBTCPrice(data.price);
    }
  }, []);

  useWebSocket(handlePriceUpdate);*/

  return (
    <View padding="medium">
      <Flex direction="column" alignItems="center" gap="1.5rem">
        <BTCPrice />

        <Heading level={3}>Welcome {user.username}</Heading>

        <Prediction />

        <Button variation="destructive" onClick={signOut}>
          Sign Out
        </Button>
      </Flex>
    </View>
  );
};

export default Home;
