import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';

export const injected = new InjectedConnector({
    supportedChainIds: [
        1, 3, 4, 5, 42, 80001, 80003, 1337
    ]
});

export const network = new NetworkConnector({
    urls: {
        80003: "http://127.0.0.1:8545/",
    },
    defaultChainId: 80003,
})