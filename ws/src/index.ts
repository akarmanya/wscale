console.log("Scaling WebSockets...");

// WebSocketServer.ts

import { WebSocketServer, WebSocket } from "ws";
import express from "express";

function onSocketPreError(e: Error) {
  console.log(e);
}

function onSocketPostError(e: Error) {
  console.log(e);
}

const app = express();
const PORT: string | number = process.env.PORT || 8080;

const httpServer = app.listen(PORT, () => {
  console.log(`HTTP Server is running on PORT ${PORT}`);
});

const wss = new WebSocketServer({ noServer: true });

httpServer.on("upgrade", (req, socket, head) => {
  socket.on("error", onSocketPreError);

  wss.handleUpgrade(req, socket, head, (ws) => {
    socket.removeListener("error", onSocketPreError);
    wss.emit("connection", ws, req);
  });
});

wss.on("connection", function connection(ws: WebSocket, req) {
  console.log(
    `HTTP Server upgraded to WSS Server and is running on PORT ${PORT}`,
  );

  ws.on("error", onSocketPostError);

  ws.on("message", function message(data: any) {
    try {
      const jsonData = JSON.parse(data.toString());
      console.log("JSON DATA received from client : ", jsonData);
      jsonData.wscale = "Hi from sanam wscale!";

      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(jsonData));
        }
      });
    } catch (error) {
      console.error(error);
    }
  });

  ws.on("close", () => {
    console.log("Connection closed from ws server");
  });
});
