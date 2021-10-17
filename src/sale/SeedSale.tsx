import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import { MELD, MELDSeedSale } from '../constant';
import { MELD__factory as MELDFactory } from '../contracts/factories/MELD__factory';
import { MELDSeedSale__factory as MELDSeedSaleFactory } from '../contracts/factories/MELDSeedSale__factory';
import { formatEther, formatUnits } from '@ethersproject/units';
import { Web3Provider } from '@ethersproject/providers';

export type Props = {
}

export const SeedSale = (props: Props) => {
    const [rate, setRate] = useState(0);
    const [purchasable, setPurchasable] = useState('');
    const { library: rlibrary, chainId, account: raccount } = useWeb3React<Web3Provider>();
    const account = raccount!;
    const library = rlibrary!;

    const meldInstance = MELDFactory.connect(MELD, library);
    const seedSaleInstance = MELDSeedSaleFactory.connect(MELDSeedSale, library);

    useEffect(() => {
        const updatePurchasable = () => {
            seedSaleInstance.purchasable().then(x => {
                setPurchasable(formatEther(x));
            });
        };
        const tokenBuyedEvent = seedSaleInstance.filters.TokenBuyed();
        seedSaleInstance.on(tokenBuyedEvent, () => {
            updatePurchasable();
        });

        seedSaleInstance.rate().then(rate => {
            setRate(rate.toNumber());
        })

        updatePurchasable();
    }, []);

    const buyMELD = useCallback(() => {
        const c = window.prompt("支付多少个eth. 单位个");
        seedSaleInstance.connect(library.getSigner()).buyTokens(account, {
            gasLimit: 5000000,
            value: `${c}000000000000000000`
        });
    }, []);

    return (
        <div>
            <p>当前剩余可购买数量: {purchasable}</p>
            <p>汇率(eth/meld): 1/{rate}</p>
            <button onClick={buyMELD}>购买</button>
        </div>
    )
}