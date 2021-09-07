import { useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../connectors';
import { useInactiveListener } from '../hooks';

export const Sign = () => {
    useInactiveListener(true);
    const { activate } = useWeb3React();

    const loginWithInject = useCallback(() => {
        activate(injected);
    }, [activate]);

    return (
        <>
            <button onClick={loginWithInject}>
                登陆
            </button>
        </>
    );
}