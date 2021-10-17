import { useCallback, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../connectors';

export const Sign = () => {
    const { activate } = useWeb3React();

    const loginWithInject = useCallback(() => {
        activate(injected);
    }, [activate]);

    // auto login.
    useEffect(() => {
        injected.isAuthorized().then((isAuthorized) => {
            if (isAuthorized) {
                activate(injected, undefined, true).catch(() => {
               
                });
            }
        });
    }, [injected]);

    return (
        <>
            <button onClick={loginWithInject}>
                登陆
            </button>
        </>
    );
}