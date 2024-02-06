require('dotenv').config();
const express = require('express');
const multer = require('multer');
const minioClient = require('./minio-config');

const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ storage: multer.memoryStorage() });
const bucketName = 'bucket1';


app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const { originalname, buffer } = req.file;

        const etag = await minioClient.putObject(bucketName, "test" + "/" + originalname, buffer);
        return res.send(etag);
    } catch (error) {
        return res.status(501).send(`Error: ${error}`);
    }
});

app.get("/download", async (req, res) => {
    try {
        const { filename } = req.query;

        const stream = await minioClient.getObject(bucketName, "test" + "/" + filename);
        return stream.pipe(res);
    } catch (error) {
        return res.status(501).send(`Error: ${error}`);
    }
});

app.get("/list-buckets", async (req, res) => {
    try {
        console.log('Minio: ', minioClient);
        const buckets = await minioClient.listBuckets();
        return res.send(buckets);
    } catch (error) {
        return res.status(501).send(`Error: ${error}`);
    }
});

app.post("/create-folder", async (req, res) => {
    try {
        const objectName = 'public/';
        const result = await minioClient.putObject(bucketName, objectName, "");
        return res.send(result);
    } catch (error) {
        return res.status(501).send(`Error: ${error}`);
    }
});

app.post("/create-bucket", async (req, res) => {
    try {
        const { bucketName } = req.query;
        const storageClassConfig = {
            standard: 'EC:5',
            rrs: 'EC:3',
        };
        const result = await minioClient.makeBucket(bucketName);
        return res.send(result);
    } catch (error) {
        return res.status(501).send(`Error: ${error}`);
    }
});

app.listen(port, () => console.log(`Server listening on port:${port}`));
