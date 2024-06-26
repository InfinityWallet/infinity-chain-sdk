import { Coins } from '@infinity/core-sdk/lib/commonjs/networks/registry';
import { WebSocket } from 'ws';
import { UnsupportedTrezorWebsocket } from '../../../errors/networks';
import config from '@infinity/core-sdk/lib/commonjs/networks/config';

const no_op = () => {};
export class TrezorWebsocket {
    messageID: number;
    url: string;
    connected: boolean;
    wallets: Record<string, string[]> = {};
    pendingMessages: Record<string, any> = {};
    subscribeAddressesId: any;
    ws: WebSocket | undefined;
    subscriptions: any;
    coin: string;
    timeOutInt: NodeJS.Timeout | undefined;
    callbacks: Record<string, any> = {};
    /**
     * Constructs a new instance of the class.
     *
     * @param {Coins} coin - The coin for which the instance is created.
     * @throws {Error} If the URL is not found or is empty.
     */
    constructor(coin: Coins) {
        this.url = config[coin].rpc[0];
        if (!this.url || this.url.length == 0)
            throw new Error(UnsupportedTrezorWebsocket);
        this.messageID = 0;
        this.coin = coin;
        this.connected = false;
        this.wallets = {};
    }
    clean() {
        this.unsubscribeAddresses();
        this.wallets = {};
    }

    /**
     * Sends a message to the server via the WebSocket connection.
     *
     * @param {string} method - The method to be called on the server.
     * @param {Record<string, any>} params - The parameters to be sent to the server.
     * @param {(rs?: any) => void} callback - The callback function to be called after the message is sent.
     * @return {string} The ID of the sent message.
     */
    send(
        method: string,
        params: Record<string, any>,
        callback: (rs?: any) => void,
    ) {
        try {
            if (!this.connected) {
                callback();
            } else {
                let id = this.messageID.toString();
                this.messageID++;
                this.pendingMessages[id] = callback;
                setTimeout(() => {
                    if (this.pendingMessages[id]) callback();
                }, 5000);
                let req = {
                    id,
                    method,
                    params,
                };
                if (this.ws && this.ws.readyState === this.ws.OPEN) {
                    this.ws.send(JSON.stringify(req));
                } else {
                    callback();
                }
                return id;
            }
        } catch (e) {
            console.error(e);
            callback();
        }
    }
    /**
     * Subscribes to a method on the server via WebSocket connection.
     *
     * @param {string} method - The method to be called on the server.
     * @param {Record<string, any>} params - The parameters to be sent to the server.
     * @param {(rs?: any) => void} callback - The callback function to be called after the message is sent.
     * @return {string} The ID of the sent message.
     */
    subscribe(
        method: string,
        params: Record<string, any>,
        callback: (rs?: any) => void,
    ) {
        let ts = this;

        try {
            if (!this.connected) {
                this.connect();
                return;
            }
            let id = this.messageID.toString();
            this.messageID++;
            this.subscriptions[id] = callback;
            let req = {
                id,
                method,
                params,
            };
            if (this.ws == undefined) {
                setTimeout(function () {
                    ts.subscribe(method, params, callback);
                }, 5000);
                return;
            }
            if (this.ws && this.ws.readyState === this.ws.OPEN) {
                this.ws.send(JSON.stringify(req));
                callback();
            } else {
                console.log(
                    '[ERROR] ' +
                        this.coin +
                        ' websockets: Trying to subscribe an address with the connection closed',
                );
            }
            return id;
        } catch (e) {
            console.error(e);
            callback();
        }
    }
    /**
     * Unsubscribes from a method on the server via WebSocket connection.
     *
     * @param {string} method - The method to be called on the server.
     * @param {string} id - The ID of the subscription to be unsubscribed.
     * @param {Record<string, any>} params - The parameters to be sent to the server.
     * @param {(rs?: any) => void} callback - The callback function to be called after the message is sent.
     * @return {string} The ID of the sent message.
     */
    unsubscribe(
        method: string,
        id: string,
        params: Record<string, any>,
        callback: (rs?: any) => void,
    ) {
        let ts = this;

        try {
            delete this.subscriptions[id];
            this.pendingMessages[id] = callback;
            let req = {
                id,
                method,
                params,
            };
            if (this.ws == undefined) {
                setTimeout(function () {
                    ts.unsubscribe(method, id, params, callback);
                }, 5000);
                return;
            }
            if (this.ws && this.ws.readyState === this.ws.OPEN) {
                this.ws.send(JSON.stringify(req));
            } else {
                console.log(
                    '[ERROR] ' +
                        this.coin +
                        ' websockets: Trying to unsubscribe an address with the connection closed',
                );
            }
            return id;
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Subscribes to addresses for a given wallet.
     *
     * @param {string} wallet - The wallet to subscribe to.
     * @param {string[]} accounts - The list of accounts to subscribe to.
     * @param {(pr?: any) => void} callback - The callback function to be called after the subscription.
     */
    subscribeAddresses(
        wallet: string,
        accounts: string[],
        callback: (pr?: any) => void,
    ) {
        if (accounts.length > 50) {
            accounts = accounts.slice(accounts.length - 50, 50);
        }
        accounts = accounts.map(s => s.trim());
        if (this.subscribeAddressesId) {
            this.subscribeAddressesId = '';
        }
        this.callbacks[wallet] = callback;
        this.subscribeAddressesId = this.subscribe(
            'subscribeAddresses',
            { accounts },
            this.callbacks[wallet],
        );
    }

    /**
     * Unsubscribes from addresses by sending an unsubscribe request to the server.
     *
     * This function sends an unsubscribe request to the server using the 'unsubscribeAddresses' method.
     * The unsubscribe request is sent with the subscription ID stored in the 'subscribeAddressesId' property.
     * After the unsubscribe request is sent, the 'subscribeAddressesId' property is set to an empty string.
     *
     * @return {void} This function does not return anything.
     */
    unsubscribeAddresses() {
        let _ = this;
        this.unsubscribe(
            'unsubscribeAddresses',
            this.subscribeAddressesId,
            {},
            () => {
                _.subscribeAddressesId = '';
            },
        );
    }

    get listAddresses() {
        let allAddresses: string[] = [];
        for (let wallet of Object.keys(this.wallets)) {
            allAddresses = [...allAddresses, ...this.wallets[wallet]];
        }
        return allAddresses;
    }

    async connectCoin(accounts: string[], wallet: string) {
        this.wallets[wallet] = accounts;
        this.subscribeAddresses(wallet, accounts, this.callbacks[wallet]);
    }

    /**
     * Connects to the WebSocket server, sets up event handlers for open, close, error, and message,
     * and manages the connection status and messages.
     *
     * @return {void} No return value
     */
    connect() {
        if (this.ws != undefined || this.connected) return;
        this.messageID = 0;
        this.pendingMessages = {};
        this.subscriptions = {};
        this.connected = false;

        let pusher = this;
        this.subscribeAddressesId = '';
        let server = this.url;
        if (server.startsWith('http')) {
            server = server.replace('http', 'ws');
        }
        if (!server.endsWith('/websocket')) {
            server += '/websocket';
        }
        this.ws = new WebSocket(server, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
            },
        });
        this.ws.onopen = function () {
            pusher.connected = true;
            for (let wallet in pusher.wallets) {
                pusher.connectCoin(pusher.wallets[wallet], wallet);
            }
            pusher.timeOutInt = setInterval(function () {
                if (
                    pusher.ws != undefined &&
                    pusher.ws.readyState === pusher.ws.OPEN
                )
                    pusher.send('getInto', {}, no_op);
            }, 20000);
        };
        this.ws.onclose = function () {
            pusher.connected = false;
            console.log(pusher.coin + ' websockets: Disconnected');
            clearInterval(pusher.timeOutInt);
            console.log(
                pusher.coin +
                    ' websocket disconected, reconnecting in 30 seconds',
            );
            pusher.timeOutInt = setTimeout(function () {
                pusher.connect();
            }, 30000);
        };
        this.ws.onerror = function (e) {
            pusher.connected = false;
            console.error(e);
            console.log('[ERROR] ' + pusher.coin + ' websockets: ');
        };
        this.ws.onmessage = async function (e: any) {
            let resp = JSON.parse(e.data);
            let f = pusher.pendingMessages[resp.id];
            if (f != undefined) {
                delete pusher.pendingMessages[resp.id];
                f(resp.data);
            } else {
                f = pusher.subscriptions[resp.id];
                if (f != undefined) {
                    f(resp.data);
                }
            }
        };
    }
}
