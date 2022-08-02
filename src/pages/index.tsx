import { useAccount } from 'wagmi';
import SendTransaction from '../components/SendTransaction';
import MintNFT from '../components/MintNFT';
import SignMessage from '../components/SignMessage';
import Profile from '../components/Profile';

export default function Container() {
  const { isConnected, isDisconnected } = useAccount();
  return (
    <div>
      <Profile />
      <MintNFT />
      {isConnected && !isDisconnected && <SendTransaction />}
      <SignMessage />
    </div>
  );
}
