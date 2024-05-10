import { GeneralApiParams } from '../../types';
import { pull as pullEtherscan } from '../../etherscan/general/pull';
import { Coins } from '@infinity/core-sdk/lib/commonjs/networks';

export const pull = (props: GeneralApiParams) => {
    return pullEtherscan({ ...props, coinId: Coins.KCC });
};
