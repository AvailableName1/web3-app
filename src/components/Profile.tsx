import { useAccount, useConnect, useBalance, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi';

export default function Profile() {
  const { address, connector, isConnected } = useAccount();
  const { data } = useBalance({
    addressOrName: address,
    watch: true,
  });
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: address });
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  if (isConnected) {
    return (
      <div>
        {ensAvatar && <img src={ensAvatar.toString()} alt="ENS Avatar" />}
        <h1>{ensName ? `${ensName}` : address}</h1>
        <p>Connected to {connector?.name}</p>
        <p>Your balance is {data?.formatted}</p>
        <button type="button" onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    );
  }
  return (
    <div>
      {connectors.map((eachConnector) => (
        <button
          disabled={!eachConnector.ready}
          type="button"
          onClick={() => connect({ connector: eachConnector })}
        >
          {eachConnector.name}
          {!eachConnector.ready && ' unsupported'}
          {isLoading && eachConnector.id === pendingConnector?.id && ' loading'}
        </button>
      ))}
      {error && <p>{error.message}</p>}
    </div>
  );
}
