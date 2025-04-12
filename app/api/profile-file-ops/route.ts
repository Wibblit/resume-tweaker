import { NextRequest, NextResponse } from "next/server";
import { uploadFileToR2 } from "@/utils/upload";
import { deleteFileFromR2 } from "@/utils/delete";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File;

    const url = await uploadFileToR2({
      file: file,
      //@ts-ignore
      bucketName: process.env.R2_BUCKET_PROFILE,
    });

    return NextResponse.json(
      { message: "File uploaded successfully", url: url },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file " },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const fileUrl = url.searchParams.get("file");

    if (!fileUrl) {
      return NextResponse.json(
        { error: "File URL is required" },
        { status: 400 }
      );
    }

    // Extract bucket name and filename from the provided URL
    const parsedUrl = new URL(fileUrl);
    const pathParts = parsedUrl.pathname.split("/").filter(Boolean); // Remove empty parts

    if (pathParts.length < 2) {
      return NextResponse.json(
        { error: "Invalid file URL format" },
        { status: 400 }
      );
    }

    const bucketName = pathParts[0]; // First part is the bucket name
    const fileName = pathParts.slice(1).join("/"); // Remaining part is the file path

    // Use the deleteFileFromR2 function
    const isDeleted = await deleteFileFromR2({ bucketName, fileName });

    if (!isDeleted) {
      return NextResponse.json(
        { error: "Failed to delete file" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Error deleting file" }, { status: 500 });
  }
}
