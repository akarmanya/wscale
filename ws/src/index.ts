// WebSocketServer.ts
console.log("Scaling WebSockets...");

import { WebSocketServer, WebSocket } from "ws";
import express from "express";
import url from "url";
import {
  INCOMING_MESSAGE,
  OUTGOING_MESSAGE,
  OUTGOING_SUPPORTED_MESSAGE,
  SUPPORTED_MESSAGES,
} from "./messages";

import { HEARTBEAT_INTERVAL, HEARTBEAT_VALUE } from "./constants";
import tokenIsValid from "./utils";
import { redisService } from './services/redis';
import { WS_CHANNELS } from './types/ws';

function onSocketPreError(e: Error) {
  console.log(e);
}

function onSocketPostError(e: Error) {
  console.log(e);
}

function ping(ws: WebSocket) {
  ws.send(
    JSON.stringify({
      type: "PING",
      payload: { HEARTBEAT_VALUE: HEARTBEAT_VALUE },
    }),
  );
}

const app = express();
const PORT: string | number = process.env.PORT || 8080;

const httpServer = app.listen(PORT, () => {
  console.log(`HTTP Server is running on PORT ${PORT}`);
});

const wss = new WebSocketServer({ noServer: true });

httpServer.on("upgrade", (req, socket, head) => {
  socket.on("error", onSocketPreError);

  console.log(
    `HTTP Server requesting to upgraded to WSS Server to run on PORT ${PORT}`,
  );

  wss.handleUpgrade(req, socket, head, (ws) => {
    socket.removeListener("error", onSocketPreError);
    wss.emit("connection", ws, req);
  });
});

wss.on("connection", function connection(ws: WebSocket, req) {
  // @ts-ignore
  const token: string = url.parse(req.url, true).query.token || "";
  // const userId = extractUserId(token);

  const checkIfAuthorized = tokenIsValid(token);
  // Perform auth
  if (!token || !checkIfAuthorized) {
    console.log("Unauthorized user received in WScale ws backend");
    // Send an unauthorized message to the client
    ws.send(
      JSON.stringify({
        type: "UNAUTHORIZED",
        payload: {
          message:
            "You are not authorized to connect to the WScale WebSocketServer",
        },
      }),
    );
    // Close the WebSocket connection
    ws.terminate();
    return;
  }
  console.log("Client is authorized and authenticated in WScale ws backend");
  console.log(
    `HTTP protocol is upgraded to WS protocol and is communicating on PORT ${PORT}`,
  );

  ws.isAlive = true;

  ws.on("error", onSocketPostError);

  // Subscribe to the wsGlobal channel
  redisService.subscribe(WS_CHANNELS.GLOBAL, ws);

  ws.on("message", function message(data: any) {
    try {
      const jsonData = JSON.parse(data.toString());
      // console.log("JSON DATA received from client : ", jsonData);

      // jsonData.wscale = "Hi from sanam wscale!";
      // wss.clients.forEach(function each(client) {
      //   if (client.readyState === WebSocket.OPEN) {
      //     client.send(JSON.stringify(jsonData));
      //   }
      // });

      messageHandler(ws, jsonData);
    } catch (error) {
      console.error(error);
    }
  });

  ws.on("close", () => {
    redisService.unsubscribe(ws);
    console.log("Connection closed from ws server");
  });
});

const interval = setInterval(() => {
  console.log("PING initiated from WScale ws backend");
  wss.clients.forEach((client: any) => {
    if (!client.isAlive) {
      client.terminate();
      return;
    }

    client.isAlive = false;
    ping(client);
  });
}, HEARTBEAT_INTERVAL);

wss.on("close", () => {
  clearInterval(interval);
});

function messageHandler(ws: WebSocket, message: INCOMING_MESSAGE) {
  if (message.type == SUPPORTED_MESSAGES.PONG) {
    console.log("PONG received by WScale ws backend!");
    const payload = message.payload;
    if (payload.HEARTBEAT_VALUE == HEARTBEAT_VALUE) {
      ws.isAlive = true;
    }
  }

  if (message.type === SUPPORTED_MESSAGES.SEND_MESSAGE) {
    console.log("JSON DATA received from client : ", message);

    const payload = message.payload;

    const outgoingPayload: OUTGOING_MESSAGE = {
      type: OUTGOING_SUPPORTED_MESSAGE.SEND_MESSAGE,
      payload: {
        message: payload.message,
      },
    };

    // Publish to Redis instead of direct WebSocket broadcast
    redisService.publish(WS_CHANNELS.GLOBAL, outgoingPayload);
  }
}
