const ipfsClient = require('ipfs-http-client');
const config = require('@app-config');

class IPFS {
    constructor() {
        const { username, password } = config.ipfs;
        const auth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

        this.ipfs = ipfsClient.create({
            host: 'localhost',
            port: 5001,
            protocol: 'http',
            headers: {
                Authorization: auth
            }
        });
    }

    async addFile(file) {
        try {
            const { path, filename } = file;
            const data = await fs.promises.readFile(path);
            const { cid } = await this.ipfs.add({ path: filename, content: data }, { pin: true });
            return `${cid}`;
        } catch (err) {
            throw err;
        }
    }

    async uploadFile(files) {
        try {
            if (files.length > 1) {
                const cids = await Promise.all(files.map(async (file) => await this.addFile(file)));
                return cids;
            } else {
                return this.addFile(files[0]);
            }
        } catch (err) {
            throw err;
        }
    }

    async getDownloadUrl(cid) {
        try {
            const { publicUrl } = config.ipfs;
            return `${publicUrl}/${cid}`;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = IPFS;
