import { describe, expect, test } from '@jest/globals';
import { buildTransaction } from '../../../lib/commonjs/networks/fio/builder';
import { estimateFee } from '../../../lib/commonjs/networks/fio/estimateFee';
import { getBalance } from '../../../lib/commonjs/networks/fio/getBalance';

import {
    getPrivateMasterKey,
    getRootNode,
} from '@infinity/core-sdk/lib/commonjs/networks/utils/secp256k1';
import { getFIOPrivateAddress } from '@infinity/core-sdk/lib/commonjs/networks/evm/address';

const mnemonic =
    'double enlist lobster also layer face muffin parade direct famous notice kite';
describe('networksFIO', () => {
    test.skip('builder', async () => {
        const rootNode = getRootNode({ mnemonic });
        const privateAccountNode = getPrivateMasterKey({
            bipIdCoin: 235,
            protocol: 44,
            rootNode,
        });
        const privateAddress = getFIOPrivateAddress({
            privateAccountNode,
        });
        const built = await buildTransaction({
            value: '100',
            source: 'FIO5isJA4r93w5SroiiTvsba3tdpsi49Eb3ArGCFMbo3XhrKqFVHR',
            destination:
                'FIO5Y3irLYwTmCA8LZiG25QvXN7g2sRz9RdHVR6RnNNb8Tr7KVXQp',
            privateKey: privateAddress,
        });
        expect(built.signatures.length).toBe(1);
    });
    test.skip('estimateFee', async () => {
        const fee = await estimateFee({
            source: 'FIO5isJA4r93w5SroiiTvsba3tdpsi49Eb3ArGCFMbo3XhrKqFVHR',
        });
        expect(parseInt(fee.fee as string)).toBeGreaterThan(2000000000);
    });
    test.skip('getBalance', async () => {
        const bal = await getBalance(
            'FIO5isJA4r93w5SroiiTvsba3tdpsi49Eb3ArGCFMbo3XhrKqFVHR',
        );
        expect(bal.balance + '').toBe('3684876260');
        expect(bal.available + '').toBe('3684876260');
    });
});
