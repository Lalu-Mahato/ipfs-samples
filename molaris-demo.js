require('dotenv').config();
const Moralis = require('moralis');
const fs = require('fs');

(async () => {
    try {
        await Moralis.default.start({
            apiKey: process.env.MOLARIS_API_KEY
        });

        const uploadArray = [
            {
                path: 'sample_239115.jpg',
                content: fs.readFileSync('./sample_239115.jpg', { encoding: 'base64' })
            }
        ];

        const response = await Moralis.default.EvmApi.ipfs.uploadFolder({ abi: uploadArray });

        console.log(response.jsonResponse);
    } catch (e) {
        console.error(e);
    }
})();
