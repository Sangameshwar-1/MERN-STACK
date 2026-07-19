const net = require('net');

class CacheXClient {
    constructor(host = process.env.CACHEX_HOST || '127.0.0.1', port = 6379) {
        this.host = host;
        this.port = port;
        this.client = new net.Socket();
        this.connected = false;
        
        this.connect();
    }

    connect() {
        this.client.connect(this.port, this.host, () => {
            console.log(`[CacheX] Connected to ${this.host}:${this.port}`);
            this.connected = true;
        });

        this.client.on('error', (err) => {
            console.error('[CacheX] Connection Error:', err.message);
            this.connected = false;
        });

        this.client.on('close', () => {
            if (this.connected) {
                console.log('[CacheX] Connection closed. Reconnecting in 5s...');
                this.connected = false;
                setTimeout(() => this.connect(), 5000);
            }
        });
    }

    _sendCommand(command) {
        return new Promise((resolve, reject) => {
            if (!this.connected) {
                return resolve(null); // Fail gracefully if cache is down
            }

            const onData = (data) => {
                this.client.removeListener('data', onData);
                this.client.removeListener('error', onError);
                resolve(data.toString().trim());
            };

            const onError = (err) => {
                this.client.removeListener('data', onData);
                this.client.removeListener('error', onError);
                resolve(null); // Fail gracefully
            };

            this.client.once('data', onData);
            this.client.once('error', onError);
            
            this.client.write(`${command}\n`);
        });
    }

    /**
     * Get a value from CacheX
     * @param {string} key 
     * @returns {Promise<any>} Parsed JSON or null
     */
    async get(key) {
        const res = await this._sendCommand(`GET ${key}`);
        if (!res || res === '(nil)') return null;
        try {
            return JSON.parse(res);
        } catch (e) {
            return res; // Return raw string if not JSON
        }
    }

    /**
     * Set a value in CacheX
     * @param {string} key 
     * @param {any} value 
     * @param {number} ttl_sec Time to live in seconds (optional)
     * @returns {Promise<boolean>}
     */
    async set(key, value, ttl_sec = 0) {
        let strVal;
        if (typeof value === 'object') {
            strVal = JSON.stringify(value);
        } else {
            strVal = value.toString();
        }

        // CacheX custom protocol doesn't support spaces inside values. 
        // We MUST base64 encode JSON to store it safely as a single string token.
        const encodedVal = Buffer.from(strVal).toString('base64');

        let cmd = `SET ${key} ${encodedVal}`;
        if (ttl_sec > 0) {
            cmd += ` EX ${ttl_sec}`;
        }
        
        const res = await this._sendCommand(cmd);
        return res === 'OK';
    }

    /**
     * Get and decode a base64 value from CacheX
     * @param {string} key 
     */
    async getJSON(key) {
        const res = await this._sendCommand(`GET ${key}`);
        if (!res || res === '(nil)') return null;
        try {
            const decoded = Buffer.from(res, 'base64').toString('utf-8');
            return JSON.parse(decoded);
        } catch (e) {
            console.error('[CacheX] JSON Parse Error:', e);
            return null;
        }
    }

    /**
     * Delete a key
     * @param {string} key 
     */
    async del(key) {
        const res = await this._sendCommand(`DEL ${key}`);
        return res === 'OK';
    }

    /**
     * Clear all keys
     */
    async clear() {
        await this._sendCommand('CLEAR');
    }
}

const cachex = new CacheXClient();
module.exports = cachex;
