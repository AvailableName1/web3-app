import type { AppProps } from 'next/app';
import { WagmiConfig, createClient, configureChains, chain } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import Head from 'next/head';

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

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </WagmiConfig>
  );
}
