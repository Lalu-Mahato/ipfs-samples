require('dotenv').config();
const express = require('express');
const multer = require('multer');
const multerMinIOStorage = require('multer-minio-storage');

const MinioService = require('./minio-services');
const minioService = new MinioService();
const minioClient = require('./minio-config');

const app = express();
const port = process.env.PORT || 3000;
// const upload = multer({ dest: path.join(__dirname + '/uploads') });
const bucketName = 'bucket1';
// const upload = multer({
//     storage: multerMinIOStorage({
//         minioClient: minioClient,
//         bucket: 'bucket1',
//         metadata: function (req, file, cb) {
//             cb(null, { fieldName: file.fieldname });
//         },
//         key: function (req, file, cb) {
//             cb(null, Date.now().toString())
//         }
//     })
// })


// app.post('/upload', upload.single('avatar'), async (req, res) => {
//     const { originalname, path } = req.file;
//     const bucketName = 'bucket1';

//     console.log('FIle: ', req.file);

//     const result = await minioClient.putObject(bucketName, 'image', path);
//     return res.send(result);
// });

// app.post('/upload', upload.single('file'), function (req, res, next) {
//     res.send('Successfully uploaded ' + req.file.originalname);
// })


app.post("/upload", multer({ storage: multer.memoryStorage() }).single("file"), function (request, response) {
    minioClient.putObject(bucketName, request.file.originalname, request.file.buffer, function (error, etag) {
        if (error) {
            return console.log(error);
        }
        response.send(request.file);
    });
});


app.get("/download", function (req, res) {
    const bucketName = 'test';
    const fileName = 'sample_239115.jpg';

    return res.send();
});


app.get('/', async (req, res) => {
    const bucketExists = await minioService.isBucketExists('test');
    // res.redirect(`https://play.minio.io:9000/test/sample_239115.jpg`);

    res.send(bucketExists);
});

app.listen(port, () => console.log(`Server listening on port:${port}`));
