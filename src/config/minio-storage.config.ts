import * as dotenv from 'dotenv';
dotenv.config();

const minioStorageConfig = {
  minioHost: process.env.MINIO_HOST,
  minioPort: Number(process.env.MINIO_PORT),
  minioAccessKey: process.env.MINIO_ACCESS_KEY,
  minioSecretKey: process.env.MINIO_SECRET_KEY,
  minioBucketName: process.env.MINIO_BUCKET_NAME,
  useSSL: process.env.MINIO_USE_SSL,
};
export default minioStorageConfig;
