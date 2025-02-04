import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import r2Client from "@/lib/r2client";

interface DeleteFileFromR2 {
  bucketName: string;
  fileName: string;
}

export async function deleteFileFromR2({
  bucketName,
  fileName,
}: DeleteFileFromR2): Promise<boolean> {
  if (!fileName || !bucketName) {
    throw new Error("Bucket name and file name are required.");
  }

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: fileName,
  });

  try {
    await r2Client.send(command);
    return true; // Indicating success
  } catch (error) {
    console.error("Error deleting file from R2:", error);
    return false; // Indicating failure
  }
}
