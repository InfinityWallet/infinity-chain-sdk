import { XrplClient } from 'xrpl-client';

export type AccountExists = {
    account: string;
    connector: XrplClient;
};
