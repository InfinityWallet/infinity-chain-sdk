"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const registry_1 = require("@infinity/core-sdk/lib/commonjs/networks/registry");
const index_1 = __importDefault(require("../../../lib/commonjs/core/wallets/solana/index"));
const mnemonic = 'derive lab over dragon nothing pioneer until deputy inherit help next release';
(0, globals_1.describe)('coreSolana', () => {
    (0, globals_1.test)('init', async () => {
        const solanaWallet = new index_1.default(registry_1.Coins.SOLANA, mnemonic, 'my_wallet', 0);
        const address = solanaWallet.getReceiveAddress({
            walletName: 'my_wallet',
            walletAccount: 0,
        });
        (0, globals_1.expect)(address).toBe('HSPjuCaHafg3YUfcQy3iVkLL4g639xHBC9FEiQNzmrWZ');
    });
    (0, globals_1.test)('getTransactions', async () => {
        const solanaWallet = new index_1.default(registry_1.Coins.SOLANA, mnemonic, 'my_wallet', 0);
        const transactions = await solanaWallet.getTransactions({
            walletName: 'my_wallet',
            walletAccount: 0,
        });
        (0, globals_1.expect)(transactions.length > 0).toBe(true);
    });
});
