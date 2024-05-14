import z from "zod";

export enum SUPPORTED_MESSAGES {
  PONG = "PONG",
  SEND_MESSAGE = "SEND_MESSAGE",
}

export type INCOMING_MESSAGE =
  | {
      type: SUPPORTED_MESSAGES.PONG;
      payload: PongMessageType;
    }
  | {
      type: SUPPORTED_MESSAGES.SEND_MESSAGE;
      payload: UserMessageType;
    };

export const PongMessage = z.object({
  HEARTBEAT_VALUE: z.number(),
});

export type PongMessageType = z.infer<typeof PongMessage>;

export const UserMessage = z.object({
  message: z.string(),
});

export type UserMessageType = z.infer<typeof UserMessage>;
