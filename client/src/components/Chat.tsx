import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import CachedIcon from "@mui/icons-material/Cached";
import SensorsIcon from "@mui/icons-material/Sensors";
import SensorsOffIcon from "@mui/icons-material/SensorsOff";
import { useEffect } from "react";
import { useWebSocket } from "../hooks";

// let ws: WebSocket;

export const Chat = () => {
  const {
    isConnected,
    message,
    allMessages,
    textFieldValue,
    setTextFieldValue,
    handleConnectionOpen,
    closeConnection,
    sendMessage,
    handleRefresh,
    handleTextFieldChange,
  } = useWebSocket("ws://localhost");
  /* 
    Client connects to HAProxy on ws://localhost PORT 80
    HAProxy routes the connection to either ws1 or ws2 using round-robin
  */

  const handleConnectionClose = () => {
    closeConnection();
  };

  const handleMessageSend = () => {
    const clientMessage = textFieldValue;
    setTextFieldValue("");
    if (clientMessage.length === 0) {
      return;
    } else {
      sendMessage(clientMessage);
    }
  };

  useEffect(() => {
    console.log(textFieldValue);
  }, [textFieldValue]);

  return (
    <>
      <CssBaseline />
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          mt={2}
          mb={2}
        >
          <ButtonGroup
            disableElevation
            variant="contained"
            aria-label="Disabled button group"
            sx={{ "& > *": { m: 1 } }}
          >
            <Button
              color="success"
              // variant='outlined'
              variant={isConnected ? "contained" : "outlined"}
              startIcon={<SensorsIcon />}
              onClick={handleConnectionOpen}
            >
              {isConnected ? "Connected" : "Connect"}
            </Button>
            <Button
              color="error"
              // variant='outlined'
              variant={!isConnected ? "contained" : "outlined"}
              endIcon={<SensorsOffIcon />}
              onClick={handleConnectionClose}
            >
              {!isConnected ? "Disconnected" : "Disconnect"}
            </Button>
          </ButtonGroup>
        </Box>

        <Box
          display="flex"
          justifyContent="center"
          mt={2}
          mb={2}
        >
          <TextField
            id="outlined-textarea"
            label="Send something to the WScale Server"
            placeholder="Say Hi to the WScale Server"
            multiline
            value={textFieldValue}
            onChange={handleTextFieldChange}
            sx={{ width: "100%", maxWidth: "400px" }}
          />
        </Box>

        <Box
          display="flex"
          justifyContent="center"
        >
          <Button
            variant="outlined"
            endIcon={<SendIcon />}
            onClick={handleMessageSend}
          >
            Send
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            height: "60vh",
            "& > :not(style)": {
              m: 2,
              width: "100%",
              maxWidth: "80%",
              height: "100%",
            },
            marginBottom: "2rem",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: "1rem",
              height: "100%",
              overflowY: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {allMessages.length == 0 ? (
                <Typography
                  variant="body1"
                  style={{ fontFamily: "Roboto" }}
                >
                  {message}
                </Typography>
              ) : (
                allMessages.map((msg, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent:
                        msg.type === "sent" ? "flex-end" : "flex-start",
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: "70%",
                        backgroundColor:
                          msg.type === "sent" ? "#dcf8c6" : "#fff",
                        padding: "0.5rem 1rem",
                        borderRadius: "1rem",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                        border:
                          msg.type === "sent" ? "none" : "1px solid #e0e0e0",
                      }}
                    >
                      <Typography
                        variant="body1"
                        style={{
                          fontFamily: "Roboto",
                          color: "#000000",
                          wordBreak: "break-word",
                        }}
                      >
                        {msg.content.replace(/^(Sent |Received )/, "")}
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Paper>
        </Box>

        <Box
          display="flex"
          justifyContent="center"
        >
          <Button
            variant="outlined"
            color="error"
            endIcon={<CachedIcon />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </Box>
      </Container>
    </>
  );
};
