
import { useWeb3React } from '@web3-react/core';
import { Sign } from './components/Sign';
import { Profile } from './components/Profile';
import { SeedSale } from './sale/SeedSale';
import { PublicSale } from './sale/PublicSale';
import { Vesting } from './Vesting';
import { Web3Provider } from '@ethersproject/providers';

function App() {
  const { account, library } = useWeb3React<Web3Provider>();
  const subPage: string = (new URL(window.location.href)).searchParams.get('subPage') || 'SeedSale';

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

  if (subPage === 'SeedSale') {
    return (
      <SeedSale />
    )
  }

  if (subPage === 'Vesting') {
    return (
      <Vesting />
    )
  }

  if (subPage === 'Profile') {
    return (
      <Profile />
    )
  }

  return (
    <>
      <PublicSale />
    </>
  );
}

export default App;
