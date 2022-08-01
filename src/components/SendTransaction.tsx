import { parseEther } from 'ethers/lib/utils';
import { useState, useDeferredValue } from 'react';
// eslint-disable-next-line max-len
import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi';

export default function SendTransaction() {
  const [receiver, setReceiver] = useState('');
  const deferredReceiver = useDeferredValue(receiver);
  const [amount, setAmount] = useState('');
  const deferredAmount = useDeferredValue(amount);

  const { config, error } = usePrepareSendTransaction({
    request: {
      to: deferredReceiver,
      value: deferredAmount ? parseEther(deferredAmount) : undefined,
    },
  });
  const { data, sendTransaction } = useSendTransaction(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendTransaction?.();
      }}
    >
      <h1>If you want to send somebody something :)</h1>
      <input
        aria-label="Receiver"
        type="text"
        placeholder="eth address"
        value={receiver}
        onChange={(e) => setReceiver(e.currentTarget.value)}
      />
      <input
        aria-label="Amount"
        type="number"
        placeholder="amount"
        value={amount}
        onChange={(e) => {
          setAmount(e.currentTarget.value);
        }}
      />
      <button disabled={isLoading || !sendTransaction || !receiver || !amount} type="submit">
        {isLoading ? 'Sending!' : 'Send'}
      </button>
      {error ? <p>{error.message}</p> : null}
      {isSuccess && (
        <div>
          Successfully sent {amount} ether to {receiver}
          <div>
            <a href={`https://etherscan.io/tx/${data?.hash}`} target="_blank" rel="noreferrer">
              Etherscan
            </a>
          </div>
        </div>
      )}
    </form>
  );
}
