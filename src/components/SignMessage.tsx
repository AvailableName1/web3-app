import { useRef } from 'react';
import { useSignMessage } from 'wagmi';
import { verifyMessage } from 'ethers/lib/utils';

export default function SignMessage() {
  const recoveredAddress = useRef<string>();
  const { data, error, isLoading, signMessage } = useSignMessage({
    onSuccess(sucessData, variables) {
      const address = verifyMessage(variables.message, sucessData);
      recoveredAddress.current = address;
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const message = formData.get('message');
        const stringMessage = message?.toString();
        if (stringMessage) signMessage({ message: stringMessage });
      }}
    >
      <label htmlFor="message">
        Enter a message to sign
        <textarea id="message" name="message" placeholder="message to sign" />
      </label>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Check Wallet' : 'Sign Message'}
      </button>
      {data && (
        <div>
          <p>Recovered Address: {recoveredAddress.current}</p>
          <p>Signature: {data}</p>
        </div>
      )}
      {error && <p>{error.message}</p>}
    </form>
  );
}
