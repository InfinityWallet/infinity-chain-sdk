export enum FioErrorCodes {
    INVALID_PUBLIC_KEY = 'INVALID_PUBLIC_KEY', // Invalid public key error
    INVALID_CHAIN_ID = 'INVALID_CHAIN_ID', // Invalid chain ID error
    INVALID_TRANSACTION = 'INVALID_TRANSACTION', // Invalid transaction error
    TRANSACTION_FAILED = 'TRANSACTION_FAILED', // Transaction failed error
    ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND', // Account not found error
    FIO_NAME_NOT_FOUND = 'FIO_NAME_NOT_FOUND', // FIO name not found error
    FIO_DOMAIN_NOT_FOUND = 'FIO_DOMAIN_NOT_FOUND', // FIO domain not found error
    INVALID_FEE = 'INVALID_FEE', // Invalid fee error
    FIO_DOMAIN_ALREADY_REGISTERED = 'FIO_DOMAIN_ALREADY_REGISTERED', // FIO domain already registered error
    FIO_DOMAIN_NOT_REGISTERED = 'FIO_DOMAIN_NOT_REGISTERED', // FIO domain not registered error
    FIO_DOMAIN_EXPIRED = 'FIO_DOMAIN_EXPIRED', // FIO domain expired error
    FIO_DOMAIN_ALREADY_RENEWED = 'FIO_DOMAIN_ALREADY_RENEWED', // FIO domain already renewed error
    FIO_DOMAIN_NOT_RENEWED = 'FIO_DOMAIN_NOT_RENEWED', // FIO domain not renewed error
    FIO_ADDRESS_ALREADY_REGISTERED = 'FIO_ADDRESS_ALREADY_REGISTERED', // FIO address already registered error
    FIO_ADDRESS_NOT_REGISTERED = 'FIO_ADDRESS_NOT_REGISTERED', // FIO address not registered error
    FIO_ADDRESS_EXPIRED = 'FIO_ADDRESS_EXPIRED', // FIO address expired error
    FIO_ADDRESS_ALREADY_RENEWED = 'FIO_ADDRESS_ALREADY_RENEWED', // FIO address already renewed error
    FIO_ADDRESS_NOT_RENEWED = 'FIO_ADDRESS_NOT_RENEWED', // FIO address not renewed error
    FIO_ADDRESS_NO_OWNER = 'FIO_ADDRESS_NO_OWNER', // FIO address has no owner error
    FIO_ADDRESS_MISMATCH_OWNER = 'FIO_ADDRESS_MISMATCH_OWNER', // FIO address owner mismatch error
    FIO_ADDRESS_NO_FUNDS = 'FIO_ADDRESS_NO_FUNDS', // FIO address has no funds error
    FIO_ADDRESS_NOT_PUBLIC = 'FIO_ADDRESS_NOT_PUBLIC', // FIO address not public error
    FIO_ADDRESS_PUBLIC = 'FIO_ADDRESS_PUBLIC', // FIO address public error
    FIO_ADDRESS_NO_AFFILIATION = 'FIO_ADDRESS_NO_AFFILIATION', // FIO address has no affiliation error
    FIO_ADDRESS_NO_DOMAIN = 'FIO_ADDRESS_NO_DOMAIN', // FIO address has no domain error
    FIO_ADDRESS_ALREADY_REGISTERED_DOMAIN = 'FIO_ADDRESS_ALREADY_REGISTERED_DOMAIN', // FIO address already registered under domain error
    FIO_ADDRESS_REGISTERED_DOMAIN = 'FIO_ADDRESS_REGISTERED_DOMAIN', // FIO address registered under domain error
    FIO_ADDRESS_REGISTERED_DIFFERENT_DOMAIN = 'FIO_ADDRESS_REGISTERED_DIFFERENT_DOMAIN' // FIO address registered under different domain error
}