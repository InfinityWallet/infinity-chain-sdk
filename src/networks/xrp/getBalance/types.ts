import { XrplClient } from 'xrpl-client';

export type GetBalanceParams = {
    address: string;
    connector: XrplClient;
};
