"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const builder_1 = require("../../../lib/commonjs/networks/utxo/builder");
const secp256k1_1 = require("@infinity/core-sdk/lib/commonjs/networks/utils/secp256k1");
const networks_1 = __importDefault(require("@infinity/core-sdk/lib/commonjs/networks/networks"));
const utils_1 = require("../../utils");
const utils_2 = require("../../../lib/commonjs/networks/solana/utils");
const index_1 = require("../../../lib/commonjs/networks/utxo/estimateFee/index");
const index_2 = require("../../../lib/commonjs/networks/utxo/getBalance/index");
const getUTXO_1 = require("../../../lib/commonjs/networks/utxo/getUTXO");
const getLastChangeIndex_1 = require("../../../lib/commonjs/networks/utxo/getLastChangeIndex");
//import { sendTransaction } from '../../../lib/commonjs/networks/utxo/sendTransaction';
const core_1 = require("@infinity/core-sdk/lib/commonjs/core");
const mnemonic = 'double enlist lobster also layer face muffin parade direct famous notice kite';
(0, globals_1.describe)('networksUTXO', () => {
    (0, globals_1.test)('builder', async () => {
        while (!utils_1.connector.connected) {
            await (0, utils_2.sleep)(500);
        }
        const privateAccountNode = (0, secp256k1_1.getPrivateMasterKey)({
            rootNode: (0, secp256k1_1.getRootNode)({ mnemonic, network: networks_1.default['ltc'] }),
            bipIdCoin: 2,
            protocol: 44,
        });
        const xpub = (0, secp256k1_1.encodeGeneric)(privateAccountNode.neutered().toBase58(), 'xpub');
        const build = await (0, builder_1.buildTransaction)({
            amount: '10000',
            coinId: 'ltc',
            destination: 'LZg4esEAthGQpg4QshXf7CwJi8XLhQdPDx',
            accounts: [
                {
                    node: privateAccountNode,
                    extendedPublicKey: xpub,
                    useAsChange: true,
                },
            ],
            connector: utils_1.connector,
        });
        (0, globals_1.expect)(build?.hex?.length > 0).toBe(true);
    });
    (0, globals_1.test)('getFeePerByte', async () => {
        while (!utils_1.connector.connected) {
            console.log(utils_1.connector.connected);
            await (0, utils_2.sleep)(500);
        }
        const fee = await (0, index_1.getFeePerByte)({ connector: utils_1.connector });
        (0, globals_1.expect)(new core_1.BigNumber(fee.low).toNumber()).toBeGreaterThan(0);
        (0, globals_1.expect)(new core_1.BigNumber(fee.high).toNumber()).toBeGreaterThan(0);
    });
    (0, globals_1.test)('estimateFee', async () => {
        while (!utils_1.connector.connected) {
            console.log(utils_1.connector.connected);
            await (0, utils_2.sleep)(500);
        }
        const privateAccountNode = (0, secp256k1_1.getPrivateMasterKey)({
            rootNode: (0, secp256k1_1.getRootNode)({ mnemonic, network: networks_1.default['ltc'] }),
            bipIdCoin: 2,
            protocol: 44,
        });
        const xpub = (0, secp256k1_1.encodeGeneric)(privateAccountNode.neutered().toBase58(), 'xpub');
        const estimate = await (0, index_1.estimateFee)({
            amount: '10000',
            coinId: 'ltc',
            extendedPublicKeys: [xpub],
            connector: utils_1.connector,
        });
        (0, globals_1.expect)(new core_1.BigNumber(estimate.fee).toNumber()).toBeGreaterThan(0);
    });
    (0, globals_1.test)('getBalance', async () => {
        while (!utils_1.connector.connected) {
            console.log(utils_1.connector.connected);
            await (0, utils_2.sleep)(500);
        }
        const privateAccountNode = (0, secp256k1_1.getPrivateMasterKey)({
            rootNode: (0, secp256k1_1.getRootNode)({ mnemonic, network: networks_1.default['ltc'] }),
            bipIdCoin: 2,
            protocol: 44,
        });
        const xpub = (0, secp256k1_1.encodeGeneric)(privateAccountNode.neutered().toBase58(), 'xpub');
        const balance = await (0, index_2.getBalance)({
            extendedPublicKeys: [xpub],
            connector: utils_1.connector,
        });
        (0, globals_1.expect)(new core_1.BigNumber(balance.balance).toNumber()).toBeGreaterThan(-1);
    });
    (0, globals_1.test)('getAccountBalances', async () => {
        while (!utils_1.connector.connected) {
            console.log(utils_1.connector.connected);
            await (0, utils_2.sleep)(500);
        }
        const privateAccountNode = (0, secp256k1_1.getPrivateMasterKey)({
            rootNode: (0, secp256k1_1.getRootNode)({ mnemonic, network: networks_1.default['ltc'] }),
            bipIdCoin: 2,
            protocol: 44,
        });
        const xpub = (0, secp256k1_1.encodeGeneric)(privateAccountNode.neutered().toBase58(), 'xpub');
        const balance = await (0, index_2.getAccountBalances)({
            extendedPublicKeys: [xpub],
            connector: utils_1.connector,
        });
        (0, globals_1.expect)(new core_1.BigNumber(balance[Object.keys(balance)[0]][0].value).toNumber()).toBeGreaterThan(-1);
    });
    (0, globals_1.test)('getUTXO', async () => {
        while (!utils_1.connector.connected) {
            console.log(utils_1.connector.connected);
            await (0, utils_2.sleep)(500);
        }
        const privateAccountNode = (0, secp256k1_1.getPrivateMasterKey)({
            rootNode: (0, secp256k1_1.getRootNode)({ mnemonic, network: networks_1.default['ltc'] }),
            bipIdCoin: 2,
            protocol: 44,
        });
        const xpub = (0, secp256k1_1.encodeGeneric)(privateAccountNode.neutered().toBase58(), 'xpub');
        const utxo = await (0, getUTXO_1.getUTXO)({
            extendedPublicKey: xpub,
            connector: utils_1.connector,
        });
        (0, globals_1.expect)(utxo.length).toBeGreaterThan(-1);
    });
    (0, globals_1.test)('getLastChangeIndex', async () => {
        while (!utils_1.connector.connected) {
            console.log(utils_1.connector.connected);
            await (0, utils_2.sleep)(500);
        }
        const privateAccountNode = (0, secp256k1_1.getPrivateMasterKey)({
            rootNode: (0, secp256k1_1.getRootNode)({ mnemonic, network: networks_1.default['ltc'] }),
            bipIdCoin: 2,
            protocol: 44,
        });
        const xpub = (0, secp256k1_1.encodeGeneric)(privateAccountNode.neutered().toBase58(), 'xpub');
        const { index, protocol } = await (0, getLastChangeIndex_1.getLastChangeIndex)({
            extendedPublicKey: xpub,
            connector: utils_1.connector,
        });
        (0, globals_1.expect)(index).toBeGreaterThan(-1);
        (0, globals_1.expect)(protocol).toBe(44);
    });
    /*
    test('sendTransaction', async () => {
        while (!connector.connected) {
            console.log(connector.connected);
            await sleep(500);
        }
        const privateAccountNode = getPrivateMasterKey({
            rootNode: getRootNode({ mnemonic, network: networks['ltc'] }),
            bipIdCoin: 2,
            protocol: 44,
        });
        const xpub = encodeGeneric(
            privateAccountNode.neutered().toBase58(),
            'xpub',
        );
        const build = await buildTransaction({
            amount: '10000',
            coinId: 'ltc',
            destination: 'LZg4esEAthGQpg4QshXf7CwJi8XLhQdPDx',
            accounts: [
                {
                    node: privateAccountNode,
                    extendedPublicKey: xpub,
                    useAsChange:true
                },
            ],
            connector,
        });
        const txhash = await sendTransaction({
            connector,
            rawTransaction: build.hex,
        });
        expect(txhash.length).toBeGreaterThan(0);
    });*/
});
