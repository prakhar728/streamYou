import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import {Chain, configureChains, createClient, useQueryClient, WagmiConfig} from 'wagmi';
import { goerli,polygonMumbai,filecoinHyperspace } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ChakraProvider } from '@chakra-ui/react'
<<<<<<< HEAD
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
=======

const sharedeumLiberty: Chain = {
    name: 'Sharedeum Liberty',
    id: 8081,
    rpcUrls: {
        default: {
            http: ["https://liberty20.shardeum.org/"]
        },
        public: {
            http: ["https://liberty20.shardeum.org/"]
        }
    },
    testnet: true,
    nativeCurrency: {
        decimals: 18,
        name: "Shardeum Liberty",
        symbol: "SHM"
    },
    network: "shardeum",
}

const mantleTestnet: Chain = {
    name: 'Mantle Testnet',
    id: 5001,
    rpcUrls: {
        default: {
            http: ["https://rpc.testnet.mantle.xyz"]
        },
        public: {
            http: ["https://rpc.testnet.mantle.xyz"]
        }
    },
    testnet: true,
    nativeCurrency: {
        decimals: 18,
        name: "$BIT",
        symbol: "BIT"
    },
    network: "mantle",
}

const { chains, provider, webSocketProvider } = configureChains(
  [
    polygonMumbai,
    filecoinHyperspace,
    sharedeumLiberty,
    mantleTestnet,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli ] : []),
  ],
>>>>>>> 101697d400be70b973d9193607856107a83fc86f
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
