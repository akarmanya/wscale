import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import CachedIcon from '@mui/icons-material/Cached';
import SensorsIcon from '@mui/icons-material/Sensors';
import SensorsOffIcon from '@mui/icons-material/SensorsOff';
import { useEffect } from 'react';
import { useWebSocket } from '../hooks';

// let ws: WebSocket;

export const Chat = () => {
  const {
    isConnected,
    message,
    allMessages,
    textFieldValue,
    handleConnectionOpen,
    closeConnection,
    sendMessage,
    handleRefresh,
    handleTextFieldChange,
  } = useWebSocket('ws://localhost:8080');

  const handleConnectionClose = () => {
    closeConnection();
  };

  const handleMessageSend = () => {
    const clientMessage = textFieldValue;

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
          display='flex'
          justifyContent='center'
          mt={2}
          mb={2}
        >
          <ButtonGroup
            disableElevation
            variant='contained'
            aria-label='Disabled button group'
            sx={{ '& > *': { m: 1 } }}
          >
            <Button
              color='success'
              // variant='outlined'
              variant={isConnected ? 'contained' : 'outlined'}
              startIcon={<SensorsIcon />}
              onClick={handleConnectionOpen}
            >
              {isConnected ? 'Connected' : 'Connect'}
            </Button>
            <Button
              color='error'
              // variant='outlined'
              variant={!isConnected ? 'contained' : 'outlined'}
              endIcon={<SensorsOffIcon />}
              onClick={handleConnectionClose}
            >
              {!isConnected ? 'Disconnected' : 'Disconnect'}
            </Button>
          </ButtonGroup>
        </Box>

        <Box
          display='flex'
          justifyContent='center'
          mt={2}
          mb={2}
        >
          <TextField
            id='outlined-textarea'
            label='Send something to the WScale Server'
            placeholder='Say Hi to the WScale Server'
            multiline
            value={textFieldValue}
            onChange={handleTextFieldChange}
            sx={{ width: '100%', maxWidth: '400px' }}
          />
        </Box>

        <Box
          display='flex'
          justifyContent='center'
        >
          <Button
            variant='outlined'
            endIcon={<SendIcon />}
            onClick={handleMessageSend}
          >
            Send
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            '& > :not(style)': {
              m: 2,
              width: '100%',
              maxWidth: '400px',
              height: '100%',
            },
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: '1rem',
            }}
          >
            <Typography
              variant='body1'
              style={{ fontFamily: 'Roboto' }}
            >
              {allMessages.length == 0 ? message : ''}
              {allMessages.map((msg, index) => (
                <div key={index}>
                  {msg.type === 'sent' ? (
                    <p style={{ color: 'blue' }}>{msg.content}</p>
                  ) : (
                    <p style={{ color: 'green' }}>{msg.content}</p>
                  )}
                </div>
              ))}
            </Typography>
          </Paper>
        </Box>

        <Box
          display='flex'
          justifyContent='center'
        >
          <Button
            variant='outlined'
            color='error'
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
