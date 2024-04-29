import { NotImplemented } from '@infinity/core-sdk/lib/commonjs/errors';
import {
    CurrencyBalanceResult,
    EstimateFeeResult,
} from '../../../networks/types';
import {
    buildTransaction,
    estimateFee,
    getBalance,
    sendTransaction,
} from '../../../networks/xrp';
import CoinWallet from '../../wallet';
import { XrplClient } from 'xrpl-client';
import { BuildTransactionParams } from './types';
import ED25519Coin from '@infinity/core-sdk/lib/commonjs/networks/coin/ed25519';

class XRPWallet extends CoinWallet {
    connector!:XrplClient
    base!:ED25519Coin
    /**
     * Estimates the fee for a transaction.
     *
     * @return {EstimateFeeResult} The estimated fee result.
     */
    estimateFee(): EstimateFeeResult {
        return estimateFee({
            connector:this.connector
        });
    }
    /**
     * Builds a transaction using the provided parameters.
     *
     * @param {BuildTransactionParams} _props - The parameters for building the transaction.
     * @return {Promise<string>} A promise that resolves to the built transaction.
     */
    buildTransaction(_props: BuildTransactionParams): Promise<string> {
        const seed = this.base.getSeed({mnemonic:_props.mnemonic})
        const keyPair = this.base.getKeyPair({seed})
        return buildTransaction({
            ..._props,
            connector:this.connector,
            keyPair
        });
    }
    /**
     * Retrieves the balance for the specified wallet.
     *
     * @param {string} walletName - (Optional) The name of the wallet to retrieve the balance for. If not provided, the balance of the currently selected wallet will be retrieved.
     * @return {Promise<CurrencyBalanceResult>} A promise that resolves to the balance of the wallet.
     */
    getBalance(walletName?:string): Promise<CurrencyBalanceResult> {
        return getBalance({
            address:this.getReceiveAddress({walletName: walletName ?? this.walletSelected}),
            connector:this.connector
        });
    }
    /**
     * Sends a transaction with a raw string to the connected wallet.
     *
     * @param {string} rawTransaction - The raw string of the transaction to send.
     * @return {Promise<string>} A promise that resolves to the transaction ID.
     */
    sendTransaction(rawTransaction:string): Promise<string> {
        return sendTransaction({
            rawTransaction,
            connector:this.connector
        });
    }
    getTransactions(_props: any) {
        throw new Error(NotImplemented);
    }
    /**
     * Initializes the connector for the current object.
     *
     * @param {} 
     * @return {}
     */
    loadConnector() {
        this.connector = new XrplClient();
    }
}

export default XRPWallet;
