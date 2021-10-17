import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import { MELD } from '../constant';
import { MELD__factory as MELDFactory } from '../contracts/factories/MELD__factory';
import { formatEther, formatUnits } from '@ethersproject/units';
import { Web3Provider } from '@ethersproject/providers';

export type Props = {
}

export const Profile = (props: Props) => {
    const [ether, setEther] = useState("");
    const [meld, setMELD] = useState("");
    const { library: rlibrary, chainId, account: raccount } = useWeb3React<Web3Provider>();
    const account = raccount!;
    const library = rlibrary!;

    // 获取eth数量
    library.getBalance(account).then(e => {
        setEther(formatEther(e));
    });

    // 获取MELD数量
    const meldInstance = MELDFactory.connect(MELD, library);

    const mintEvent = meldInstance.filters.Transfer(undefined, account);

    meldInstance.on(mintEvent, (d) => {
        console.debug(d);

        meldInstance.balanceOf(account).then(e => {
            setMELD(formatEther(e));
        });
    });

    meldInstance.balanceOf(account).then(e => {
        setMELD(formatEther(e));
    });

    return (
        <div>
            <p>chainId: {chainId}</p>
            <p>account: {account}</p>
            <p>ether: {ether}</p>
            <p>meld: {meld}</p>
        </div>
    )
}