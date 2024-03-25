import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { GetAccountBalancesParams, GetAccountInfoParams } from './types';
import { BalanceResult, CurrencyBalanceResult } from '../../types';
/*
getAccountInfo
    Returns balance of the extended public keys
    @param connector: trezorWebsocket object
    @param address: extended public key
*/
const getAccountInfo = ({
    connector,
    address,
}: GetAccountInfoParams): Promise<string> => {
    return new Promise((resolve, reject) => {
        connector.send(
            'getAccountInfo',
            {
                descriptor: address,
                details: 'basic',
                page: 1,
                from: 1,
                to: 1,
            },
            (data: { balance: string; unconfirmedBalance: string }) => {
                if (!data || !data.balance) {
                    reject();
                    return;
                }
                const balance = new BigNumber(data.balance);
                const unconfirmed_balance = new BigNumber(
                    data.unconfirmedBalance,
                );
                resolve(balance.plus(unconfirmed_balance).toString(10));
            },
        );
    });
};
/*
getAccountBalances
    Returns balance addition of all extended public keys
    @param connector: trezorWebsocket object
    @param extendedPublicKeys: array extended public keys
*/
export const getAccountBalances = async ({
    connector,
    extendedPublicKeys,
}: GetAccountBalancesParams): Promise<Record<string, BalanceResult[]>> => {
    const result: Record<string, BalanceResult[]> = {};
    for (let address of extendedPublicKeys) {
        const balances = await getAccountInfo({ address, connector });
        result[address] = [
            {
                value: balances,
            },
        ];
    }
    return result;
};
/*
getBalance
    Returns balance addition of all extended public keys
    @param connector: trezorWebsocket object
    @param extendedPublicKeys: array extended public keys
*/
export const getBalance = async ({
    connector,
    extendedPublicKeys,
}: GetAccountBalancesParams): Promise<CurrencyBalanceResult> => {
    var balance = new BigNumber(0);
    for (let address of extendedPublicKeys) {
        const balances = await getAccountInfo({ address, connector });
        balance = balance.plus(balances);
    }
    return {
        balance: balance.toString(10),
    };
};
