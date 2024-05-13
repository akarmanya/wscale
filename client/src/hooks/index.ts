import { useState, useEffect, useRef, SetStateAction } from 'react';

export const useWebSocket = (url: string) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [allMessages, setAllMessages] = useState<
    { content: string; type: 'sent' | 'received' }[]
  >([]);
  const [textFieldValue, setTextFieldValue] = useState('');

  const ws = useRef<WebSocket | null>(null);

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
    ws.current = new WebSocket(url);

    ws.current.addEventListener('error', () => {
      setMessage('WebSocket error');
    });

    ws.current.addEventListener('open', () => {
      setMessage('WebSocket connection established');
      setIsConnected(true);
    });

    ws.current.addEventListener('close', () => {
      setMessage('WebSocket connection closed');
      setIsConnected(false);
    });

    ws.current.addEventListener('message', (msg) => {
      console.log(`Received message: ${msg.data}`);
      setAllMessages((prevMessages) => [
        ...prevMessages,
        {
          content: `Received ${JSON.parse(msg.data).message}`,
          type: 'received',
        },
      ]);
    });
  };

  const closeConnection = () => {
    if (ws.current) {
      ws.current.close();
    }
  };

  const sendMessage = (message: string) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      setMessage('No WebSocket connection established from the client. Connect to WScale');
      return;
    }

    setMessage('');
    setAllMessages((prevMessages) => [
      ...prevMessages,
      { content: `Sent ${message}`, type: 'sent' },
    ]);
    ws.current.send(JSON.stringify({ message }));
  };

  const handleRefresh = () => {
    setAllMessages([]);
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
