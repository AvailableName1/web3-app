import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export default function Profile() {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  if (isConnected) {
    return (
      <div>
        <p>Connected to {ensName ?? address}</p>
        <button type="button" onClick={() => disconnect()}>
          Disconnect wallet
        </button>
      </div>
    );
  }
  return (
    <button type="button" onClick={() => connect()}>
      Connect Wallet
    </button>
  );
}
