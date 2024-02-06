require('dotenv').config();
const ipfsClient = require('ipfs-http-client');

// const projectId = process.env.PROJECT_ID;
// const secretKey = process.env.SECRET_KEY;
// const auth = 'Basic ' + Buffer.from(projectId + ':' + secretKey).toString('base64');

// const ipfs = ipfsClient.create({
//     host: "ipfs.infura.io",
//     port: 5001,
//     protocol: "https",
//     headers: {
//         authorization: auth,
//     }
// });

const ipfs = ipfsClient.create({
    host: "localhost",
    port: 5001,
    protocol: "http"
});

module.exports = ipfs;
