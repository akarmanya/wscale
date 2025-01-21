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
import { useEffect, useRef } from "react";
import { useWebSocket } from "../hooks";
import { handleEnterKeyPress } from "../utils";
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

  const scrollBoxRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const element = scrollBoxRef.current;
    if (!element) return;

    const parent = element.parentElement;
    if (!parent) return;

    const isScrolledToTop = element.scrollTop > 20;
    const isScrolledToBottom =
      element.scrollHeight - element.scrollTop <= element.clientHeight + 20;

    if (isScrolledToTop) {
      parent.classList.add("scrolled-top");
    } else {
      parent.classList.remove("scrolled-top");
    }

    if (isScrolledToBottom) {
      parent.classList.remove("scrolled-bottom");
    } else {
      parent.classList.add("scrolled-bottom");
    }
  };

  return (
    <>
      <CssBaseline />
      <Container
        sx={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
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
          sx={{
            display: "flex",
            justifyContent: "center",
            flexGrow: 1,
            minHeight: 0,
            mb: 2,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              maxWidth: "80%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "20px",
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0))",
                zIndex: 1,
                opacity: 0,
                transition: "opacity 0.3s",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "20px",
                background:
                  "linear-gradient(to top, rgba(255,255,255,0.9), rgba(255,255,255,0))",
                zIndex: 1,
                opacity: 0,
                transition: "opacity 0.3s",
              },
              "&.scrolled-top::before": {
                opacity: 1,
              },
              "&.scrolled-bottom::after": {
                opacity: 1,
              },
            }}
          >
            <Box
              ref={scrollBoxRef}
              onScroll={handleScroll}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                padding: "1rem",
                overflowY: "auto",
                flexGrow: 1,
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#888",
                  borderRadius: "4px",
                  "&:hover": {
                    background: "#555",
                  },
                },
              }}
            >
              {allMessages.length == 0 ? (
                <Typography
                  variant="body1"
                  style={{ fontFamily: "Courier Prime" }}
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
                          fontFamily: "Courier Prime",
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
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mb: 3,
            mt: "auto",
          }}
        >
          <TextField
            id="outlined-textarea"
            label="Send something to the WScale Server"
            placeholder="Say Hi to the WScale Server"
            multiline
            maxRows={4}
            value={textFieldValue}
            onChange={handleTextFieldChange}
            onKeyDown={(e) => handleEnterKeyPress(e, handleMessageSend)}
            sx={{
              width: "100%",
              maxWidth: "60%",
              "& .MuiOutlinedInput-root": {
                borderRadius: "5px",
                backgroundColor: "#fff",
                fontFamily: "Courier Prime",
              },
            }}
          />
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleMessageSend}
            sx={{
              borderRadius: "5px",
              px: 3,
            }}
          >
            Send
          </Button>
        </Box>

        <Box
          display="flex"
          justifyContent="center"
          mb={2}
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
