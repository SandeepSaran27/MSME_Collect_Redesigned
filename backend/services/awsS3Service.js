const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client, hasAwsCredentials } = require('../config/aws');
const fs = require('fs');
const path = require('path');

class AwsS3Service {
  /**
   * Upload file to AWS S3 or fallback to local disk
   */
  async uploadDocument(file, userId) {
    const bucketName = process.env.S3_BUCKET_NAME;

    if (hasAwsCredentials && s3Client && bucketName) {
      try {
        const fileStream = fs.createReadStream(file.path);
        const s3Key = `documents/user_${userId}/${Date.now()}_${path.basename(file.originalname)}`;

        const uploadParams = {
          Bucket: bucketName,
          Key: s3Key,
          Body: fileStream,
          ContentType: file.mimetype,
        };

        await s3Client.send(new PutObjectCommand(uploadParams));
        
        // Remove local file after successful S3 upload
        fs.unlink(file.path, () => {});

        return {
          storageType: 'S3',
          fileUrl: `https://${bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${s3Key}`,
          s3Key: s3Key,
        };
      } catch (err) {
        console.warn('S3 upload failed, using local upload storage:', err.message);
      }
    }

    // Local disk fallback
    return {
      storageType: 'LOCAL',
      fileUrl: `/uploads/${file.filename}`,
      s3Key: null,
    };
  }

  async deleteDocument(fileUrl, s3Key) {
    const bucketName = process.env.S3_BUCKET_NAME;
    if (s3Key && hasAwsCredentials && s3Client && bucketName) {
      try {
        await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: s3Key }));
      } catch (err) {
        console.error('Failed to delete S3 file:', err.message);
      }
    }
  }
}

module.exports = new AwsS3Service();
