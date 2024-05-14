import { useState, useEffect, useRef, SetStateAction } from "react";

import { HEARTBEAT_TIMEOUT, HEARTBEAT_VALUE } from "../constants";
export const useWebSocket = (url: string) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [allMessages, setAllMessages] = useState<
    { content: string; type: "sent" | "received" }[]
  >([]);
  const [textFieldValue, setTextFieldValue] = useState("");

  const ws = useRef<WebSocketExt | null>(null);

  useEffect(() => {
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleConnectionOpen = () => {
    if (ws.current) {
      ws.current.close();
    }
    ws.current = new WebSocket(url) as WebSocketExt;

    ws.current.addEventListener("error", () => {
      setMessage("WebSocket error");
    });

    ws.current.addEventListener("open", () => {
      setMessage("WebSocket connection established");
      setIsConnected(true);
    });

    ws.current.addEventListener("close", () => {
      setMessage("WebSocket connection closed");
      setIsConnected(false);
    });

    ws.current.addEventListener("message", (msg) => {
      console.log(`Received message: ${msg.data}`);
      const MESSAGE_TYPE = JSON.parse(msg.data).type;
      if (MESSAGE_TYPE === "PING") {
        heartbeat();
      } else if (MESSAGE_TYPE === "SEND_MESSAGE") {
        setAllMessages((prevMessages) => [
          ...prevMessages,
          {
            content: `Received ${JSON.parse(msg.data).payload.message}`,
            type: "received",
          },
        ]);
      }
    });
  };

  const closeConnection = () => {
    if (ws.current) {
      ws.current.close();
    }
  };

  function heartbeat() {
    if (ws.current === null) {
      return;
    } else if (ws.current.pingTimeout !== null) {
      clearTimeout(ws.current.pingTimeout);
    }

    ws.current.pingTimeout = setTimeout(() => {
      ws.current?.close();

      // business logic for deciding whether or not to reconnect
    }, HEARTBEAT_TIMEOUT);

    ws.current.send(
      JSON.stringify({
        type: "PONG",
        payload: {
          HEARTBEAT_VALUE: HEARTBEAT_VALUE,
        },
      }),
    );
  }

  const sendMessage = (message: string) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      handleRefresh();
      setMessage(
        "No WebSocket connection established from the client. Connect to WScale",
      );
      return;
    }

    setMessage("");
    setAllMessages((prevMessages) => [
      ...prevMessages,
      { content: `Sent ${message}`, type: "sent" },
    ]);
    ws.current.send(
      JSON.stringify({
        type: "SEND_MESSAGE",
        payload: {
          message: message,
        },
      }),
    );
  };

  const handleRefresh = () => {
    setAllMessages([]);
    setMessage(
      "No WebSocket connection established from the client. Connect to WScale",
    );
  };

  const handleTextFieldChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setTextFieldValue(event.target.value);
  };

  return {
    isConnected,
    message,
    allMessages,
    textFieldValue,
    handleConnectionOpen,
    closeConnection,
    sendMessage,
    handleRefresh,
    handleTextFieldChange,
  };
};
