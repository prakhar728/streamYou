import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import {getDefaultWallets, RainbowKitProvider} from '@rainbow-me/rainbowkit';
import type {AppProps} from 'next/app';
import {Chain, configureChains, createClient, useQueryClient, WagmiConfig} from 'wagmi';
import {goerli, polygonMumbai, filecoinHyperspace} from 'wagmi/chains';
import {publicProvider} from 'wagmi/providers/public';
import {ChakraProvider} from '@chakra-ui/react'
import {CreatorProvider} from "../contexts/CreatorContext";

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

const {chains, provider, webSocketProvider} = configureChains(
    [
        mantleTestnet,
        sharedeumLiberty,
        ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : []),
    ],
    [publicProvider()]
);

const {connectors} = getDefaultWallets({
    appName: 'StreamYou',
    projectId: process.env.NEXT_PUBLIC_RAINBOW_KIT,
    chains,
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
    webSocketProvider,
});


function MyApp({Component, pageProps}: AppProps) {
    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
                <CreatorProvider>
                    <ChakraProvider>
                        <Component {...pageProps} />
                    </ChakraProvider>
                </CreatorProvider>
            </RainbowKitProvider>
        </WagmiConfig>
    );
}

export default MyApp;
