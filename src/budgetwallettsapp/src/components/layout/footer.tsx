import { FC } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

const Footer: FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        py: 1,
        position: "fixed",
        bottom: 0,
        width: "100%",
        zIndex: 1000,
        background: "linear-gradient(to right, #35424a, #a7b6bd)",
      }}
    >
      <Container
        maxWidth="sm"
        style={{
          textAlign: "center",
        }}
      >
        <IconButton aria-label="facebook" href="#">
          <FacebookIcon />
        </IconButton>
        <IconButton aria-label="linkedin" href="#">
          <LinkedInIcon />
        </IconButton>
        <IconButton aria-label="github" href="#">
          <GitHubIcon />
        </IconButton>
        <Box sx={{ pt: 1, pb: 1, color: "black" }}>
          &copy; {new Date().getFullYear()} Budget Wallet by AmbroDev
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
