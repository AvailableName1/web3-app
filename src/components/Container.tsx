import { useAccount } from 'wagmi';
import Profile from './Profile';
import SendTransaction from './SendTransaction';
import MintNFT from './MintNFT';
import SignMessage from './SignMessage';

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
