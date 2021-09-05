import { useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from './connectors';
import { useInactiveListener } from './hooks';

export const Sign = () => {
    useInactiveListener(true);

    const { chainId, account, activate, connector } = useWeb3React();

    const loginWithInject = useCallback(() => {
        activate(injected);
    }, [activate]);

    return (
        <>
            <button onClick={loginWithInject}>
                metamask 登陆
            </button>
        </>
    );
}