require('dotenv').config();
const http = require('http');
const express = require('express');
const multer = require('multer')
const fs = require('fs');
const bluebird = require('bluebird');
const ipfsClient = require('ipfs-http-client');

const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });
const projectId = process.env.PROJECT_ID;
const projectSecret = process.env.SECRET_KEY;
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const ipfs = ipfsClient.create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


app.post('/profile', upload.single('avatar'), async (req, res, next) => {

    let data = Buffer.from(fs.readFileSync(req.file.path));

    setTimeout(async () => {
        const result = await ipfs.add(data);
        console.log(result);
    }, 1000);

    res.send('file uploaded');
});

app.post('/upload', upload.single('avatar'), async (req, res) => {
    try {
        let data = Buffer.from(fs.readFileSync(req.file.path));

        return new bluebird((resolve, reject) => {
            client.add(data).then((response) => {
                resolve(response)
            });
            fs.unlinkSync(req.file.path);
        })
            .then((x) => {
                return res.send(x.path);
            })
            .catch((err) => {
                res.send({ Error: err });
            });
    } catch (err) {
        console.log(err);
    }
});

app.get('/download/:ID', function (req, res) {
    res.redirect('https://ipfs.io/ipfs/' + req.params.ID);
});

const server = http.createServer(app);
server.listen(port, () => console.log(`Server listening on port:${port}`));
