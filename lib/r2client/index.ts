import { S3Client } from "@aws-sdk/client-s3";

const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
  throw new Error("R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY must be defined");
}

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.ENDPOINT,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export default r2Client;
