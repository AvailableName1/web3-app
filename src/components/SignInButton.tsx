import { useState, useEffect } from 'react';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';

export default function SignInButton({
  onSuccess,
  onError,
}: {
  onSuccess: (args: { address: string }) => void;
  onError: (args: { error: Error }) => void;
}) {
  const [state, setState] = useState<{
    loading?: boolean;
    nonce?: string;
  }>({});
  const fetchNonce = async () => {
    try {
      const nonceRes = await fetch('/api/nonce');
      const nonce = await nonceRes.text();
      setState((state) => ({ ...state, nonce }));
    } catch (e) {
      setState((state) => ({ ...state, error: e as Error }));
    }
  };

  useEffect(() => {
    fetchNonce();
  }, []);

  const { address } = useAccount();
  const { chain: activeChain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  const signIn = async () => {
    try {
      const chainId = activeChain?.id;
      if (!address || !chainId) {
        return;
      }
      setState((state) => ({ ...state, loading: true }));
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce: state.nonce,
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      const verifyRes = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!verifyRes.ok) {
        throw new Error(`Couldn't verify`);
      }
      setState((state) => ({ ...state, loading: false }));
      onSuccess({ address });
    } catch (e) {
      setState((x) => ({ ...x, loading: false, nonce: undefined }));
      onError({ error: e as Error });
      fetchNonce();
    }
  };
  return (
    <button type="button" disabled={!state.nonce || state.loading} onClick={signIn}>
      Sign-in with ETH
    </button>
  );
}
