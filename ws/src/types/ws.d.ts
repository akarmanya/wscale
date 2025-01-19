import { WebSocket } from "ws";

declare module "ws" {
  interface WebSocket {
    isAlive: boolean;
  }
}

import { WebSocket } from "ws";

declare module "ws" {
  interface WebSocket {
    isAlive: boolean;
  }
}

export const enum WS_CHANNELS {
  GLOBAL = "wsGlobal"
} 