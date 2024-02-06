require('dotenv').config();
const express = require('express');
const fs = require('fs');
const ipfs = require('./config/ipfs-config');

const app = express();
const port = process.env.PORT || 3000;
const upload = require('./config/multer-config');
const crypto = require('crypto');

app.get('/', (req, res) => {
    const randomToken = crypto.randomBytes(32).toString('hex');
    return res.send({ randomToken });
});

app.post('/share', upload, async (req, res) => {
    try {

        const { path, filename } = req.file;
        const data = await fs.promises.readFile(path);
        const { cid } = await ipfs.add({ path: filename, content: data }, { pin: true });

        // Delete local file
        await fs.promises.unlink(path);

        const url = `https://ipfs.io/ipfs/${cid}`;
        return res.send({ url });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});


const validateToken = (req, res, next) => {
    const { headers } = req;
    if (!headers || !headers.token) {
        return res.status(400).send('No token found');
    }

    const { token } = headers;
    const validToken = process.env.TOKEN === token;
    if (!validToken) {
        return res.status(401).send('Invalid token');
    }

    next();
};

app.get('/download/:CID', async (req, res) => {
    try {
        const { CID } = req.params;
        return res.redirect(`https://ipfs.io/ipfs/${CID}`);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => console.log(`Server listening on port:${port}`));
