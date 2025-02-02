import { PutObjectCommand } from "@aws-sdk/client-s3";
import r2Client from "@/lib/r2client";

interface uploadFileToR2 {
  file: File;
  bucketName: string;
}

export async function uploadFileToR2({
  file,
  bucketName,
}: uploadFileToR2): Promise<string> {
  console.log("You got me", bucketName, file);

  if (!file) {
    throw new Error("No file provided or invalid file type");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uuid = crypto.randomUUID();
  const timestamp = Date.now();
  const fileExtension = file.name.split(".").pop();
  const uniqueFileName = `${uuid}-${timestamp}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: uniqueFileName,
    Body: buffer,
  });

  await r2Client.send(command);

  return `https://${process.env.R2_ACCOUNT_ID}.${bucketName}.r2.cloudflarestorage.com/${uniqueFileName}`;
}
