import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import { MELDAddress, QuestionAddress } from '../constant';
import { MELD__factory as MELDFactory } from '../contracts/factories/MELD__factory';
import { formatEther, formatUnits } from '@ethersproject/units';
import { Question__factory as QuestionFactory } from '../contracts/factories/Question__factory';
import { Web3Provider } from '@ethersproject/providers';
import { MarketplaceStorage__factory as MarketplaceStorageFactory } from '../contracts';

export type Props = {
}

export const Profile = (props: Props) => {
    const [ether, setEther] = useState("");
    const [meld, setMELD] = useState("");
    const [questionCount, setQuestionCount] = useState("");
    const { library: rlibrary, chainId, account: raccount } = useWeb3React<Web3Provider>();
    const account = raccount!;
    const library = rlibrary!;

    // 获取eth数量
    library.getBalance(account).then(e => {
        setEther(formatEther(e));
    });

    // 获取meld数量
    const meldInstance = MELDFactory.connect(MELDAddress, library);

    const marketplaceInstance = MarketplaceStorageFactory.connect(MELDAddress, library);

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

    const test = meldInstance.filters.Test();

    useEffect(() => {
        // 监听到题目创建
        // 刷新题目数量
        meldInstance.on(test, (d) => {
            console.debug(d);
        });

        const questionCreatedEvent = questionInstance.filters.QuestionCreated(undefined, account);

        // 监听到题目创建
        // 刷新题目数量
        questionInstance.on(questionCreatedEvent, () => {
            questionInstance.balanceOf(account).then(e => {
                setQuestionCount(formatUnits(e, 0));
            });
        });

        return () => {
            questionInstance.removeAllListeners();
            meldInstance.removeAllListeners();
        }
    }, [1]);

    const questionInstance = QuestionFactory.connect(QuestionAddress, library);
    questionInstance.balanceOf(account).then(e => {
        setQuestionCount(formatUnits(e, 0));
    });

    // 创建题目
    const createQuestion = useCallback(() => {
        questionInstance.connect(library.getSigner()).safeMintOnlyChoice("测试题", "选项1", "选项2", "选项3", "选项4", 1);
    }, []);

    // 答题
    const doQuestion = useCallback(() => {
        questionInstance.connect(library.getSigner()).safeDo();
    }, []);

    return (
        <div>
            <p>chainId: {chainId}</p>
            <p>account: {account}</p>
            <p>ether: {ether}</p>
            <p>meld: {meld}</p>
            <p>question: {questionCount}</p>

            <button onClick={createQuestion}>创建题目</button>

            <button onClick={doQuestion}>答题 (需要支付1MELD, 如果答对则获得1.5MELD)</button>
        </div>
    )
}