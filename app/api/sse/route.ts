import { NextRequest } from "next/server";
import { Writable, clients } from "@/utils/sse-writable";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId"); // Extract userId from query parameters

  if (!userId) {
    return new Response("UserId is required", { status: 400 });
  }

  // Create readable and writable streams for the SSE connection
  const { readable, writable } = new TransformStream();
  const writer: Writable = writable.getWriter(); // Get the writable stream's writer

  // Set the headers for SSE
  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  };

  // Add the writer to the clients map
  clients[userId] = clients[userId] || [];
  clients[userId].push(writer);

  // Handle cleanup on connection abort
  req.signal.addEventListener("abort", () => {
    clients[userId] = clients[userId].filter((client) => client !== writer);
    writer.close(); // Close the writer when the connection is closed
  });

  return new Response(readable, { headers });
}
