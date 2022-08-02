import { useAccount, useConnect, useBalance, useDisconnect, useEnsName } from 'wagmi';
import { useState, useEffect } from 'react';
import SignInButton from './SignInButton';

export default function Profile() {
  const { isConnected } = useAccount();
  const [state, setState] = useState<{
    address?: string;
    error?: Error;
    loading?: boolean;
  }>({});
  useEffect(() => {
    const handler = async () => {
      try {
        const res = await fetch('/api/me');
        const json = await res.json();
        setState((state) => ({ ...state, address: json.address }));
      } catch (_error) {}
    };
    handler();
    window.addEventListener('focus', handler);
    return () => window.removeEventListener('focus', handler);
  }, []);
  const { data } = useBalance({
    addressOrName: state.address,
    watch: true,
  });
  const { data: ensName } = useEnsName({ address: state.address });
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  if (isConnected) {
    return (
      <div>
        {state.address ? (
          <div>
            <h1>Signed in as {ensName ? ensName : state.address}</h1>
            <p>{data?.formatted}</p>
            <button
              type="button"
              onClick={async () => {
                await fetch('/api/logout');
                setState({});
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <SignInButton
            onSuccess={({ address }) => setState((state) => ({ ...state, address }))}
            onError={({ error }) => setState((state) => ({ ...state, error }))}
          />
        )}
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
          key={eachConnector.name}
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
