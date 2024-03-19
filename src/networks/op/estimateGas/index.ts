import { TransactionEVM } from '@infinity/core-sdk';
import feeAbi from './feeAbi';
import Web3 from 'web3';

export const estimateL1Cost = async (web3: Web3, tx: TransactionEVM) => {
    const gpo = new web3.eth.Contract(
        feeAbi,
        '0x420000000000000000000000000000000000000F',
    );
    return await gpo.methods.getL1Fee(tx).call();
};