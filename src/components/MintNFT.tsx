import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';

export default function MintNFT() {
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    addressOrName: '0xaf0326d92b97df1221759476b072abfd8084f9be',
    contractInterface: ['function mint()'],
    functionName: 'mint',
  });
  const { write, error, isError, data } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });
  return (
    <div>
      <button disabled={!write || isLoading} type="button" onClick={() => write?.()}>
        {isLoading ? 'Minting' : 'Mint'}
      </button>
      {isError || isPrepareError ? <p>{(error || prepareError)?.message}</p> : null}
      {isSuccess && (
        <div>
          Successfully minted your NFT!
          <div>
            <a href={`https://etherscan.io/tx/${data?.hash}`} target="_blank" rel="noreferrer">
              Etherscan
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
