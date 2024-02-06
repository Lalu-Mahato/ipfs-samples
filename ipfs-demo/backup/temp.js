require('dotenv').config();
const http = require('http');
const express = require('express');
const multer = require('multer')
const fs = require('fs');
const axios = require('axios');
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


app.post('/profile', upload.single('avatar'), async (req, res) => {
    try {

        let data = Buffer.from(fs.readFileSync(req.file.path));
        console.log('data: ', data);

        // setTimeout(async () => {
        try {
            const result = await ipfs.add(data);
            console.log(result);

            fs.unlinkSync(req.file.path);

            res.send('file uploaded');
        } catch (err) {
            console.log('Error:', err)
        }

        // }, 500);
    } catch (err) {
        return res.status(500).json({ error: err });
    }

    // return ipfs.add(data, (err, files) => {
    //     fs.unlink(req.file.path);
    //     if (files) {
    //         return res.json({path: files.path});
    //     }

    //     return res.status(500).json({ error: err });
    // });
});

app.post('/upload', upload.single('avatar'), async (req, res) => {
    try {
        let data = Buffer.from(fs.readFileSync(req.file.path));


        let result = await axios.post('https://ipfs.infura.io:5001/api/v0/add',
            {
                file: data,

            },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': auth
                }
            },
            { timeout: 2000 }
        )

        console.log();
        // console.log(JSON.parse(JSON.stringify(result)));
        return res.send({ data: result.data });

    } catch (err) {
        console.log(err);
    }
});

app.post('/upload-file', upload.single('avatar'), async (req, res) => {
    try {
        let data = Buffer.from(fs.readFileSync(req.file.path));

        client.add(data).then((response) => {
            fs.unlinkSync(req.file.path);
            console.log('Response: ', response);
            return res.send({ path: response.path });
        });
    } catch (err) {
        console.log(err);
    }
});


app.post('/upload-02', upload.single('avatar'), async (req, res) => {
    try {
        const endpoint = 'https://ipfs.infura.io:5001';
        const formData = new FormData();
        formData.append('file', fs.createReadStream('images.jpeg'));

        axios
            .post(endpoint + '/api/v0/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': auth
                },
                timeout: 60000
            }).then(response => {
                fs.unlinkSync(req.file.path);
                return res.send(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    } catch (err) {
        console.log(err);
    }
});


app.post('/upload-01', upload.single('avatar'), async (req, res) => {
    try {
        let data = Buffer.from(fs.readFileSync(req.file.path));

        let result = await axios.post('https://ipfs.infura.io:5001/api/v0/add',
            { file: data },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': auth
                }
            },
            { timeout: 60000 }
        );

        console.log(result);

        return res.send({ result: [] });
    } catch (err) {
        console.log(err);
    }
});

app.post('/upload-04', upload.single('avatar'), async (req, res) => {
    try {
        const endpoint = 'https://ipfs.infura.io:5001';
        const formData = new FormData();
        formData.append('file', fs.createReadStream('images.jpeg'));

        axios
            .post(endpoint + '/api/v0/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': auth
                },
                timeout: 60000
            }).then(response => {
                fs.unlinkSync(req.file.path);
                return res.send(response.data);
            })
            .catch(error => {
                console.error(error);
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
