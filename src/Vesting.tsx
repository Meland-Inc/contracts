import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import { MELDVesting } from './constant';
import { MELD__factory as MELDFactory } from './contracts/factories/MELD__factory';
import { MELDVesting__factory as MELDVestingFactory } from './contracts/factories/MELDVesting__factory';
import { BigNumber } from '@ethersproject/bignumber';
import { formatEther, formatUnits } from '@ethersproject/units';
import { Web3Provider } from '@ethersproject/providers';

export type Props = {
}

export const Vesting = (props: Props) => {
    const [rate, setRate] = useState(0);
    const [purchasable, setPurchasable] = useState('');
    const [vestings, setVestings] = useState<{
        vestingId: BigNumber;
        beneficiary: string;
        amount: BigNumber;
        releaseTime: Date;
        released: boolean;
    }[]>([]);
    const { library: rlibrary, chainId, account: raccount } = useWeb3React<Web3Provider>();
    const account = raccount!;
    const library = rlibrary!;

    const vestingInstance = MELDVestingFactory.connect(MELDVesting, library);

    useEffect(() => {
        const tokenBuyedEvent = vestingInstance.filters.TokenVestingAdded(null, account);

        const updatePurchasable = async () => {
            vestingInstance.queryFilter(tokenBuyedEvent).then((events) => {
                const promises = events.map(async event => {
                    const v = await vestingInstance.vestings(event.args.vestingId);
                    return {
                        vestingId: event.args.vestingId,
                        beneficiary: v.beneficiary,
                        amount: v.amount,
                        releaseTime: new Date(v.releaseTime.toNumber() * 1000),
                        released: v.released
                    }
                });
                Promise.all(promises).then(v => { console.debug(v); setVestings(v) });
            })
        };
        
        vestingInstance.on(tokenBuyedEvent, () => {
            updatePurchasable();
        });

        updatePurchasable();
    }, []);

    const unlock = useCallback(() => {
        const vid = window.prompt("请输入解锁id");
        if (vid) {
            vestingInstance.connect(library.getSigner()).release(vid).then(r => {

            }).catch(e => {
                window.alert(`解锁失败${e}`);
            });
        }
    }, []);

    return (
        <div>
            <table>
                <thead>
                    <th>vid</th>
                    <th>收益账号</th>
                    <th>解锁日期</th>
                    <th>解锁金额</th>
                    <th>是否已经解锁</th>
                </thead>
                <tbody>
                    {vestings.map(v => {
                        return (
                            <tr>
                                <td>{v.vestingId.toString()}</td>
                                <td>{v.beneficiary.toString()}</td>
                                <td>{v.releaseTime.toISOString()}</td>
                                <td>{formatEther(v.amount)}</td>
                                <td>{v.released ? '是' : '否'}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <button onClick={unlock}>解锁</button>
        </div>
    )
}