import { NotImplemented } from '@infinity/core-sdk/lib/commonjs/errors';
import {
    buildTransaction,
    estimateFee,
    getBalance,
    sendTransaction,
} from '../../networks/fio';
import {
    BuildTransactionFIOResult,
    BuildTransactionParams,
} from '../../networks/fio/builder/types';
import { CurrencyBalanceResult, EstimateFeeResult } from '../../networks/types';
import CoinWallet from '../wallet';
import { GetReceiveAddressParams } from '../type';
import {
    DerivationName,
    Protocol,
} from '@infinity/core-sdk/lib/commonjs/networks';

class FIOWallet extends CoinWallet {
    estimateFee(source: string): Promise<EstimateFeeResult> {
        return estimateFee(source);
    }
    buildTransaction(
        _props: BuildTransactionParams,
    ): Promise<BuildTransactionFIOResult> {
        return buildTransaction(_props);
    }
    getBalance(address: string): Promise<CurrencyBalanceResult> {
        return getBalance(address);
    }
    sendTransaction(_props: BuildTransactionFIOResult): Promise<string> {
        return sendTransaction(_props);
    }
    getTransactions(_props: any) {
        throw new Error(NotImplemented);
    }
    loadConnector(_props: any) {
        throw new Error(NotImplemented);
    }

    getAccount(): string {
        return this.account;
    }
}

export default FIOWallet;
