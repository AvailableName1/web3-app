import { WagmiConfig, createClient, configureChains, chain } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import Container from './components/Container';

const alchemyApiKey = process.env.REACT_APP_ALCHEMY_API_KEY;

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet],
  [alchemyProvider({ apiKey: alchemyApiKey, priority: 0 }), publicProvider({ priority: 1 })],
);

const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
  webSocketProvider,
});

function App() {
  return (
    <WagmiConfig client={client}>
      <Container />
    </WagmiConfig>
  );
}

export default App;
