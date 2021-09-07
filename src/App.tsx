
import { useWeb3React } from '@web3-react/core';
import { Sign } from './components/Sign';
import { Profile } from './components/Profile';
import { Web3Provider } from '@ethersproject/providers';

function App() {
  const { account, library } = useWeb3React<Web3Provider>();

  if (!library) {
    return (
      <Sign></Sign>
    );
  }

  if (!account) {
    return (
      <Sign></Sign>
    );
  }

  return (
    <>
      <Profile />
    </>
  );
}

export default App;
