import { io, Socket } from "socket.io-client";

export type JobEmail = {
  id: string;
  jobState: "Applied" | "Shortlisted" | "Interviewing" | "Negotiation";
  snippet: string;
  jobRole: string;
  companyName: string;
  location: string;
  workType: string;
  meetingUrl: string;
  date: string;
};

export class SocketManger {
  private static instance: SocketManger;
  private socket: Socket;

  private constructor(token: string) {
    this.socket = io("http://localhost:3001", {
      auth: {
        token: token || ""
      },
      autoConnect: true,
      transports: ["websocket"],
      reconnection: true,
    });
    this.setUpListeners();
  }

  private setUpListeners() {
    this.socket.on("connect", () => {
      console.log("✅ Connected to WebSocket Server:", this.socket.id);
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Disconnected from WebSocket Server");
    });
  }

  public static getInstance(token: string): SocketManger {
    if (!SocketManger.instance) {
      SocketManger.instance = new SocketManger(token);
    }
    return SocketManger.instance;
  }

  public registerUser(userId: string) {
    this.socket.emit("register-user", userId);
  }

  public onNotification(
    callback: (notification: { message: JobEmail[] }) => void
  ) {
    this.socket.on("notification", callback);
  }

  public offNotification(callback: (notification: any) => void) {
    this.socket.off("notification", callback);
  }

  public disconnect() {
    this.socket.disconnect();
  }
}
