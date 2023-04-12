import * as dotenv from 'dotenv';
dotenv.config();

const storageConfig = {
  privateKey: process.env.PRIVATE_KEY.split(String.raw`\n`).join('\n'),
  clientEmail: process.env.CLIENT_EMAIL,
  projectId: process.env.PROJECT_ID,
  bucket: process.env.BUCKET,
};
export default storageConfig;
