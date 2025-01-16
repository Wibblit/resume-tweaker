type Writable = WritableStreamDefaultWriter<any>; // Define Writable as a type alias for stream writers

// Store active SSE connections (grouped by user ID)
const clients: Record<string, Writable[]> = {};

/**
 * Broadcast a message to a specific user via their open SSE connections.
 * @param userId - The ID of the user to send the message to.
 * @param data - The message to send.
 */
export const broadcastToUser = (userId: string, data: object) => {
  if (clients[userId]) {
    clients[userId].forEach((client) => {
      client.write(`data: ${JSON.stringify(data)}\n\n`); // Send data to the client
      client.close(); // Close the client connection after sending the message
    });
    delete clients[userId]; // Remove the user’s connection from the clients object
  }
};

// Export the `clients` object for use in other parts of the application (optional).
export { clients };  export type { Writable };

