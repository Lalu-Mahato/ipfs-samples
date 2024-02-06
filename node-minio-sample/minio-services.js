const minioClient = require('./minio-config');

class MinioService {
    async isBucketExists(bucketName) {
        return minioClient.bucketExists(bucketName);
    }

    async uploadFile(bucketName, fileName, filePath) {
        return minioClient.putObject(bucketName, fileName, filePath);
    }
}

module.exports = MinioService;
