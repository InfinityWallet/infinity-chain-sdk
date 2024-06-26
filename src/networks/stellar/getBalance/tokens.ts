import { BigNumber } from '@infinity/core-sdk/lib/commonjs/core';
import { GetAccountBalanceParams } from './types';
import { BalanceResult } from '../../types';
import { AccountResponse, Horizon } from 'stellar-sdk';

/**
 * Returns balances of tokens and stellar of the account
 * @param {string[]} accounts Array of accounts to get the balances from
 * @param {Server} connector Stellar api connector
 * @returns {Promise<Record<string, BalanceResult[]>>} Balances of tokens and stellar
 */
export const getAccountBalances = async ({
    accounts,
    connector,
}: GetAccountBalanceParams): Promise<Record<string, BalanceResult[]>> => {
    const result: Record<string, BalanceResult[]> = {};
    for (let account of accounts) {
        const accountBalances: AccountResponse =
            await connector.loadAccount(account);
        const reserve = new BigNumber(10000000)
            .plus(
                new BigNumber(accountBalances.subentry_count * 0.5).shiftedBy(
                    7,
                ),
            )
            .toString(10);
        for (let balanceRes of accountBalances.balances) {
            if (!result[account]) {
                result[account] = [] as BalanceResult[];
            }
            if (balanceRes.asset_type == 'native') {
                result[account].push({
                    address: balanceRes.asset_type,
                    value: new BigNumber(balanceRes.balance)
                        .shiftedBy(7)
                        .toString(10),
                    freeze: reserve,
                });
            } else {
                const balance: Horizon.BalanceLineAsset<'credit_alphanum4'> =
                    balanceRes as Horizon.BalanceLineAsset<'credit_alphanum4'>;
                result[account].push({
                    address: balance.asset_issuer,
                    code: balance.asset_code,
                    value: new BigNumber(balanceRes.balance)
                        .shiftedBy(7)
                        .toString(10),
                });
            }
        }
    }

    return result;
};
