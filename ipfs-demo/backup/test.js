const IPFS = require('ipfs-core');

(async () => {
    const ipfs = await IPFS.create();
    const { cid } = await ipfs.add('Hello world');
    console.info(cid);
})();