import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createClient, useQueryClient, WagmiConfig } from 'wagmi';
import { arbitrum, goerli, mainnet, optimism, polygon,polygonMumbai,filecoinHyperspace } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ChakraProvider } from '@chakra-ui/react'
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';

const hyperspace = {
  id: 3_141,
  name: 'Hyperspace',
  network: 'Hyperspace',
  nativeCurrency: {
      decimals: 18,
      name: 'Filecoin',
      symbol: 'tFIL',
  },
  rpcUrls: {
      default: "https://api.hyperspace.node.glif.io/rpc/v1",
  },
}


const { chains, provider, webSocketProvider } = configureChains(
  [filecoinHyperspace],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'StreamYou',
  projectId: '61fe1be7eca1df04384f1964c8999f33YOUR_PROJECT_ID',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});



function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
      <ChakraProvider>
        <Component {...pageProps} />
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
