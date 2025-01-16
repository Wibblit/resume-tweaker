import { NextRequest } from "next/server";
import { Writable, clients } from "@/utils/sse-writable";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return new Response("UserId is required", { status: 400 });
  }

  const { readable, writable } = new TransformStream();
  const writer: Writable = writable.getWriter();

  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "Keep-Alive": "timeout=60", // 60 seconds timeout
  };

  // Add the writer to the clients map
  clients[userId] = clients[userId] || [];
  clients[userId].push(writer);

  // Send initial connection message
  writer.write(`data: ${JSON.stringify({ event: "connected" })}\n\n`);

  // Set up heartbeat (every 15 seconds)
  const heartbeat = setInterval(async () => {
    try {
      await writer.write(`: heartbeat\n\n`);
    } catch (error) {
      clearInterval(heartbeat);
      console.error("Heartbeat failed:", error);
    }
  }, 15000);

  // Force close after 1 minute
  const timeout = setTimeout(() => {
    clearInterval(heartbeat);
    if (clients[userId]) {
      clients[userId] = clients[userId].filter((client) => client !== writer);
      if (clients[userId].length === 0) {
        delete clients[userId];
      }
    }
    writer.write(`data: ${JSON.stringify({ event: "timeout" })}\n\n`);
    writer.close();
  }, 60000); // 1 minute timeout

  // Handle cleanup on connection abort
  req.signal.addEventListener("abort", () => {
    clearInterval(heartbeat);
    clearTimeout(timeout);
    if (clients[userId]) {
      clients[userId] = clients[userId].filter((client) => client !== writer);
      if (clients[userId].length === 0) {
        delete clients[userId];
      }
    }
    writer.close();
  });

  return new Response(readable, { headers });
}
