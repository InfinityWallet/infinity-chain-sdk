import { describe, expect, test } from '@jest/globals';

import { Coins } from '@infinity/core-sdk/lib/commonjs/networks/registry';
import EVMWallet from '../../../lib/commonjs/core/wallets/evm';

const mnemonic =
    'double enlist lobster also layer face muffin parade direct famous notice kite';
describe('coreEVM', () => {
    test('init', async () => {
        const evmWallet = new EVMWallet(Coins.MATIC, mnemonic, 'my_wallet', 0);
        const address = evmWallet.getReceiveAddress({
            walletName: 'my_wallet',
            walletAccount: 0,
        });

        expect(address).toBe('0x294F74Fa3632bC426849B2fD7aCaf5e13142f18f');
    });
    test('getTransactions', async () => {
        const evmWallet = new EVMWallet(Coins.MATIC, mnemonic, 'my_wallet', 0);
        const transactions = await evmWallet.getTransactions({
            walletName: 'my_wallet',
            walletAccount: 0,
        });
        expect(transactions.length > 0).toBe(true);
    });
    test('getTransactionsXDC', async () => {
        const evmWallet = new EVMWallet(Coins.XDC, mnemonic, 'my_wallet', 0);
        const transactions = await evmWallet.getTransactions({
            walletName: 'my_wallet',
            walletAccount: 0,
        });
        expect(transactions.length > 0).toBe(false);
    });
});
