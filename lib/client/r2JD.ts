import { PutObjectCommand } from "@aws-sdk/client-s3";
import r2Client from "@/lib/r2client";

class R2Storage {
  private generateUniqueFileName(extension: string = "html"): string {
    const uuid = crypto.randomUUID();
    const timestamp = Date.now();
    return `${uuid}-${timestamp}.${extension}`;
  }

  public async uploadFile({
    file,
    bucketName,
  }: {
    file: File;
    bucketName: string;
  }): Promise<string> {
    if (!file) {
      throw new Error("No file provided or invalid file type");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split(".").pop() || "bin";
    const uniqueFileName = this.generateUniqueFileName(fileExtension);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueFileName,
      Body: buffer,
    });

    await r2Client.send(command);

    return `https://cdnresumetweaker.wibblit.com/${bucketName}/${uniqueFileName}`;
  }

  public async uploadHtml(slug: string, htmlContent: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_BLOGS,
      Key: `${slug}.html`,
      Body: htmlContent,
      ContentType: "text/html",
    });

    await r2Client.send(command);
    return `https://cdnresumetweaker.wibblit.com/${process.env.R2_BUCKET_BLOGS}/${slug}.html`;
  }

  public async uploadText(
    htmlContent: string
  ): Promise<{ url: string; fileName: string }> {
    const uniqueFileName = this.generateUniqueFileName("html");

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_JDS,
      Key: uniqueFileName,
      Body: htmlContent,
      ContentType: "text/html",
    });

    await r2Client.send(command);
    return {
      url: `https://cdnresumetweaker.wibblit.com/${process.env.R2_BUCKET_JDS}/${uniqueFileName}`,
      fileName: uniqueFileName,
    };
  }
}

// Export an instance of the class for reuse
const r2Storage = new R2Storage();
export default r2Storage;
