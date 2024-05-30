"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ed25519_1 = require("@infinity/core-sdk/lib/commonjs/networks/ed25519");
const globals_1 = require("@jest/globals");
const builder_1 = require("../../../lib/commonjs/networks/xrp/builder");
const estimateFee_1 = require("../../../lib/commonjs/networks/xrp/estimateFee");
const utils_1 = require("../../utils");
const core_1 = require("@infinity/core-sdk/lib/commonjs/core");
const getBalance_1 = require("../../../lib/commonjs/networks/xrp/getBalance");
const registry_1 = require("@infinity/core-sdk/lib/commonjs/networks/registry");
const mnemonic = 'raw green cereal demand genius mansion pistol couple surround divide chef shadow';
(0, globals_1.describe)('networksXRP', () => {
    (0, globals_1.test)('builder', async () => {
        const seed = (0, ed25519_1.getSeed)({ mnemonic });
        const keyPair = (0, ed25519_1.getKeyPair)({
            seed,
            path: "m/44'/144'/0'/0/0",
            walletAccount: 0,
        });
        const publicAddress = (0, ed25519_1.getPublicXRPAddress)({
            publicKey: (0, ed25519_1.getPublicKey)({ keyPair, bipIdCoin: registry_1.CoinIds.XRP }),
        });
        const built = await (0, builder_1.buildTransaction)({
            from: publicAddress,
            to: 'raCRsF2Lv6xRcAxTJq55x21ms2TUNrRCCJ',
            amount: '10',
            keyPair,
            connector: utils_1.apiRipple,
            memo: '123456',
        });
        (0, globals_1.expect)(built.length > 0).toBe(true);
    });
    (0, globals_1.test)('estimateFee', async () => {
        const fee = await (0, estimateFee_1.estimateFee)({
            connector: utils_1.apiRipple,
        });
        (0, globals_1.expect)(new core_1.BigNumber(fee?.fee).toNumber()).toBeGreaterThan(10);
    });
    (0, globals_1.test)('getBalance', async () => {
        const seed = (0, ed25519_1.getSeed)({ mnemonic });
        const keyPair = (0, ed25519_1.getKeyPair)({
            seed,
            path: "m/44'/144'/0'/0/0",
            walletAccount: 0,
        });
        const publicAddress = (0, ed25519_1.getPublicXRPAddress)({
            publicKey: (0, ed25519_1.getPublicKey)({ keyPair, bipIdCoin: registry_1.CoinIds.XRP }),
        });
        const balanceResult = await (0, getBalance_1.getBalance)({
            address: publicAddress,
            connector: utils_1.apiRipple,
        });
        (0, globals_1.expect)(balanceResult.balance).toBe('12000000');
    });
    /*

    test('sendTransaction', async () => {
        const seed = getSeed({ mnemonic });
        const keyPair = getKeyPair({ seed, path: "m/44'/144'/0'/0/0" });
        const publicAddress = getPublicXRPAddress({
            publicKey: getPublicKey({ keyPair, coinId: CoinIds.XRP }),
        });

        const rawTransaction = await buildTransaction({
            from: publicAddress,
            to: 'raCRsF2Lv6xRcAxTJq55x21ms2TUNrRCCJ',
            amount: '10',
            keyPair,
            connector: apiRipple,
            memo: '123123',
        });
        const result = await sendTransaction({
            rawTransaction,
            connector: apiRipple,
        });
        expect(result.length).toBeGreaterThan(0);
    });
    */
});
