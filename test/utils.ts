import Web3 from 'web3';
import { Connection } from '@solana/web3.js';
import { Server } from 'stellar-sdk';
import { TezosToolkit } from '@taquito/taquito';
import { XrplClient } from 'xrpl-client';
import { TrezorWebsocket } from '../lib/commonjs/networks/utxo/trezorWebsocket';
import { Coins } from '@infinity/core-sdk/lib/commonjs/networks/registry';

export const web3Matic = new Web3('https://polygon-rpc.com');
export const web3Op = new Web3(
    'https://optimism-mainnet.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8',
);
export const web3Solana = new Connection('https://solana.twnodes.com/');
export const apiStellar = new Server('https://horizon.stellar.org');
export const web3Tezos = new TezosToolkit('https://mainnet.ecadinfra.com');
export const apiRipple = new XrplClient();
export const connector = new TrezorWebsocket(Coins.LTC);
connector.connect();
