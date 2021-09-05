
import { useWeb3React } from '@web3-react/core';
import { useState } from 'react';
import { Sign } from './sign';
import { formatEther } from '@ethersproject/units';
import { Web3Provider } from '@ethersproject/providers'

function App() {
  const { chainId, account, library } = useWeb3React<Web3Provider>();
  const [ ether, setEther ] = useState("");

  console.debug(chainId, account);

  if (!library) {
    return (
      <Sign></Sign>
    );
  }

  if (library
    && account
  ) {
    library.getBalance(account).then(e => {
      setEther(formatEther(e));
    });

  }
  
  return (
    <>
      <p>chainId: {chainId}</p>
      <p>account: {account}</p>
      <p>ether: {ether}</p>
      <p>meld: {ether}</p>
    </>
  );
}

export default App;
