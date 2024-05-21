import { Keypair, Transaction, VersionedTransaction } from '@solana/web3.js';
import { GetAccountsResult } from '../../../networks/solana/utils/types';
import { SwapHistoricalTransaction } from '../../types';

export type TransactionBuilderParams = {
    memo: string;
    mintToken?: string;
    destination: string;
    decimalsToken?: number;
    value: string;
    keyPair: Keypair;
};

export type SignTransactionParams = {
    transaction: VersionedTransaction | Transaction;
    keyPair: Keypair;
};

export type GetTransactionsParams = {
    walletName?: string;
    signatures?: Record<string, string>;
    accounts?: GetAccountsResult[];
    swapHistorical?: SwapHistoricalTransaction[];
};

export type SignMessageParams = {
    keyPair: Keypair;
    message: Buffer;
};
export type GetBalanceAfterParams = {
    transaction: Transaction | VersionedTransaction;
    walletName?: string;
};
export type EstimateFeeParams = {
    memo: string;
    walletName?: string;
    mintToken?: string;
    destination: string;
    decimalsToken?: number;
    value: string;
};
