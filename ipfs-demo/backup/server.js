require('dotenv').config();
const express = require('express');
const multer = require('multer')
const fs = require('fs');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });
const projectId = process.env.PROJECT_ID;
const projectSecret = process.env.SECRET_KEY;
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');


app.post('/upload', upload.single('avatar'), async (req, res) => {
    try {
        let data = Buffer.from(fs.readFileSync(req.file.path));

        const url = 'https://ipfs.infura.io:5001/api/v0/add';

        const result = await axios.post(url,
            {
                file: data,
            },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': auth
                }
            }
        );
        console.log(result);
        return res.send({ data: '' });

    } catch (err) {
        console.log(err);
    }
});

app.listen(port, () => console.log(`Server listening on port:${port}`));
