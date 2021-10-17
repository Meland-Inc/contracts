import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';

export const injected = new InjectedConnector({
    supportedChainIds: [
        1, 5, 1337
    ]
});