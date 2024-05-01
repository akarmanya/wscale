import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import SensorsIcon from "@mui/icons-material/Sensors";
import SensorsOffIcon from "@mui/icons-material/SensorsOff";

export const Chat = () => {
  return (
    <>
      <CssBaseline />
      <Container>
        <Box display="flex" justifyContent="center" mt={2} mb={2}>
          <ButtonGroup
            disableElevation
            variant="contained"
            aria-label="Disabled button group"
            sx={{ "& > *": { m: 1 } }}
          >
            <Button
              color="success"
              variant="outlined"
              startIcon={<SensorsIcon />}
            >
              Connect
            </Button>
            <Button
              color="error"
              variant="outlined"
              endIcon={<SensorsOffIcon />}
            >
              Disconnect
            </Button>
          </ButtonGroup>
        </Box>

        <Box display="flex" justifyContent="center" mt={2} mb={2}>
          <TextField
            id="outlined-textarea"
            label="Send something to the WScale Server"
            placeholder="Say Hi to the WScale Server"
            multiline
            sx={{ width: "100%", maxWidth: "400px" }}
          />
        </Box>

        <Box display="flex" justifyContent="center">
          <Button variant="contained" endIcon={<SendIcon />}>
            Send
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            "& > :not(style)": {
              m: 2,
              width: "100%",
              maxWidth: "400px",
              height: "100%",
            },
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: "1rem",
            }}
          >
            <Typography variant="body1" style={{ fontFamily: "Courier Prime" }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti,
              libero? Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Iste dolor odit qui pariatur vero, id illo. Corrupti incidunt,
              eligendi dolores, aspernatur fuga nemo culpa, vero natus quod
              perspiciatis inventore fugiat. Alias quo quos suscipit numquam
              sunt consequatur quia possimus debitis placeat veniam. Quos unde
              ea molestiae? Distinctio non enim ex repellat facere numquam.
              Possimus ad impedit ab voluptate recusandae ipsam unde quia maxime
              facere fugit, excepturi nihil inventore suscipit odit ex
              repellendus magni illum perspiciatis itaque facilis quam? Ipsum
              eum ut aperiam libero hic dignissimos ipsam nesciunt praesentium
              eveniet mollitia quisquam repudiandae, quam neque ab magnam magni.
              Distinctio odit illo quos sed amet omnis similique!
              Necessitatibus, illum nemo similique eius aliquam nesciunt ullam
              molestiae error voluptatum facere perspiciatis. Rem temporibus
              similique perferendis! Distinctio, libero fuga maiores veritatis
              voluptatibus dolorum quidem hic nihil quasi illo fugit.
              Perspiciatis laboriosam quos id cum culpa, nulla quidem sapiente
              temporibus voluptatum in facilis doloribus rerum, esse sed sunt
              odit ducimus beatae deserunt exercitationem dignissimos. Autem
              perferendis quisquam commodi et accusamus ab rerum sed iusto
              dolores rem ipsa fugit, quo voluptates quia voluptatum beatae
              doloremque illum inventore sint dicta distinctio. Voluptates,
              numquam iste, consectetur ipsam at corporis reiciendis obcaecati
              architecto reprehenderit sequi modi officiis, labore et!
            </Typography>
          </Paper>
        </Box>
      </Container>
    </>
  );
};
