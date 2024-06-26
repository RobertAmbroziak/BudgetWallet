import React, { useState, useEffect, FC } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import LoginModal from "./loginModal";
import { useUser } from "../../contexts/userContext";
import { useLanguage } from "../../contexts/languageContext";
import translations from "../../translations";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  iat?: number;
  id?: string;
}

const Header: FC = () => {
  const { jwtToken, handleSetToken, handleRemoveToken } = useUser();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();
  const { language } = useLanguage();

  const pages = [
    { name: "lbl_homePage", path: "/" },
    { name: "lbl_applicationPanel", path: "/user" },
    { name: "lbl_adminPanel", path: "/admin" },
  ];

  const handleLogout = () => {
    googleLogout();
    handleRemoveToken();
    navigate("/");
  };

  const isValidToken = (jwtToken: string | null): boolean => {
    if (jwtToken) {
      try {
        const decodedToken: DecodedToken = jwtDecode(jwtToken);
        const expirationDate = new Date(decodedToken?.exp * 1000);
        const currentDate = new Date();
        return currentDate < expirationDate;
      } catch (error) {
        console.error("Failed to decode JWT", error);
        return false;
      }
    } else {
      return false;
    }
  };

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  useEffect(() => {
    const token = localStorage.getItem("budgetWalletToken");
    if (token) {
      handleSetToken(token);
    } else {
    }
  }, []);

  return (
    <>
      <AppBar
        position="static"
        sx={{ background: "linear-gradient(to right, #35424a, #a7b6bd)" }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontWeight: 700,
              }}
            >
              <img
                src="/wallet_icon.png"
                alt="Budget Wallet"
                style={{ width: "30px", height: "30px", marginRight: "5px" }}
              />
              BUDGET WALLET
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                    <NavLink
                      to={page.path}
                      style={({ isActive }) => ({
                        color: isActive ? "orange" : "inherit",
                        background: isActive
                          ? "linear-gradient(to right, #35424a, #a7b6bd)"
                          : "inherit",
                        textDecoration: "none",
                        width: "100%",
                        display: "block",
                      })}
                    >
                      <Typography textAlign="center">
                        {translations[language][`${page.name}`]}
                      </Typography>
                    </NavLink>
                  </MenuItem>
                ))}
                <MenuItem key={"loginButton"} onClick={handleCloseNavMenu}>
                  <Box
                    sx={{
                      display: { xs: "flex", md: "none" },
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    {jwtToken && isValidToken(jwtToken) ? (
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={handleLogout}
                      >
                        {translations[language].btn_logout}
                      </Button>
                    ) : (
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={openLoginModal}
                      >
                        {translations[language].btn_login}
                      </Button>
                    )}
                  </Box>
                </MenuItem>
              </Menu>
            </Box>
            <Typography
              variant="h5"
              noWrap
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontWeight: 700,
              }}
            >
              <img
                src="/wallet_icon.png"
                alt="Budget Wallet"
                style={{ width: "30px", height: "30px", marginRight: "5px" }}
              />
              BUDGET WALLET
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <NavLink
                    to={page.path}
                    style={({ isActive }) => ({
                      color: isActive ? "orange" : "inherit",
                      textDecoration: "none",
                      width: "100%",
                      display: "block",
                    })}
                  >
                    <Typography textAlign="center">
                      {translations[language][`${page.name}`]}
                    </Typography>
                  </NavLink>
                </MenuItem>
              ))}
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: "none", md: "flex" },
                  justifyContent: "flex-end",
                }}
              >
                {jwtToken && isValidToken(jwtToken) ? (
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handleLogout}
                  >
                    {translations[language].btn_logout}
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => openLoginModal()}
                  >
                    {translations[language].btn_login}
                  </Button>
                )}
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <LoginModal
        isOpen={isLoginModalOpen}
        handleClose={closeLoginModal}
        onSetToken={handleSetToken}
      />
    </>
  );
};

export default Header;
