require('dotenv').config();
const http = require('http');
const express = require('express');
const multer = require('multer')
const fs = require('fs');
const axios = require('axios');
const ipfsClient = require('ipfs-http-client');
const FormData = require('form-data');
const bluebird = require('bluebird');
const ErrorHelper = require('./utils/error-helper');

const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });
const projectId = process.env.PROJECT_ID;
const projectSecret = process.env.SECRET_KEY;
const url = 'https://ipfs.infura.io:5001/api/v0/add';

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = ipfsClient.create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
        authorization: auth,
    },
    timeout: '2m'
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


const uploadFileToIPFS = (data) => {
    return new Promise((resolve, reject) => {
        client.add(data)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
};
app.post('/share', upload.single('avatar'), async (req, res) => {
    try {
        let data = Buffer.from(fs.readFileSync(req.file.path));

        uploadFileToIPFS(data)
            .then(response => {
                return res.send(response.path);
            })
            .catch(error => {
                res.send({ Error: error });
            });


        // const result = await axios.post(url,
        //     { file: data },
        //     {
        //         headers: {
        //             'Content-Type': 'multipart/form-data',
        //             'Authorization': auth
        //         }
        //     }, { timeout: 60000 },
        // );
        // await fs.unlink(req.file.path);
        // console.log(result.data);
        // return res.send(result.data);
    } catch (err) {
        const appError = ErrorHelper.error(err);
        console.log('Errrrrrrrrrrrrr: ', appError);
        return res.send(501, 'Error', err);
    }
});


app.get('/list', async (req, res) => {

    User.find({}, (err, data) => {
        if (err) {
            console.log(err);
        }
        return data;
    });

    await User.find({});

})

const server = http.createServer(app);
server.listen(port, () => console.log(`Server listening on port:${port}`));
