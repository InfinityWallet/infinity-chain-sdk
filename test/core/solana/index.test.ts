import { describe, expect, test } from '@jest/globals';

import { Coins } from '@infinity/core-sdk/lib/commonjs/networks/registry';
import SolanaWallet from '../../../lib/commonjs/core/wallets/solana/index';

const mnemonic =
    'derive lab over dragon nothing pioneer until deputy inherit help next release';
describe('coreSolana', () => {
    test('init', async () => {
        const solanaWallet = new SolanaWallet(Coins.SOLANA, mnemonic, 'my_wallet', 0);
        const address = solanaWallet.getReceiveAddress({
            walletName: 'my_wallet',
            walletAccount: 0,
        });
        expect(address).toBe('HSPjuCaHafg3YUfcQy3iVkLL4g639xHBC9FEiQNzmrWZ');
    });
    test('getTransactions', async () => {
        const solanaWallet = new SolanaWallet(Coins.SOLANA, mnemonic, 'my_wallet', 0);
        const transactions = await solanaWallet.getTransactions({
            walletName: 'my_wallet',
            walletAccount: 0,
        });
        expect(transactions.length > 0).toBe(true);
    });
});
