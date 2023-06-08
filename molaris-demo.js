const Moralis = require('moralis');
const fs = require('fs');

(async () => {
    try {
        await Moralis.default.start({
            apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjI0MzI1MTFlLWYzYzctNDhmNS1iZThlLWEwZDkxYTU3NzhlNyIsIm9yZ0lkIjoiMzQxOTg0IiwidXNlcklkIjoiMzUxNTYzIiwidHlwZUlkIjoiNzZjZGFkOWItZjJjMS00OGNkLTk5MmUtMWQxOTE4NWIxZjQyIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2ODYxMzI2ODQsImV4cCI6NDg0MTg5MjY4NH0.GSz89YIOi7E9E2JOEQiata2bZrUZI673QK4YiMSa7J8"
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
