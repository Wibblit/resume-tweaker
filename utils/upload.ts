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

  return `https://cdnresumetweaker.wibblit.com/${bucketName}/${uniqueFileName}`;
}

export async function uploadHtmlToR2(slug: string, htmlContent: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_BLOGS,
    Key: `${slug}.html`,
    Body: htmlContent,
    ContentType: "text/html",
  });

  await r2Client.send(command);
  return `https://cdnresumetweaker.wibblit.com/${process.env.R2_BUCKET_BLOGS}/${slug}.html`;
}
