import {
    buildTransaction,
    estimateFee,
    getAccountBalances,
    getBalance,
    sendTransaction,
} from '../../../networks/stellar';

import {
    BalanceResult,
    BuySellDetails,
    CurrencyBalanceResult,
    EstimateFeeResult,
    SwapDetails,
    Transaction as TransactionNetwork,
    TransactionType,
} from '../../../networks/types';
import CoinWallet from '../../wallet';
import {
    BuildTransactionParams,
    GetTransactionsParams,
    SignTransactionParams,
} from './types';
import ED25519Coin from '@infinity/core-sdk/lib/commonjs/networks/coin/ed25519';
import { Keypair, Server, Transaction } from 'stellar-sdk';
import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';

import config from '@infinity/core-sdk/lib/commonjs/networks/config';
import { getTransactions } from '../../../transactionParsers/stellar/get';
import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { SetTransactionFormatParams } from '../../types';
import { formatSwap } from '../../utils';

class StellarWallet extends CoinWallet {
    connector!: Server;
    base!: ED25519Coin;

    /**
     * Constructs a new instance of the StellarWallet class.
     *
     * @param {Coins} id - The ID of the instance.
     * @param {string} [mnemonic] - The mnemonic phrase for the instance.
     * @param {string} [walletName] - The name of the wallet.
     * @param {number} [walletAccount] - The account ID of the wallet.
     */
    constructor(
        id: Coins,
        mnemonic?: string,
        walletName?: string,
        walletAccount?: number,
    ) {
        super(id, mnemonic, walletName, walletAccount);
        this.loadConnector();
    }
    /**
     * Estimates the fee for a transaction.
     *
     * @return {Promise<EstimateFeeResult>} A promise that resolves to the estimated fee result.
     */
    estimateFee(): Promise<EstimateFeeResult> {
        return estimateFee();
    }

    /**
     * Builds a transaction using the provided parameters.
     *
     * @param {BuildTransactionParams} _props - The parameters for building the transaction.
     * @return {Promise<string>} A promise that resolves to the built transaction.
     */
    buildTransaction(_props: BuildTransactionParams): Promise<string> {
        return buildTransaction({
            ..._props,
            source: this.base.getPublicAddress({ keyPair: _props.keyPair }),
            connector: this.connector,
        });
    }

    /**
     * Retrieves the balance for the specified wallet account and wallet name.
     *
     * @param {Object} options - The options for retrieving the balance.
     * @param {string} options.walletName - The name of the wallet.
     * @param {number} options.walletAccount - The account number of the wallet.
     * @return {Promise<CurrencyBalanceResult>} A promise that resolves to the balance of the wallet.
     */
    getBalance({
        walletAccount,
        walletName,
    }: {
        walletName: string;
        walletAccount: number;
    }): Promise<CurrencyBalanceResult> {
        return getBalance({
            account: this.getReceiveAddress({
                walletAccount,
                walletName,
            }),
            connector: this.connector,
        });
    }
    /**
     * Retrieves the balances for a given set of accounts or all wallets added using the RPCBalancesParams.
     *
     * @param {string[]} [accounts] - The accounts to retrieve balances for. If not provided, balances for all wallets will be retrieved.
     * @return {Promise<Record<string, BalanceResult[]>>} A promise that resolves to a record of account balances.
     */
    getAccountBalances({
        walletAccount,
        walletName,
    }: {
        walletName: string;
        walletAccount: number;
    }): Promise<Record<string, BalanceResult[]>> {
        var addresses: string[] = [];
        if (walletAccount != undefined && walletName != undefined) {
            addresses = [
                this.getReceiveAddress({
                    walletAccount,
                    walletName,
                }),
            ];
        } else {
            Object.keys(this.addresses).map(walletName => {
                Object.keys(this.addresses[walletName]).map(walletAccount => {
                    addresses.push(
                        this.getReceiveAddress({
                            walletAccount: parseInt(walletAccount),
                            walletName,
                        }),
                    );
                });
            });
        }
        return getAccountBalances({
            accounts: addresses,
            connector: this.connector,
        });
    }
    /**
     * Sends a transaction with a raw string to the connected wallet.
     *
     * @param {string} rawTransaction - The raw string of the transaction to send.
     * @return {Promise<string>} A promise that resolves to the transaction ID.
     */
    sendTransaction(rawTransaction: string): Promise<string> {
        return sendTransaction(rawTransaction);
    }
    /**
     * Retrieves transactions based on the specified parameters.
     *
     * @param {string} lastTransactionHash - The hash of the last transaction.
     * @param {string} walletAccount - The name of the wallet.
     * @return {Promise<TransactionNetwork[]>} A promise that resolves to an array of transactions.
     */
    async getTransactions({
        lastTransactionHash,
        walletAccount,
        swapHistorical,
        walletName,
    }: GetTransactionsParams): Promise<TransactionNetwork[]> {
        const transactions = await getTransactions({
            address: this.getReceiveAddress({
                walletAccount,
                walletName,
            }),
            lastTransactionHash,
        });
        this.setTransactionFormat({
            swapHistorical,
            transactions,
            walletAccount,
            walletName,
        });
        return transactions;
    }
    /**
     * Signs a transaction using the provided transaction and keyPair.
     *
     * @param {SignTransactionParams} _props - The parameters for signing the transaction.
     * @param {string} _props.secretKey - The secretKey used for signing.
     * @param {Transaction} _props.transaction - The transaction to sign.
     * @return {Transaction} The signed transaction.
     */
    signTransaction(_props: SignTransactionParams): Transaction {
        const key_pair = Keypair.fromSecret(_props.secretKey);
        _props.transaction.sign(key_pair);
        return _props.transaction;
    }

    /**
     * Loads the connector for the specified BIP ID coin.
     *
     * @throws {Error} If the API RPC for the BIP ID coin is not defined.
     */
    loadConnector() {
        this.connector = new Server(config[this.id].rpc[0]);
    }

    /**
     * Retrieves the minimum amount left from the configuration for the current wallet.
     *
     * @return {number} The minimum amount left as specified in the configuration.
     */

    async getMinimumAmountLeft(): Promise<number> {
        return config[this.id].dust as number;
    }

    /**
     * Sets the transaction format for the given transactions based on the provided parameters.
     *
     * @param {SetTransactionFormatParams} params - The parameters for setting the transaction format.
     * @param {SwapHistoricalTransaction[]} params.swapHistorical - The historical swap transactions.
     * @param {Transaction[]} params.transactions - The transactions to set the format for.
     * @param {string} [params.walletAccount] - The name of the wallet. If not provided, the currently selected wallet will be used.
     * @param {BuySellHistoricalTransaction[]} [params.buysellHistorical] - The historical buy/sell transactions.
     */
    setTransactionFormat({
        swapHistorical,
        transactions,
        walletAccount,
        buysellHistorical,
        walletName,
    }: SetTransactionFormatParams) {
        const address = this.getReceiveAddress({
            walletAccount,
            walletName,
        });
        for (let tr of transactions) {
            const swapTransaction = swapHistorical?.find(
                b => b.hash == tr.hash || b.hash_to == tr.hash,
            );
            const buySellTransaction:BuySellDetails | undefined = buysellHistorical?.find(b => b.txid == tr.hash);

            if (swapTransaction) {
                tr.transactionType = TransactionType.SWAP;
                tr.swapDetails = formatSwap(swapTransaction);
            } else if (buySellTransaction) {
                tr.transactionType = TransactionType.BUYSELL;
                tr.buySellDetails = buySellTransaction;
            } else if (tr.tokenTransfers && tr.tokenTransfers?.length > 1) {
                const outAmount =
                    tr.tokenTransfers.find(
                        a =>
                            a.from == address &&
                            new BigNumber(a.value).isGreaterThan(0),
                    ) != undefined;
                const inAmount =
                    tr.tokenTransfers.find(
                        a =>
                            a.to == address &&
                            new BigNumber(a.value).isGreaterThan(0),
                    ) != undefined;
                if (outAmount && inAmount) {
                    tr.transactionType = TransactionType.TRADE;
                } else if (outAmount) {
                    tr.transactionType = TransactionType.DEPOSIT;
                } else {
                    tr.transactionType = TransactionType.WITHDRAW;
                }
            } else if (tr.from?.toLowerCase() == address.toLowerCase()) {
                tr.transactionType = TransactionType.SEND;
            } else {
                tr.transactionType = TransactionType.RECEIVE;
            }
        }
    }
}

export default StellarWallet;
