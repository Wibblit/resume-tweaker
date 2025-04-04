import { WritableStreamDefaultWriter } from "stream/web";

type Writable = {
  write: (chunk: string) => Promise<void>;
  close: () => Promise<void>;
  closed: Promise<void>; // Ensure this matches WritableStreamDefaultWriter<any>
};
const clients: Record<string, Writable[]> = {};

export const broadcastToUser = async (userId: string, data: object) => {
  if (clients[userId]) {
    try {
      await Promise.all(
        clients[userId].map(async (client) => {
          try {
            await client.write(`data: ${JSON.stringify(data)}\n\n`);
            await client.close();
          } catch (error) {
            console.error("Error sending message to client:", error);
          }
        })
      );
    } catch (error) {
      console.error("Error broadcasting to user:", error);
    }
    delete clients[userId];
  }
};

export { clients };
export type { Writable };
