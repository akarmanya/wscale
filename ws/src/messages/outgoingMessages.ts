export enum SUPPORTED_MESSAGES {
  SEND_MESSAGE = "SEND_MESSAGE",
}

type MESSAGE_PAYLOAD = {
  message?: string;
};

export type OUTGOING_MESSAGE = {
  type: SUPPORTED_MESSAGES.SEND_MESSAGE;
  payload: MESSAGE_PAYLOAD;
};
