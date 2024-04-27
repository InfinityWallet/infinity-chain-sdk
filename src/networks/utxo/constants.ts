import { Coins } from '@infinity/core-sdk/lib/commonjs/networks/registry';

export const DUST: Record<Coins, number> = {
    [Coins.BTC]: 546,
    [Coins.LTC]: 1000,
    [Coins.DOGE]: 50000000,
    [Coins.GRS]: 1000,
    [Coins.FIO]: 0,
    [Coins.STELLAR]: 0,
    [Coins.XRP]: 0,
    [Coins.ETH]: 0,
    [Coins.BNB]: 0,
    [Coins.MATIC]: 0,
    [Coins.ONE]: 0,
    [Coins.CRS]: 0,
    [Coins.VET]: 0,
    [Coins.SOLANA]: 0,
    [Coins.TEZOS]: 0,
    [Coins.AVAX]: 0,
    [Coins.XDC]: 0,
    [Coins.KCC]: 0,
    [Coins.OKX]: 0,
    [Coins.BSC]: 0,
    [Coins.ARB]: 0,
    [Coins.ETH_TESTNET]: 0,
    [Coins.BSC_TESTNET]: 0,
    [Coins.OP]: 0,
    [Coins.BASE]: 0
};
export const WEBSOCKETS: Record<Coins, string> = {
    [Coins.BTC]: 'https://btc1.trezor.io',
    [Coins.LTC]: 'https://ltc1.trezor.io',
    [Coins.DOGE]: 'https://doge1.trezor.io',
    [Coins.GRS]: 'https://blockbook.groestlcoin.org',
    [Coins.FIO]: '',
    [Coins.STELLAR]: '',
    [Coins.XRP]: '',
    [Coins.ETH]: '',
    [Coins.BNB]: '',
    [Coins.MATIC]: '',
    [Coins.ONE]: '',
    [Coins.CRS]: '',
    [Coins.VET]: '',
    [Coins.SOLANA]: '',
    [Coins.TEZOS]: '',
    [Coins.AVAX]: '',
    [Coins.XDC]: '',
    [Coins.KCC]: '',
    [Coins.OKX]: '',
    [Coins.BSC]: '',
    [Coins.ARB]: '',
    [Coins.ETH_TESTNET]: '',
    [Coins.BSC_TESTNET]: '',
    [Coins.OP]: '',
    [Coins.BASE]: ''
};
